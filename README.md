# Node Scraper

A Node.js and TypeScript web scraping pipeline for discovering companies, enriching company profiles, and extracting software engineering job opportunities from company websites.

Node Scraper combines Google Search via SERP API, AI-assisted enrichment, OpenAI-based normalization, and ZenRows-powered scraping to turn unstructured web data into clean JSON datasets for company intelligence and engineering job discovery.

## Features

- Automated company name generation
- LinkedIn company profile discovery through Google Search operators
- Company enrichment using SERP API AI-powered search
- OpenAI-powered data normalization and description generation
- Website crawling to discover careers and jobs pages
- Software engineering job extraction from company websites and ATS pages
- Job normalization into structured fields:
  - Description
  - Requirements
  - Benefits
  - Location
  - Employment type
  - Workplace type
  - Seniority
  - Salary range
- Job classification into:
  - Frontend
  - Backend
  - Full Stack
  - DevOps
- Scraping support through ZenRows:
  - Proxy rotation
  - CAPTCHA handling
  - Anti-bot protection
  - Header management
- Local JSON-based datasets for companies, jobs, errors, and scraping state

## Architecture Overview

```text
Company Generator
       |
       v
Google Search via SERP API
       |
       v
LinkedIn Company URL Discovery
       |
       v
SERP API AI Enrichment
       |
       v
OpenAI Normalization
       |
       v
Company Dataset
       |
       v
Website / Careers Page Scraping
       |
       v
Software Job Extraction
       |
       v
OpenAI Job Structuring
       |
       v
Job Classification
       |
       v
Structured JSON Output
```

The pipeline is split into two major stages:

1. Company discovery and enrichment
2. Careers page discovery, job scraping, and job normalization

Data is persisted in JSON files under `src/companies/data` and `src/jobs/data`.

## Tech Stack

- Node.js
- TypeScript
- SERP API
- OpenAI API
- ZenRows
- Playwright
- Cheerio
- html-to-text
- dotenv
- tsx

## How It Works

### 1. Generate Company Names

The pipeline generates candidate company names, currently scoped by location, such as United States-based companies.

### 2. Discover LinkedIn Profiles

For each company, the scraper queries Google Search through SERP API using advanced search operators, such as restricting results to LinkedIn company pages.

Example search intent:

```text
site:linkedin.com/company "Company Name"
```

### 3. Extract LinkedIn Company URLs

The scraper parses search results and extracts matching LinkedIn company profile URLs.

### 4. Enrich Company Data

The pipeline uses SERP API AI-powered search to retrieve public company information such as:

- Company size
- Company type
- Founding year
- Official website
- Industry
- Followers
- Overview

### 5. Normalize Company Profiles with OpenAI

Raw enrichment results are sent to the OpenAI API and converted into clean, typed JSON. OpenAI is also used to generate concise, high-quality company descriptions.

### 6. Visit Company Websites

For each enriched company, the scraper visits the official website and attempts to locate the careers or jobs page.

### 7. Scrape Job Listings

The scraper focuses on software engineering roles and filters out irrelevant postings using software-related keywords.

### 8. Extract Job Details

Job pages are scraped and optimized into text suitable for AI processing.

### 9. Normalize Jobs with OpenAI

OpenAI transforms raw job content into structured fields including requirements, benefits, locations, seniority, workplace type, and employment type.

### 10. Classify Jobs

Each job is classified into one of the supported software engineering categories:

- `frontend`
- `backend`
- `fullstack`
- `devops`

## Installation

### Prerequisites

- Node.js 20 or newer recommended
- npm
- SERP API key
- OpenAI API key
- ZenRows API key

### Setup

Clone the repository:

