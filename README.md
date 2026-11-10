# AI Interview Prep

An interview-practice web application built with Next.js. Users can sign in with Clerk, enter a target role and experience level, generate interview questions with Google's Gemini API, practice answers with browser speech recognition, and review AI-generated feedback.

> **Audit note:** This repository builds successfully, but it is not production-ready as-is. The database connection string is configured as a `NEXT_PUBLIC_` value and browser components perform database operations directly. The API route also lacks authentication and rate limiting. Review [the security audit](./PROJECT_DOCUMENTATION/06_SECURITY_AUDIT.md) and [deployment readiness checklist](./PROJECT_DOCUMENTATION/11_DEPLOYMENT_READINESS_CHECKLIST.md) before deploying.

## Features found in the source

- Clerk sign-in and sign-up pages, with dashboard pages protected by middleware.
- Dashboard interview creation and a list of existing interviews.
- Gemini-generated questions and answers for a job role.
- Webcam preview, browser speech-to-text, question text-to-speech, and answer feedback.
- A feedback page showing saved answers, ratings, and improvement suggestions.
- A static upgrade page linking to a Stripe **test** checkout URL; application payment processing is not implemented.

These features are present in code. The repository has no automated test suite, so end-to-end integrations and production behavior have not been independently verified.

## Technology overview

| Area | Technology |
|---|---|
| Web application | Next.js 14 App Router, React 18, JavaScript |
| Styling and UI | Tailwind CSS 3, Radix UI primitives, local shadcn-style components |
| Authentication | Clerk for Next.js |
| Database | PostgreSQL, accessed through Neon serverless HTTP and Drizzle ORM |
| AI | Google Generative AI SDK; source configures `gemini-3.5-flash` |
| Browser features | `react-webcam`, `react-hook-speech-to-text`, Web Speech text-to-speech |
| Package manager/build | npm, `package-lock.json`, Next.js build |

This is **not a MERN stack application**: the repository uses PostgreSQL rather than MongoDB and has no separate Express server. See [the full technology inventory](./PROJECT_DOCUMENTATION/01_TECH_STACK.md).

## Screenshots

The screenshots below are existing GitHub-hosted images referenced by the previous README. Their current correspondence to the UI was not independently checked.

![Dashboard screenshot](https://github.com/user-attachments/assets/9e4a46d8-9224-4683-891a-69396acd84ab)
![Interview details screenshot](https://github.com/user-attachments/assets/308f75b8-90fd-4b13-9f1a-af87048e1907)
![Interview practice screenshot](https://github.com/user-attachments/assets/538e9090-20ee-4c68-9904-7a20cfc12794)

## Local setup

### Prerequisites

- Node.js with support for `node:process`'s `loadEnvFile` (Node 20.6 or later is appropriate).
- npm.
- A Clerk application, a PostgreSQL database reachable through the Neon serverless driver, and a Google Gemini API key.
- A modern browser that permits webcam and speech-recognition access for interview practice.

### Configure environment

There is no `.env.example` in this repository. Create a local `.env.local` file, keep it out of source control, and supply the values from the relevant provider dashboards:

| Variable | Purpose | Current use |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser SDK | Expected by Clerk |
| `CLERK_SECRET_KEY` | Clerk server SDK | Expected by Clerk |
| `GEMINI_API_KEY` | Gemini API credential | Read by the question API route and `utils/GeminiAIModal.js` |
| `NEXT_PUBLIC_DRIZZLE_DB_URL` | PostgreSQL connection URL | Used by Drizzle in client-imported modules; the `NEXT_PUBLIC_` prefix is a serious security issue |
| `NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT` | Number of generated questions | Read by the API route; defaults to `5` if unset |
| `NEXT_PUBLIC_INFORMATION` | Interview-page information text | Read in a client component |
| `NEXT_PUBLIC_QUESTION_NOTE` | Question-page note text | Read in a client component |

Never put a real secret into a `NEXT_PUBLIC_` variable. In particular, do not deploy the current database URL setting until database access has been moved behind authenticated server-side code and the variable has been renamed/configured as a server-only secret.

### Install, run, and build

```powershell
npm ci
npm run dev
```

Open the local URL printed by Next.js. For production-build verification:

```powershell
npm run build
npm run start
```

Database schema synchronization is currently exposed as `npm run db:push`, which runs Drizzle Kit's schema push against the configured database. It is not a versioned migration workflow. Do not run it against production without reviewing the schema diff and adopting a controlled migration process.

## Architecture

The app uses Next.js App Router pages and one Route Handler at `/api/generate-questions`. That handler calls Gemini to create questions. Most database reads/writes and the answer-evaluation Gemini call currently originate in browser components; this is not a safe production architecture. The dashboard route is protected by Clerk middleware, but the API route is not protected by an explicit Clerk check.

See [system architecture](./PROJECT_DOCUMENTATION/02_SYSTEM_ARCHITECTURE.md), [API reference](./PROJECT_DOCUMENTATION/04_API_DOCUMENTATION.md), and [database documentation](./PROJECT_DOCUMENTATION/05_DATABASE_DOCUMENTATION.md).

## Documentation

- [Technology stack](./PROJECT_DOCUMENTATION/01_TECH_STACK.md)
- [System architecture and flow diagrams](./PROJECT_DOCUMENTATION/02_SYSTEM_ARCHITECTURE.md)
- [Folder and file guide](./PROJECT_DOCUMENTATION/03_PROJECT_STRUCTURE.md)
- [API documentation](./PROJECT_DOCUMENTATION/04_API_DOCUMENTATION.md)
- [Database documentation](./PROJECT_DOCUMENTATION/05_DATABASE_DOCUMENTATION.md)
- [Authentication and security audit](./PROJECT_DOCUMENTATION/06_SECURITY_AUDIT.md)
- [Gemini integration](./PROJECT_DOCUMENTATION/07_GEMINI_AI_INTEGRATION.md)
- [Deployment guide](./PROJECT_DOCUMENTATION/08_DEPLOYMENT_GUIDE.md)
- [Interview preparation and questions](./PROJECT_DOCUMENTATION/09_INTERVIEW_PREPARATION.md)
- [Improvement roadmap](./PROJECT_DOCUMENTATION/10_IMPROVEMENT_ROADMAP.md)
- [Deployment readiness checklist](./PROJECT_DOCUMENTATION/11_DEPLOYMENT_READINESS_CHECKLIST.md)
