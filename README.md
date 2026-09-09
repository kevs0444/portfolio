# Mar Kevin Portfolio

This project is now a Next.js portfolio site with:

- App Router structure
- Responsive framed UI
- Theme toggle
- Resume modal preview
- Project detail modals
- Gmail contact form with validated sender details and reply-to support

## Run locally

```bash
npm install
npm run dev
```

## Bop AI: automatic model routing

`GROQ_API_KEY` stays server-side and is required for chat and transcription. Automatic routing is the default, including when an existing `GROQ_MODEL` is set. The server caches Groq's live model catalog for five minutes and only selects known answering models that appear in it.

| Question | Preferred model | When unavailable |
| --- | --- | --- |
| Greetings, contact, quick facts | Llama 3.1 8B Instant | GPT-OSS 20B |
| General portfolio questions | Llama 3.3 70B Versatile | GPT-OSS 20B |
| Technical projects and tools | GPT-OSS 20B | GPT-OSS 120B |
| Comparisons, assessments, detailed questions | GPT-OSS 120B | Available alternative |

Routing uses question keywords, length, and recent user context for follow-ups. All answering models receive the same portfolio facts and Bop AI instructions. It does not query every model for every message. One alternative is tried for retryable upstream failures; errors remain errors, with no fabricated fallback answers or exposed reasoning.

Free-tier defaults use one generation call per question. Catalog requests are cached; quota exhaustion may still prevent a reply. Set `GROQ_ROUTING=single` to use only `GROQ_MODEL` (or the legacy Llama 3.3 default if omitted), provided that model is available. No change to existing credentials is required for automatic routing.

For provider redundancy, set `GEMINI_API_KEY` from Google AI Studio. When Groq is unavailable, rate-limited, or has no usable model, Bop AI retries through Gemini while keeping the same portfolio knowledge and behavior rules. `GEMINI_MODEL` is optional and defaults to `gemini-3.7-flash`. Google states that free-tier prompts and responses may be used to improve its products, so only the public portfolio knowledge base should be sent through this fallback.

Set `CEREBRAS_API_KEY` to add a final fallback after Groq and Gemini. Bop AI reads the account's live Cerebras model catalog, caches it for five minutes, and prefers `gpt-oss-120b` before other available text models; `CEREBRAS_MODEL` can select another model exposed to the account. All provider keys remain server-side and are never returned to the browser.

Optional `GROQ_MODERATION=true` adds a moderation call before each answer. It uses Llama Guard 4 when available, otherwise GPT-OSS Safeguard 20B. Safeguard is a preview model; if moderation is enabled but unavailable or invalid, the request fails rather than bypassing it. Moderation is off by default to conserve free-tier requests; portfolio scope instructions remain active.

On 2026-09-09, the configured Groq key successfully tested GPT-OSS 20B and GPT-OSS 120B. The configured Gemini key successfully tested Gemini 3.7 Flash, and a forced Groq failure switched `/api/chat` to Gemini successfully. Llama 3.1/3.3 were not exposed to this Groq key. Model access can change independently of the public status page.

The configured Cerebras key authenticated and listed `gpt-oss-120b`, `gemma-4-31b`, and `qwen-3.8-27b`, but every completion returned HTTP 402 with a billing-required response. The fallback is implemented and locally covered, but it will not serve answers until the Cerebras account has active inference access or credits.

Verification:

```bash
node --test tests/groq.test.cjs
npm run build
```

References: [Groq models](https://console.groq.com/docs/models), [reasoning configuration](https://console.groq.com/docs/reasoning).

## Contact email

The contact form sends through Gmail to `markevinalcantara40@gmail.com`. Set `EMAIL_PASS` to the Gmail app password in local and Vercel environments. `EMAIL_USER` and `CONTACT_TO_EMAIL` are optional overrides; both default to the portfolio address. After changing Vercel environment variables, redeploy the site.
