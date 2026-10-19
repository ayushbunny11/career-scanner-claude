# career-scanner-claude

A daily job scanner built on the MIT-licensed [career-ops](https://github.com/career-ops-hq/career-ops) portal scanner.

- `portals.yml` — the companies to scan and the filters (AI / GenAI / agentic / Forward Deployed roles in India).
- `.github/workflows/daily-scan.yml` — runs the scanner every morning on GitHub Actions and commits the results.
- `data/scan-history.tsv` — every posting the scanner has surfaced (url, first_seen, portal, title, company, status, location). A daily Claude task reads the rows with a recent `first_seen`.
- `data/last-scan.log` — log of the most recent run.

The scanner uses plain HTTP requests to public ATS feeds, so it costs no AI tokens and needs no secrets.