```bash
git clone https://github.com/your-org/talentgraph-scraper.git
cd talentgraph-scraper
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```bash
touch .env
```

Add the required environment variables:

```env
SERP_API_KEY=your_serp_api_key
OPENAI_API_KEY=your_openai_api_key
ZENROWS_API_KEY=your_zenrows_api_key
```

Build the project:

```bash
npm run build
```

## Usage

### Run Company Discovery and Enrichment

```bash
npx tsx src/companies/companies-main-script.ts <companies-to-update> <companies-to-generate>
```

Example:

```bash
npx tsx src/companies/companies-main-script.ts 25 50
```

This generates 50 candidate company names and updates up to 25 company profiles.

### Run Job Scraping and Normalization

```bash
npx tsx src/jobs/jobs-main-script.ts <companies-to-scrape>
```

Example:

```bash
npx tsx src/jobs/jobs-main-script.ts 20
```

This visits up to 20 eligible company websites, finds careers pages, extracts software jobs, normalizes the data, and appends results to the jobs dataset.

### Run Tests

```bash
npm test
```

## Output Format

### Company Data

Company records are stored in:

```text
src/companies/data/companies-info.json
```

Example:

```json
{
  "name": "ExampleCloud",
  "website": "https://examplecloud.com",
  "industry": "Software",
  "customerTypes": ["B2B"],
  "technology": "Cloud Systems",
  "companySize": "201-500",
  "foundedYear": 2018,
  "description": ["ExampleCloud helps engineering teams deploy, monitor, and scale cloud-native applications."],
  "id": "examplecloud",
  "lastScrapedAt": "2026-05-19",
  "linkedinUrl": "https://www.linkedin.com/company/examplecloud",
  "overview": "ExampleCloud is a privately held software company focused on cloud infrastructure.",
  "followers": 12500,
  "followersInfo": "12,500 followers on LinkedIn",
  "listJobsUrl": "https://examplecloud.com/careers"
}
```

### Job Data

Job records are stored in:

```text
src/jobs/data/jobs-info.json
```

Example:

```json
{
  "title": "Senior Backend Engineer",
  "url": "https://examplecloud.com/careers/senior-backend-engineer",
  "locations": [
    {
      "scope": "country",
      "workplaceType": "remote",
      "businessRegion": "amer",
      "continent": "northamerica",
      "country": "unitedstates"
    }
  ],
  "remoteLocationTokens": ["United States"],
  "onsiteOrHybrifLocationTokens": [],
  "skills": ["Node.js", "TypeScript", "PostgreSQL", "AWS"],
  "workplaceTypes": ["remote"],
  "employmentType": "fulltime",
  "description": ["Build and operate backend services that power customer-facing cloud infrastructure products."],
  "requirements": [
    "5+ years of backend engineering experience",
    "Strong production experience with TypeScript and distributed systems"
  ],
  "benefits": ["Health insurance", "Remote work stipend", "Equity package"],
  "overview": "Senior backend role focused on scalable cloud infrastructure services.",
  "seniority": "senior",
  "category": "backend",
  "publishedAt": "2026-05-10",
  "companyId": "examplecloud",
  "salaryRange": {
    "min": 150000,
    "max": 210000,
    "interval": "year",
    "currency": "USD",
    "bonus": true,
    "equity": true
  }
}
```

## Configuration

Configuration is primarily handled through source maps, prompts, keyword lists, and JSON data files.

### Environment Variables

| Variable          | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `SERP_API_KEY`    | API key used for Google Search and AI-powered SERP API queries |
| `OPENAI_API_KEY`  | API key used for normalization, enrichment, and classification |
| `ZENROWS_API_KEY` | API key used for proxy-backed scraping and anti-bot handling   |

### Company Configuration

Company-related configuration lives in:

```text
src/companies
```

Key files include:

```text
src/companies/prompts
src/companies/data/companies-info.json
src/companies/data/error-companies.json
src/companies/data/forbidden-companies.json
src/model/companies-model.ts
```

You can adjust:

- Company generation prompts
- Enrichment prompts
- Allowed industries
- Forbidden industries
- Company size values
- Business type values
- Technology categories

### Job Configuration

Job-related configuration lives in:

```text
src/jobs
```

Key files include:

```text
src/jobs/jobs-keywords.ts
src/jobs/map/job-info-map.ts
src/jobs/data/jobs-info.json
src/jobs/data/jobs-errors.json
src/model/jobs-model.ts
```

You can adjust:

- Software job keywords
- Excluded job keywords
- Supported job categories
- Seniority levels
- Workplace types
- Employment types
- Supported locations
- Supported currencies
- ATS scraping behavior

## Limitations & Considerations

- SERP API, OpenAI, and ZenRows usage may incur cost.
- Search results can vary by region, query wording, and time.
- Company and job data may be incomplete, stale, or inconsistent across public sources.
- AI-normalized output should be validated before being used in production workflows.
- Some websites may block scraping even with proxy and anti-bot tooling.
- CAPTCHA bypass and proxy usage should comply with provider terms and applicable laws.
- Respect `robots.txt`, website terms of service, and data privacy regulations.
- Rate limits should be handled carefully to avoid unnecessary API failures or account throttling.
- LinkedIn and company websites may change page structure, causing extraction logic to require maintenance.

## Roadmap

- Add database persistence with PostgreSQL or MongoDB
- Add a web dashboard for browsing companies and jobs
- Support more job categories such as Data Engineering, Security, Mobile, and ML Engineering
- Add queue-based scraping for larger workloads
- Add retry policies and backoff strategies
- Add richer observability and scraping metrics
- Improve ATS-specific scrapers
- Add deduplication for companies and job postings
- Add salary estimation when compensation is missing
- Add automated data quality checks
- Add CI workflows for tests and linting

## Contributing

Contributions are welcome.

Recommended workflow:

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Add or update tests when relevant.
5. Run the test suite.
6. Open a pull request with a clear description of the change.

Please keep contributions scoped, readable, and aligned with the existing TypeScript style.

## License

MIT License. Update this section with the final license text before publishing.
