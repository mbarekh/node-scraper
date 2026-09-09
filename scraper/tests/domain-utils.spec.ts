import test from "node:test";
import assert from "node:assert/strict";
import {
  getCompanyName,
  hasId,
  isValidWebsite,
  normalizeWebsite,
  toAbsoluteUrl,
} from "../utils/domain-utils";

test("isValidWebsite", () => {
  assert.strictEqual(isValidWebsite("https://www.example.com"), true);
  assert.strictEqual(isValidWebsite("http://www.lateralgroup.com"), true);
  assert.strictEqual(isValidWebsite("http://example.com"), true);
  assert.strictEqual(isValidWebsite("https://subdomain.example.com"), true);
  assert.strictEqual(isValidWebsite("https://foo.bar.example.com"), true);

  assert.strictEqual(isValidWebsite("kraken.com"), true);
  assert.strictEqual(isValidWebsite("example.fr"), true);
  assert.strictEqual(isValidWebsite("my-company.dev"), true);

  assert.strictEqual(isValidWebsite("HTTPS://example.com"), true);
  assert.strictEqual(isValidWebsite("HTTP://example.com"), true);

  assert.strictEqual(isValidWebsite("invalid-url"), false);
  assert.strictEqual(isValidWebsite("deded"), false);
  assert.strictEqual(isValidWebsite("deded."), false);
  assert.strictEqual(isValidWebsite(".com"), false);
  assert.strictEqual(isValidWebsite("example"), false);
  assert.strictEqual(isValidWebsite("example."), false);
  assert.strictEqual(isValidWebsite("http://"), false);
  assert.strictEqual(isValidWebsite("https://"), false);

  assert.strictEqual(isValidWebsite("ftp://example.com"), false);
  assert.strictEqual(isValidWebsite("javascript://example.com"), false);

  assert.strictEqual(isValidWebsite("https://example"), false);
  assert.strictEqual(isValidWebsite("https://example..com"), false);
  assert.strictEqual(isValidWebsite("https://.example.com"), false);
});

test("normalizeWebsite", () => {
  assert.strictEqual(
    normalizeWebsite("https://www.example.com"),
    "https://example.com",
  );
  assert.strictEqual(
    normalizeWebsite("http://www.lateralgroup.com"),
    "https://lateralgroup.com",
  );
  assert.strictEqual(
    normalizeWebsite("http://example.com"),
    "https://example.com",
  );
  assert.strictEqual(
    normalizeWebsite("https://subdomain.example.com"),
    "https://subdomain.example.com",
  );
  assert.strictEqual(normalizeWebsite("invalid-url"), null);
  assert.strictEqual(
    normalizeWebsite("https://www.example.com/path"),
    "https://example.com/path",
  );
});

test("hasId - numeric IDs", () => {
  assert.strictEqual(
    hasId("https://careers.chime.com/en/jobs/8322458002"),
    true,
  );
  assert.strictEqual(
    hasId(
      "https://careers.chime.com/en/jobs/09bf6010-898c-42c0-b9f8-580aa058d75c",
    ),
    true,
  );
  assert.strictEqual(hasId("https://example.com/jobs/123456"), true);
  assert.strictEqual(hasId("https://example.com/jobs/12345"), false);
  assert.strictEqual(hasId("https://example.com/jobs/page/2"), false);
  assert.strictEqual(hasId("https://example.com/jobs/2024/openings"), false);
});

test("hasId - GUID-like IDs", () => {
  assert.strictEqual(
    hasId("https://jobs.lever.co/company/cee89c66-dd27-4242-9cbc-d0316cb3e3a6"),
    true,
  );
  assert.strictEqual(
    hasId("https://example.com/jobs/abcd-1234-ef30-5678"),
    true,
  );
  assert.strictEqual(hasId("https://example.com/jobs/1234-5678-9012"), false);
  assert.strictEqual(hasId("https://example.com/jobs/abc-123-def"), false);
  assert.strictEqual(
    hasId("https://doctolib.legal/B2C-Cookie-Policy-Career-COM"),
    false,
  );
});

test("hasId - mixed real-world cases", () => {
  assert.strictEqual(
    hasId(
      "https://careers.chime.com/en/jobs/8322458002/senior-software-engineer",
    ),
    true,
  );
  assert.strictEqual(
    hasId(
      "https://jobs.lever.co/kraken/cee89c66-dd27-4242-9cbc-d0316cb3e3a6/apply",
    ),
    true,
  );
  assert.strictEqual(hasId("https://example.com/careers/jobs"), false);
  assert.strictEqual(hasId("https://example.com/jobs/123/456"), false);
  assert.strictEqual(
    hasId("https://www.zenrows.com/careers/job?gh_jid=4772531101"),
    true,
  );
  assert.strictEqual(
    hasId("https://job-boards.greenhouse.io/wrike/jobs/4676119005"),
    true,
  );
});

test("getCompanyName - basic domains", () => {
  assert.strictEqual(getCompanyName("https://duolingo.com"), "duolingo");
  assert.strictEqual(getCompanyName("https://doctolib.fr"), "doctolib");
  assert.strictEqual(getCompanyName("https://pandadoc.com"), "pandadoc");
});

test("getCompanyName - with www", () => {
  assert.strictEqual(getCompanyName("https://www.duolingo.com"), "duolingo");
  assert.strictEqual(getCompanyName("https://www.chime.com"), "chime");
});

test("getCompanyName - subdomains", () => {
  assert.strictEqual(getCompanyName("https://jobs.lever.co"), "jobs");
  assert.strictEqual(getCompanyName("https://api.stripe.com"), "api");
});

test("getCompanyName - with paths", () => {
  assert.strictEqual(
    getCompanyName("https://duolingo.com/careers"),
    "duolingo",
  );
  assert.strictEqual(
    getCompanyName("https://doctolib.fr/jobs/123"),
    "doctolib",
  );
});

test("getCompanyName - different protocols", () => {
  assert.strictEqual(getCompanyName("http://kraken.com"), "kraken");
});

test("toAbsoluteUrl", () => {
  const base = "https://example.com/path/page";
  assert.strictEqual(
    toAbsoluteUrl({ url: base, href: "https://google.com/jobs" }),
    "https://google.com/jobs",
  );
  assert.strictEqual(
    toAbsoluteUrl({ url: base, href: "/careers" }),
    "https://example.com/careers",
  );
  assert.strictEqual(
    toAbsoluteUrl({ url: base, href: "jobs" }),
    "https://example.com/path/jobs",
  );
  assert.strictEqual(
    toAbsoluteUrl({ url: base, href: "#section" }),
    "https://example.com/path/page#section",
  );
});
