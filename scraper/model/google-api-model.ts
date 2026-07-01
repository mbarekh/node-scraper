type Sitelink = {
  title: string;
  link: string;
  snippet: string;
};

type Sitelinks = {
  expanded: Sitelink[];
};

type AboutSource = {
  description: string;
  source_info_link: string;
  icon: string;
};

type AboutThisResult = {
  source: AboutSource;
  languages: string[];
  regions: string[];
};

type OrganicResultItem = {
  position: number;
  title: string;
  link: string;
  redirect_link: string;
  displayed_link: string;
  favicon: string;
  snippet: string;
  snippet_highlighted_words: string[];
  sitelinks: Sitelinks;
  about_this_result: AboutThisResult;
  about_page_link: string;
  about_page_serpapi_link: string;
  source: string;
};

type TextBlockItem = {
  type: string;
  snippet?: string;
  list: Sitelink[];
};

export type GoogleResponse = {
  organic_results: OrganicResultItem[];
  text_blocks: TextBlockItem[] | undefined;
};
