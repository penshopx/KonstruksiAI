# Tender Intelligence live verification

## Result — 2026-11-08

**Passed with a real OpenRouter analysis.**

Tested the running development app through `/tender-intelligence`, using a
synthetic registered user and the real `/api/tender-intelligence/analyze` endpoint.
No AI responses were mocked.

### Inputs

- Project: Rehabilitasi Jembatan Sungai Citarum.
- Tender: Tender Konstruksi Pemerintah.
- Details: Bandung, Rp18 billion, 90 days during rainy season, submission in
  seven days, bridge-specific SBU and experience, river-work safety requirements.
- Present and clean: Akta Perusahaan, NPWP.
- Absent: SIUP/TDP, Laporan Keuangan Audited, Surat Referensi Bank.
- Present but problematic: expired SBU covering buildings rather than bridges,
  expired SMK3, experience limited to buildings.

### Confirmed

- Unauthenticated analyze request returns 401.
- Authenticated empty-document request returns 400.
- Overview and Risiko initially show “Belum ada analisis.”
- Browser submits all eight document statuses and notes without alteration.
- OpenAI credits were still exhausted, so at the user's direction Tender
  Intelligence was switched to their own OpenRouter key. The key is stored as a
  Replit Secret and is not part of this repository.
- OpenRouter's model catalog confirmed `openai/gpt-4o-mini`; the endpoint now
  calls that model. Chat and Solver still use their existing OpenAI configuration.
- A real, successful analysis request returned HTTP 200; no model responses were
  mocked.
- Clean Akta Perusahaan and NPWP scored 100. The four absent documents scored
  0. Expired/inapplicable SBU and SMK3 and building-only experience scored 20,
  each with relevant missing elements and notes.
- Overall completeness was 33; the analysis identified six document-related
  risks and returned project-specific recommendations and summaries.
- The browser rendered the returned scores and all five summary fields on
  Overview, and descriptions, impacts, severities, and mitigations on Risiko.
- Empty states, error banner/retry behavior from the earlier no-credit run,
  auth and input validation, and absence of browser crashes were confirmed.

## Repeat the live verification

Start the existing API Server and KonstruksiAI web workflows, then run:

```sh
flock /tmp/konstruksi-ai-browser-check.lock \
  pnpm --filter @workspace/konstruksi-ai exec tsx scripts/check-tender-live.ts
```

This opt-in live check consumes provider credits and registers a new synthetic
development user on each run. It is deliberately not an automatic gate. It
checks actual scores and visible result content when the request succeeds.
Exit code 2 means the analysis request failed; inspect server logs for the cause.
