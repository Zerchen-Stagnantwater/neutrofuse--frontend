# neutrofuse-web

The web frontend for [NeutroFuse](https://github.com/YOUR_ORG/neutrofuse-api) — a free, open-source multi-focus image fusion tool. Upload two photos taken at different focus depths, get one sharp image back.

**Live site:** https://neutrofuse.vercel.app  
**Algorithm + API:** [neutrofuse-api](https://github.com/YOUR_ORG/neutrofuse-api)  
**Research report:** [NeutroFuse_Report.docx](https://github.com/YOUR_ORG/neutrofuse-api/blob/main/NeutroFuse_Report.docx)

---

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

The actual image fusion runs in a separate Python service ([neutrofuse-api](https://github.com/YOUR_ORG/neutrofuse-api)). This repo is the frontend only — it resizes uploaded images client-side, proxies them to the API via a route handler, and returns the result.

---

## Local development

```bash
git clone https://github.com/YOUR_ORG/neutrofuse-web
cd neutrofuse-web
npm install
```

Create `.env.local`:

```
NEUTROFUSE_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

You'll need the [neutrofuse-api](https://github.com/YOUR_ORG/neutrofuse-api) running locally for the fusion to actually work. Without it, the UI will render but requests to `/api/fuse` will return a 500.

---

## Deploying to Vercel

1. Fork this repo.
2. Import it in the [Vercel dashboard](https://vercel.com/new).
3. Set the environment variable `NEUTROFUSE_API_URL` to the URL of your deployed neutrofuse-api instance.
4. Deploy.

The API must be a persistent service — it runs Python/OpenCV and doesn't fit Vercel's serverless runtime. Deploy it separately on Render, Railway, Fly.io, or a VPS. See [neutrofuse-api](https://github.com/YOUR_ORG/neutrofuse-api) for API deployment instructions.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              Main landing page
│   ├── layout.tsx             Root layout, fonts, metadata
│   ├── globals.css             Design tokens (palette, typography)
│   ├── api/fuse/route.ts        Proxy route to the Python API
│   ├── docs/page.tsx             /docs — developer documentation
│   ├── privacy/page.tsx          /privacy — privacy policy
│   └── terms/page.tsx            /terms — terms of service
└── components/
    ├── FocusCompare.tsx      Interactive before/after comparison slider
    ├── FusionUploader.tsx     Upload widget, client-side downsize, result display
    └── GithubIcon.tsx          GitHub logo SVG (lucide-react doesn't ship one)
```

---

## Environment variables

| Variable | Description | Required |
|---|---|---|
| `NEUTROFUSE_API_URL` | Base URL of the neutrofuse-api service, no trailing slash | Yes |

---

## Replacing placeholder GitHub URLs

This repo ships with `YOUR_ORG` placeholder URLs. Once pushed to GitHub, find-and-replace:

```
YOUR_ORG/neutrofuse-web  →  your-username/neutrofuse-web
YOUR_ORG/neutrofuse-api  →  your-username/neutrofuse-api
```

Files to update: `src/app/page.tsx`, `src/app/docs/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, this README.

---

## Contributing

Issues and PRs are welcome. Frontend issues go here. Algorithm, API, or research issues go in [neutrofuse-api](https://github.com/YOUR_ORG/neutrofuse-api).

---

## License

[MIT](./LICENSE) — free to use, fork, and modify.
