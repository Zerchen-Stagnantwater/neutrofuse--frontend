import Link from "next/link";
import { BookOpen, FileCode2 } from "lucide-react";
import { FocusCompare } from "@/components/FocusCompare";
import { FusionUploader } from "@/components/FusionUploader";
import { GithubIcon } from "@/components/GithubIcon";

const GITHUB_URL = "https://github.com/YOUR_ORG/neutrofuse-web";
const API_GITHUB_URL = "https://github.com/YOUR_ORG/neutrofuse-api";
const REPORT_URL = "https://github.com/YOUR_ORG/neutrofuse-api/blob/main/NeutroFuse_Report.docx";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 items-center">
            <div>
              <p className="font-mono text-xs tracking-widest text-coat-green uppercase mb-4">
                Open-source · f/stack
              </p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl leading-[1.08] text-paper">
                One photo can&apos;t hold two focus points.
                <br />
                <span className="text-coat-green">Two photos can.</span>
              </h1>
              <p className="mt-5 text-lg text-paper-dim max-w-md">
                Shoot a macro subject sharp, shoot the background sharp, and let NeutroFuse combine
                them into one image that&apos;s sharp throughout — the way focus stacking is supposed
                to work, free and in your browser.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#try-it"
                  className="px-5 py-3 rounded-md bg-coat-green text-ink font-display font-semibold hover:bg-coat-green-bright transition-colors"
                >
                  Try it with your photos
                </a>
                <a
                  href={GITHUB_URL}
                  className="px-5 py-3 rounded-md border border-line-bright text-paper font-medium hover:border-coat-green hover:text-coat-green transition-colors flex items-center gap-2"
                >
                  <GithubIcon size={18} />
                  View source
                </a>
              </div>
            </div>

            <FocusCompare beforeSrc="/demo/hero-before.jpg" afterSrc="/demo/hero-after.jpg" />
          </div>
        </section>

        {/* THE TOOL */}
        <section id="try-it" className="px-6 py-20 border-t border-line bg-ink-raised">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-10">
              <h2 className="font-display font-semibold text-2xl md:text-3xl text-paper">
                Fuse your own photos
              </h2>
              <p className="mt-3 text-paper-dim">
                Two shots of the same scene, same framing, different focus points. JPEG, PNG, or
                WebP. We resize large photos in your browser before anything uploads, so this stays
                quick.
              </p>
            </div>
            <FusionUploader />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-20 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-paper mb-3">
              What&apos;s actually happening
            </h2>
            <p className="text-paper-dim max-w-2xl mb-12">
              Most fusion tools either average the two photos (which blurs everything a little) or
              make a hard sharp/blurred decision per pixel (which can look stitched at the seam).
              NeutroFuse does neither.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <HowStep
                title="Measure confidence, not just sharpness"
                body="Every small patch of each photo gets a confidence score — and, separately, a score for how undecidable that patch is. Genuinely ambiguous regions get flagged rather than guessed at."
              />
              <HowStep
                title="Ask the neighborhood"
                body="For ambiguous patches, the decision isn't made in isolation. It's resolved by consensus with perceptually similar nearby patches — a hypergraph vote, not a coin flip."
              />
              <HowStep
                title="Blend, don't cut"
                body="The final image is composed with smooth, center-preserving interpolation between patches, so the seam between 'this came from photo A' and 'this came from photo B' is never visible."
              />
            </div>

            <div className="mt-12 p-5 rounded-lg border border-line-bright bg-ink-raised max-w-3xl">
              <p className="text-sm text-paper-dim">
                We tested this honestly, including the parts that didn&apos;t go perfectly. Against
                Guided Filter Fusion — a real, established method, not a strawman — NeutroFuse wins
                clearly on information retention, wins narrowly on edge preservation, and shows no
                advantage on raw sharpness. The full numbers, including a real bug we found and
                fixed along the way, are in the{" "}
                <a href={REPORT_URL} className="text-coat-green hover:underline">
                  research report
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FOR DEVELOPERS */}
        <section className="px-6 py-20 border-t border-line bg-ink-raised">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-paper mb-3">
              Built to be read, forked, and improved
            </h2>
            <p className="text-paper-dim max-w-2xl mb-10">
              Both halves of this project are MIT-licensed. The method, the evaluation, and the
              known limitations are documented in the open — including a normalization bug and an
              upstream OpenCV defect we found and fixed, not just the parts that went well.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <DevCard
                icon={<GithubIcon size={20} />}
                title="Frontend"
                body="This site. Next.js, TypeScript, deploys to Vercel."
                href={GITHUB_URL}
                linkLabel="neutrofuse-web"
              />
              <DevCard
                icon={<FileCode2 size={20} aria-hidden="true" />}
                title="Fusion pipeline + API"
                body="The actual method — neutrosophic components, hypergraph construction, the FastAPI service this site calls."
                href={API_GITHUB_URL}
                linkLabel="neutrofuse-api"
              />
              <DevCard
                icon={<BookOpen size={20} aria-hidden="true" />}
                title="Research report"
                body="Full methodology, statistical comparisons against two baselines, and an honest account of what didn't work."
                href={REPORT_URL}
                linkLabel="Read the report"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="px-6 py-5 border-b border-line">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-display font-semibold text-lg text-paper">
          NeutroFuse
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#try-it" className="text-paper-dim hover:text-paper transition-colors">
            Try it
          </a>
          <Link href="/docs" className="text-paper-dim hover:text-paper transition-colors">
            Docs
          </Link>
          <a
            href={GITHUB_URL}
            className="text-paper-dim hover:text-paper transition-colors flex items-center gap-1.5"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="px-6 py-10 border-t border-line">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-paper-dim">
        <div>
          <p>MIT-licensed. Built on real, evaluated research — not a black box.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="hover:text-paper transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-paper transition-colors">
            Terms
          </Link>
          <a href={GITHUB_URL} className="hover:text-paper transition-colors">
            GitHub
          </a>
          <a href={API_GITHUB_URL} className="hover:text-paper transition-colors">
            API source
          </a>
        </div>
      </div>
    </footer>
  );
}

function HowStep({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display font-medium text-paper mb-2">{title}</h3>
      <p className="text-sm text-paper-dim leading-relaxed">{body}</p>
    </div>
  );
}

function DevCard({
  icon,
  title,
  body,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="p-5 rounded-lg border border-line-bright bg-ink">
      <div className="text-coat-green mb-3">{icon}</div>
      <h3 className="font-display font-medium text-paper mb-2">{title}</h3>
      <p className="text-sm text-paper-dim leading-relaxed mb-4">{body}</p>
      <a href={href} className="text-sm text-coat-green hover:underline font-mono">
        {linkLabel} →
      </a>
    </div>
  );
}
