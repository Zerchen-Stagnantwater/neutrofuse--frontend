import Link from "next/link";
import { GithubIcon } from "@/components/GithubIcon";

export const metadata = {
  title: "Docs — NeutroFuse",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="px-6 py-5 border-b border-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-lg text-paper hover:text-coat-green transition-colors">
            NeutroFuse
          </Link>
          <a
            href="https://github.com/YOUR_ORG/neutrofuse-web"
            className="flex items-center gap-2 text-sm text-paper-dim hover:text-paper transition-colors"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        </div>
      </header>

      <main className="px-6 py-16 max-w-5xl mx-auto">
        <h1 className="font-display font-semibold text-3xl text-paper mb-3">Documentation</h1>
        <p className="text-paper-dim mb-12 max-w-2xl">
          How to use the tool, how to run your own instance, and how the method works.
        </p>

        <div className="grid md:grid-cols-[220px_1fr] gap-12">
          {/* Sidebar nav */}
          <nav className="text-sm space-y-1 md:sticky md:top-8 md:self-start">
            {[
              ["#using-the-tool", "Using the tool"],
              ["#api", "API"],
              ["#self-hosting", "Self-hosting"],
              ["#how-it-works", "How it works"],
              ["#limitations", "Limitations"],
              ["#contributing", "Contributing"],
              ["#licence", "Licence"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="block px-3 py-1.5 rounded text-paper-dim hover:text-paper hover:bg-ink-raised transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Content */}
          <div className="space-y-16">
            <DocSection id="using-the-tool" title="Using the tool">
              <p>
                Take two photos of the same subject from the same position, one focused on the
                foreground, one on the background. The photos need to be of the same scene —
                if you move the camera between shots, the result won&apos;t align correctly.
              </p>
              <p className="mt-4">
                Upload both on the main page, click <strong className="text-paper">Fuse photos</strong>,
                and download the result. JPEG, PNG, and WebP are supported up to 12MB each.
              </p>
              <p className="mt-4">
                Photos are downsized in your browser to a maximum of 1600px on the long edge
                before anything is sent. This is not lossy in any meaningful way for focus-stacking
                — the algorithm works patch-by-patch and captures the relevant structural
                information well within this resolution — but it keeps the processing time to
                a few seconds rather than minutes.
              </p>
              <Callout>
                <strong className="text-paper">Works best with:</strong> macro photography, product
                photography, any scene where you deliberately shot two focus points. Does not align
                images if they were shot from different positions — that&apos;s a separate problem
                (image registration) not handled here.
              </Callout>
            </DocSection>

            <DocSection id="api" title="API">
              <p>
                The fusion API is a separate open-source service (
                <a href="https://github.com/YOUR_ORG/neutrofuse-api" className="text-coat-green hover:underline font-mono">
                  neutrofuse-api
                </a>
                ) built with FastAPI. This website calls it as a backend. You can call it
                directly from your own code.
              </p>

              <h3 className="font-display font-medium text-paper mt-8 mb-3">POST /fuse</h3>
              <p>Fuse two images. Accepts a <code className="font-mono text-coat-green text-sm">multipart/form-data</code> body with two fields:</p>

              <div className="mt-4 rounded-lg border border-line-bright bg-ink-raised overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-paper-dim font-medium">Field</th>
                      <th className="px-4 py-3 text-left text-paper-dim font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-paper-dim font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-line">
                      <td className="px-4 py-3 text-coat-green">image_a</td>
                      <td className="px-4 py-3 text-paper-dim">File</td>
                      <td className="px-4 py-3 text-paper-dim">First source image</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-coat-green">image_b</td>
                      <td className="px-4 py-3 text-paper-dim">File</td>
                      <td className="px-4 py-3 text-paper-dim">Second source image</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-5">Returns the fused image as <code className="font-mono text-coat-green text-sm">image/jpeg</code>. On error, returns JSON:</p>
              <CodeBlock>{`{ "error": "Human-readable message" }`}</CodeBlock>

              <h3 className="font-display font-medium text-paper mt-8 mb-3">Example</h3>
              <CodeBlock>{`curl -X POST https://your-api-host/fuse \\
  -F "image_a=@photo_a.jpg" \\
  -F "image_b=@photo_b.jpg" \\
  --output fused.jpg`}</CodeBlock>
            </DocSection>

            <DocSection id="self-hosting" title="Self-hosting">
              <p>
                Both halves of NeutroFuse are MIT-licensed and designed to be self-hosted.
                The backend API and the fusion algorithm are in{" "}
                <a href="https://github.com/YOUR_ORG/neutrofuse-api" className="text-coat-green hover:underline font-mono">
                  neutrofuse-api
                </a>
                ; this frontend is in{" "}
                <a href="https://github.com/YOUR_ORG/neutrofuse-web" className="text-coat-green hover:underline font-mono">
                  neutrofuse-web
                </a>
                .
              </p>

              <h3 className="font-display font-medium text-paper mt-8 mb-3">Backend (neutrofuse-api)</h3>
              <CodeBlock>{`git clone https://github.com/YOUR_ORG/neutrofuse-api
cd neutrofuse-api
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000`}</CodeBlock>

              <h3 className="font-display font-medium text-paper mt-6 mb-3">Frontend (this repo)</h3>
              <CodeBlock>{`git clone https://github.com/YOUR_ORG/neutrofuse-web
cd neutrofuse-web
npm install

# Create a .env.local file:
echo "NEUTROFUSE_API_URL=http://localhost:8000" > .env.local

npm run dev`}</CodeBlock>

              <p className="mt-4">For production deployment on Vercel:</p>
              <ol className="list-decimal list-inside space-y-2 mt-3 text-sm">
                <li>Fork or clone this repo to your GitHub account.</li>
                <li>Import the repo in the Vercel dashboard.</li>
                <li>
                  Set the environment variable{" "}
                  <code className="font-mono text-coat-green">NEUTROFUSE_API_URL</code> to the URL
                  of your deployed API service.
                </li>
                <li>Deploy.</li>
              </ol>

              <Callout>
                The API must be a separate, persistent service — it runs Python/OpenCV, which
                does not fit Vercel&apos;s serverless runtime. Options include Render, Railway,
                Fly.io, or any VPS. The frontend calls it via the{" "}
                <code className="font-mono text-coat-green text-xs">/api/fuse</code> route handler,
                which proxies the request and enforces size limits and timeouts.
              </Callout>
            </DocSection>

            <DocSection id="how-it-works" title="How it works">
              <p>
                The full methodology, evaluation, and results are in the{" "}
                <a href="https://github.com/YOUR_ORG/neutrofuse-api/blob/main/NeutroFuse_Report.docx"
                   className="text-coat-green hover:underline">
                  research report
                </a>
                . A summary:
              </p>

              <div className="mt-6 space-y-5">
                {[
                  ["Neutrosophic confidence", "Each 8×8-pixel patch in each source image gets a Truth (T), Indeterminacy (I), and Falsity (F) score derived from local Laplacian-variance sharpness. T is how confident we are this patch is in-focus; I is how undecidable the choice between A and B is. A log-compression step prevents the heavy-tailed sharpness distribution of real photographs from collapsing every patch's confidence near zero."],
                  ["Hypergraph construction", "Patches with similar texture (LBP + gradient-orientation feature vectors) are connected into hyperedges within a local spatial radius. This is the 'neighborhood' the ambiguous patches vote against."],
                  ["Decision rule", "Low-I patches: direct comparison of T_A vs T_B. High-I patches: aggregated vote across the hyperedge, weighted by hyperedge confidence. This defers genuinely ambiguous decisions to structural context rather than guessing."],
                  ["Smooth composition", "The per-patch blend weights are upsampled to pixel resolution using bilinear interpolation between patch centers (not nearest-neighbor), eliminating the blocky artifact that would otherwise be visible at curved edges crossing a sharp/blurred boundary."],
                ].map(([title, body]) => (
                  <div key={title} className="pl-4 border-l-2 border-line-bright">
                    <p className="font-display font-medium text-paper text-sm mb-1">{title}</p>
                    <p className="text-sm text-paper-dim">{body}</p>
                  </div>
                ))}
              </div>
            </DocSection>

            <DocSection id="limitations" title="Limitations">
              <ul className="space-y-4 text-sm">
                {[
                  ["No image alignment", "Both photos must be taken from the same position with the camera on a tripod or stable surface. NeutroFuse does not perform image registration. If the photos are misaligned, the fused result will show ghosting."],
                  ["Best under 1600px", "The algorithm was evaluated on 520×520 Lytro pairs. Images are downsized client-side to 1600px before processing. Very large images take longer and the patch-level parameters may not be optimally tuned for them."],
                  ["Sharpness assumption", "The method assumes at least one of the two sources is sharper than the other at each patch. Scenes where both sources are equally soft everywhere (e.g. both underexposed or both heavily compressed) won't benefit."],
                  ["Spatial Frequency tradeoff", "Statistical evaluation on 20 real pairs found that the hyperedge-aggregation mechanism improves edge-preservation quality (Qabf) and information retention (MI) but reduces raw sharpness (Spatial Frequency) by a small, statistically significant amount on most pairs. The mechanism trades pixel-level sharpness at a few patches for better structural coherence — see the report for the mechanism."],
                ].map(([title, body]) => (
                  <div key={title}>
                    <p className="font-display font-medium text-paper mb-1">{title}</p>
                    <p className="text-paper-dim">{body}</p>
                  </div>
                ))}
              </ul>
            </DocSection>

            <DocSection id="contributing" title="Contributing">
              <p>
                Contributions are welcome. The best place to start is the GitHub issues list —
                look for issues tagged{" "}
                <code className="font-mono text-coat-green text-xs">good first issue</code> or
                open a new one describing what you want to change before writing code.
              </p>
              <p className="mt-4">
                The test suite (195 tests, 187 offline) covers most of the core method. Any
                change to the fusion pipeline should include updated tests and, where relevant,
                updated ablation results. The full research report documents the current baseline
                — changes that shift the headline numbers in either direction should explain why.
              </p>
              <p className="mt-4">
                <a href="https://github.com/YOUR_ORG/neutrofuse-api" className="text-coat-green hover:underline">
                  neutrofuse-api
                </a>{" "}
                (the fusion algorithm) and{" "}
                <a href="https://github.com/YOUR_ORG/neutrofuse-web" className="text-coat-green hover:underline">
                  neutrofuse-web
                </a>{" "}
                (this site) are separate repos. Frontend issues go in neutrofuse-web; algorithm
                and API issues go in neutrofuse-api.
              </p>
            </DocSection>

            <DocSection id="licence" title="Licence">
              <p>
                NeutroFuse is released under the{" "}
                <strong className="text-paper">MIT License</strong>. You are free to use, copy,
                modify, merge, publish, distribute, sublicense, and/or sell copies of the
                software, provided the original copyright notice and this permission notice
                appear in all copies.
              </p>
              <CodeBlock>{`MIT License

Copyright (c) 2026 NeutroFuse Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</CodeBlock>
            </DocSection>
          </div>
        </div>
      </main>
    </div>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="font-display font-semibold text-xl text-paper mb-5 pb-3 border-b border-line">
        {title}
      </h2>
      <div className="text-paper-dim leading-relaxed">{children}</div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-4 p-4 rounded-lg bg-ink-raised border border-line-bright overflow-x-auto text-xs font-mono text-paper-dim leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 p-4 rounded-lg border border-coat-green/30 bg-coat-green/5 text-sm text-paper-dim">
      {children}
    </div>
  );
}
