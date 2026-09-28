import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — NeutroFuse",
};

const LAST_UPDATED = "June 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="px-6 py-5 border-b border-line">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-lg text-paper hover:text-coat-green transition-colors">
            NeutroFuse
          </Link>
          <span className="font-mono text-xs text-paper-dim">Privacy Policy</span>
        </div>
      </header>

      <main className="px-6 py-16 max-w-3xl mx-auto">
        <p className="font-mono text-xs text-paper-dim mb-4">Last updated: {LAST_UPDATED}</p>
        <h1 className="font-display font-semibold text-3xl text-paper mb-8">Privacy Policy</h1>

        <div className="space-y-10 text-paper-dim leading-relaxed">
          <Section title="The short version">
            <p>
              Photos you upload are processed immediately to produce the fused result, then
              discarded. We do not store your photos, the fused result, or any metadata from
              your files. We have nothing to sell, share, or lose.
            </p>
          </Section>

          <Section title="What happens to your photos">
            <p>
              When you upload two photos, they are sent over an encrypted HTTPS connection to
              the NeutroFuse API. The API passes them directly to the fusion pipeline, which
              produces a fused image and returns it to your browser. Neither the uploaded
              originals nor the fused result are written to disk or retained in memory after
              the request completes.
            </p>
            <p className="mt-4">
              Before upload, your browser downsizes large photos to a maximum of 1600px on
              the long edge. This downsize step runs entirely in your browser — the full-size
              original never leaves your device.
            </p>
          </Section>

          <Section title="What we do not do">
            <ul className="list-disc list-inside space-y-2">
              <li>We do not store uploaded photos or fused results.</li>
              <li>We do not log file contents or EXIF metadata.</li>
              <li>We do not use your photos to train models or improve algorithms.</li>
              <li>We do not share anything with third parties.</li>
              <li>We do not use cookies for tracking or advertising.</li>
            </ul>
          </Section>

          <Section title="Analytics and logging">
            <p>
              The web frontend may collect anonymised request logs for performance monitoring
              (request counts, response times, error rates). These logs do not contain photo
              content, IP addresses, or any personally identifiable information. If you deploy
              your own instance of this open-source project, the logging behaviour of your
              hosting provider applies instead of this policy.
            </p>
          </Section>

          <Section title="Open-source deployment">
            <p>
              NeutroFuse is MIT-licensed open-source software. If you run your own instance
              — on your own infrastructure, using the public code — this privacy policy applies
              only to the hosted version at this site. Your own deployment&apos;s data handling is
              your own responsibility.
            </p>
          </Section>

          <Section title="Children">
            <p>
              This service is not directed at children under 13. We do not knowingly collect
              any information from children.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If this policy changes materially, the &quot;Last updated&quot; date at the top will
              change. Because we retain no user data, there is nothing to migrate or delete
              when the policy changes.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy can be raised as a GitHub issue at{" "}
              <a
                href="https://github.com/YOUR_ORG/neutrofuse-web"
                className="text-coat-green hover:underline font-mono"
              >
                github.com/YOUR_ORG/neutrofuse-web
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-line">
          <Link href="/" className="text-sm text-paper-dim hover:text-paper transition-colors">
            ← Back to NeutroFuse
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display font-medium text-paper text-lg mb-3">{title}</h2>
      {children}
    </div>
  );
}
