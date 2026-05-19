export const ACCEPT_COOKIES_KEYWORDS = [
  "accept",
  "agree",
  "consent",
  "allow",
  "got it",
  "continue",
  "yes",
  "confirm",
  "understand",
] as const;

export const PUBLIC_ATS_DOMAINS = [
  "greenhouse.io",
  "ashbyhq.com",
  "lever.co",
  "workable.com",
  "myworkdayjobs.com",
] as const;

export type ATS_DOMAIN_KEY = (typeof PUBLIC_ATS_DOMAINS)[number];

export const PRIVATE_ATS_DOMAINS = [
  "smartrecruiters.com",
  "jobvite.com",
  "bamboohr.com",
  "teamtailor.com",
  "recruitee.com",
  "icims.com",
  "successfactors.com",
  "jobs.sap.com",
  "taleo.net",
  "oraclecloud.com",
  "adp.com",
  "rippling.com",
  "pinpointhq.com",
  "manatal.com",
  "hirehive.com",
  "fountain.com",
  "jobadder.com",
  "talentlyft.com",
  "freshteam.com",
  "zohorecruit.com",
  "breezy.hr",
  "jazz.co",
  "clearcompany.com",
  "trakstar.com",
  "paycor.com",
  "jobscore.com",
  "applicantpro.com",
  "bullhorn.com",
  "bullhornstaffing.com",
  "recruitcrm.io",
  "vincere.io",
  "tracker-rms.com",
  "pcrecruiter.net",
  "jobdiva.com",
  "tempworks.com",
  "eightfold.ai",
  "hirevue.com",
  "paradox.ai",
  "cornerstoneondemand.com",
  "csod.com",
  "peoplefluent.com",
  "pageuppeople.com",
  "talentsoft.com",
  "ukg.com",
  "ultipro.com",
  "dayforcehcm.com",
  "ceridian.com",
  "kenexa.com",
  "brassring.com",
  "smartsearchonline.com",
  "getro.com",
  "talentreef.com",
  "talexio.com",
  "submittable.com",
  "apploi.com",
  "wellfound.com",
  "angel.co",
] as const;

export const CAREERS_KEYWORDS = [
  "/careers",
  "/job",
  "/career-jobs",
  "/join",
  "/work",
  "/employment",
  "/vacancies",
  "/hiring",
  "/opportunities",
] as const;

export const EXCLUDED_JOBS_KEYWORDS = [
  "jobs-monitoring", // conflict with job
  "blog",
  "policies",
  "developers.",
  "workflow", // conflict with work
  "tracking-software", // conflict with software
] as const;

export const HASHTAG_CAREERS_KEYWORDS = [
  "#openings",
  "#open-roles",
  "#positions",
  "#roles",
  "#vacancies",
  "#opportunities",
  "#jobs",
  "#careers",
  "#join",
  "#work",
  "#employment",
  "#hiring",
] as const;

export const SEARCH_KEYWORDS = ["search", "Search", "SEARCH"];

export const EXCLUDE_SOFTWARE_KEYWORDS = [
  "praxissoftware",
  "business developer",
  "business-developer",
  "account executive",
  "account-executive",
] as const;

export const SOFTWARE_KEYWORDS = [
  // Core
  "software",
  "developer",
  "programmer",

  // Frontend
  "front end",
  "front-end",
  "frontend",

  // Backend
  "back end",
  "back-end",
  "backend",

  // Fullstack
  "full stack",
  "full-stack",
  "fullstack",

  // languagues & frameworks
  "vue",
  "react",
  "reactnative",
  "react-native",
  "react native",
  "angular",
  "next",
  "spring",
  "javascript",
  "typescript",
  "html",
  "css",
  "python",
  "java",
  "golang",
  "kubernetes",
  "c#",
  ".net",
  "php",
  "c++",
  "rust",
  "kotlin",
  "swift",
  "ruby",
  "scala",
  "bash",
  "android",

  // others
  "devops",
  "site reliability engineer",
  "tech lead",
  "data engineer",
  "data migrations engineer",
  "mobile engineer",
  "design engineer",
  // "analytics engineer",
  // "ai engineer",
  // "machine learning engineer",
] as const;
