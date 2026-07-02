import type { Cheerio, CheerioAPI } from "cheerio";
import type { Locator, Page } from "playwright";
import {
  ACCEPT_COOKIES_KEYWORDS,
  EXCLUDE_SOFTWARE_KEYWORDS,
  SOFTWARE_KEYWORDS,
} from "./jobs-keywords";
import type {
  DomSearchParams,
  HandlerParams,
  HtmlTag,
} from "../model/jobs-model";
import path from "path";
import type { AnyNode, Element } from "domhandler";
import { trim } from "../utils/extra-utils";
import { htmlToText } from "html-to-text";

export const buildContainsSelector = ({
  keywords,
  tags,
}: {
  keywords: string[];
  tags: HtmlTag[];
}): string => {
  return tags
    .map((tag) => keywords.map((kw) => `${tag}:contains("${kw}")`).join(", "))
    .join(", ");
};

export const buildSelector = ({
  keyword,
  tags,
  excludedKeywords = [],
  attr,
  caseSensitive = false,
}: {
  keyword: string;
  tags: HtmlTag[];
  excludedKeywords?: readonly string[];
  attr: string;
  caseSensitive?: boolean;
}): string => {
  const flag = caseSensitive ? "" : "i";
  return tags
    .map((tag) => {
      const base = keyword
        ? `${tag}[${attr}*="${keyword}" ${flag}]`
        : `${tag}[${attr}]`;
      const exclusions = excludedKeywords
        .map((exclude) => `:not([${attr}*="${exclude}"${flag}])`)
        .join("");
      return base + exclusions;
    })
    .join(", ");
};

export const findAndHandle = async <T>({
  $,
  domSearchParams,
  handler,
}: {
  $: CheerioAPI;
  domSearchParams: DomSearchParams[];
  handler: (handleParams: HandlerParams) => Promise<T | null>;
}): Promise<T | null> => {
  for (const {
    keywords,
    attr,
    tags,
    excludedKeywords,
    caseSensitive,
    predicate = () => true,
  } of domSearchParams) {
    for (const keyword of keywords) {
      const selector = buildSelector({
        tags,
        attr,
        keyword,
        excludedKeywords,
        caseSensitive,
      });
      const elements = $(selector);
      const attrValue = elements.first().attr(attr)!;
      if (elements.length > 0 && predicate({ keyword, attrValue })) {
        console.log("Match:", { keyword, attrValue });
        return await handler({ keyword, attrValue, tags, attr });
      }
    }
  }
  return null;
};

export const waitForDomContentLoaded = async ({
  page,
  timeout,
}: {
  page: Page;
  timeout: number;
}) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(timeout);
};

export const clickAndGetPage = async ({
  element,
  page,
}: {
  element: Locator;
  page: Page;
}): Promise<Page> => {
  const context = page.context();
  const initialUrl = page.url();
  const newPagePromise = context.waitForEvent("page");
  const urlChangePromise = page
    .waitForURL((url) => url.toString() !== initialUrl)
    .then(() => page);
  await element.evaluate((el: HTMLElement) => el.click());
  const resultPage = await Promise.race([
    newPagePromise,
    urlChangePromise,
  ]).catch(() => page);
  await waitForDomContentLoaded({ page: resultPage, timeout: 2000 });
  return resultPage;
};

export const acceptCookies = async ({ page }: { page: Page }) => {
  await page.evaluate((keywords: readonly string[]) => {
    const combinedRegex = new RegExp(keywords.join("|"), "i");
    const buttons = Array.from(document.querySelectorAll("button"));
    const acceptBtn = buttons.find((btn) => combinedRegex.test(btn.innerText));
    acceptBtn?.click();
  }, ACCEPT_COOKIES_KEYWORDS);
};

export const selectFromPage = async ({
  page,
  selector,
}: {
  page: Page;
  selector: string;
}): Promise<Locator | null> => {
  const locator = page.locator(selector).first();
  const count = await locator.count();
  return count > 0 ? locator : null;
};

export const selectElementByText = async ({
  page,
  tag,
  keyword,
}: {
  page: Page;
  tag: HtmlTag;
  keyword: string;
}): Promise<Locator | null> => {
  const textMatcher = new RegExp(keyword, "i");
  const locator = page.locator(tag, { hasText: textMatcher }).first();
  const count = await locator.count();
  return count > 0 ? locator : null;
};

export const hasSoftwareKeyword = (description: string): boolean => {
  const lowerDescription = description.toLowerCase();
  return (
    EXCLUDE_SOFTWARE_KEYWORDS.every(
      (excludeKeyword) => !lowerDescription.includes(excludeKeyword),
    ) && SOFTWARE_KEYWORDS.some((keyword) => lowerDescription.includes(keyword))
  );
};

export const optimizeContentForAI = ($: CheerioAPI): string => {
  const main = $("main");
  const body = $("body");
  let scope: Cheerio<AnyNode>;

  if (main.length === 1) {
    scope = main;
  } else if (body.length === 1) {
    scope = body;
  } else {
    scope = $.root();
  }

  const elementsToRemove: string[] = [
    "script",
    "style",
    "noscript",
    "iframe",
    "img",
    "svg",
    "picture",
    "source",
    "canvas",
    "button",
    "input",
    "select",
    "textarea",
    "form",
    "head",
    "footer",
    "[style*='display:none']",
    "[style*='visibility:hidden']",
    "[hidden]",
  ];

  scope.find(elementsToRemove.join(", ")).remove();

  scope
    .find("*")
    .contents()
    .each((_, el: AnyNode) => {
      if (el.type === "comment") {
        $(el).remove();
      }
    });

  scope.find("*").each((_, el: AnyNode) => {
    const attribs = (el as Element).attribs;
    if (!attribs) {
      return;
    }
    for (const attr of Object.keys(attribs)) {
      $(el).removeAttr(attr);
    }
  });

  // Remove empty elements (iterate multiple times because of imbricated empty elements)
  for (let i = 0; i < 10; i++) {
    scope.find("*").each((_, el: AnyNode) => {
      const node = $(el);
      const hasText = trim(node.text()).length > 0;
      const hasChildren = node.children().length > 0;
      if (!hasText && !hasChildren) {
        node.remove();
      }
    });
  }

  return htmlToText(trim(scope.html()), { wordwrap: false });
};

const jobsDataFolderPath = path.join("src", "jobs", "data");

export const JOBS_DATA_FILES = {
  privateAts: path.join(jobsDataFolderPath, "private-ats.json"),
  careersErrors: path.join(jobsDataFolderPath, "careers-errors.json"),
  jobsErrors: path.join(jobsDataFolderPath, "jobs-errors.json"),
  skillsErrors: path.join(jobsDataFolderPath, "skills-errors.json"),
  locationsErrors: path.join(jobsDataFolderPath, "locations-errors.json"),
  jobsInfo: path.join(jobsDataFolderPath, "jobs-info.json"),
};
