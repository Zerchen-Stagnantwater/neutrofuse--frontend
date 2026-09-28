import Link from "next/link";

export const metadata = {
  title: "Terms of Service — NeutroFuse",
};

const LAST_UPDATED = "June 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="px-6 py-5 border-b border-line">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-lg text-paper hover:text-coat-green transition-colors">
            NeutroFuse
          </Link>
          <span className="font-mono text-xs text-paper-dim">Terms of Service</span>
        </div>
      </header>

      <main className="px-6 py-16 max-w-3xl mx-auto">
        <p className="font-mono text-xs text-paper-dim mb-4">Last updated: {LAST_UPDATED}</p>
        <h1 className="font-display font-semibold text-3xl text-paper mb-8">Terms of Service</h1>

        <div className="space-y-10 text-paper-dim leading-relaxed">
          <Section title="What NeutroFuse is">
            <p>
              NeutroFuse is a free, open-source multi-focus image fusion tool. It is provided
              as-is, without charge, as a demonstration of a research method. By using this
              site you agree to these terms.
            </p>
          </Section>

          <Section title="Your photos">
            <p>
              You retain full ownership of any photos you upload. By uploading them, you grant
              NeutroFuse the right to process them to produce a fused result and return that
              result to you. That is the full extent of the licence. No other use is made of
              your photos — see the Privacy Policy for details on how they are handled.
            </p>
            <p className="mt-4">
              You are responsible for having the right to upload any photo you submit. Do not
              upload photos you do not own or have explicit permission to process.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>You may not use NeutroFuse to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Upload content that is illegal in your jurisdiction.</li>
              <li>Attempt to reverse-engineer, overload, or disrupt the service.</li>
              <li>
                Upload photos of identifiable people without their consent, particularly in
                contexts where the fusion output would be used to mislead.
              </li>
              <li>Automate bulk requests without prior agreement.</li>
            </ul>
          </Section>

          <Section title="No warranty">
            <p>
              NeutroFuse is provided &quot;as is&quot;, without warranty of any kind, express or
              implied. The fusion result is produced by an algorithm evaluated against specific
              benchmarks (see the{" "}
              <a href="https://github.com/YOUR_ORG/neutrofuse-api/blob/main/NeutroFuse_Report.docx" className="text-coat-green hover:underline">
                research report
              </a>
              ) but is not guaranteed to produce a perfect result for any given pair of photos.
            </p>
            <p className="mt-4">
              In no event shall NeutroFuse or its contributors be liable for any claim, damages,
              or other liability arising from your use of the service or its outputs.
            </p>
          </Section>

          <Section title="Service availability">
            <p>
              This is a free service operated without a service-level agreement. It may be
              unavailable, rate-limited, or discontinued at any time without notice. If
              reliability matters to you, self-host using the{" "}
              <a href="https://github.com/YOUR_ORG/neutrofuse-api" className="text-coat-green hover:underline">
                open-source code
              </a>
              .
            </p>
          </Section>

          <Section title="Open-source licence">
            <p>
              The source code for both this site and the underlying fusion pipeline is released
              under the MIT License. You are free to fork, modify, and redistribute it under
              the terms of that licence. The MIT License text is available in the GitHub
              repository.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              These terms may be updated at any time. The &quot;Last updated&quot; date above will
              reflect the most recent revision. Continued use of the service after a change
              constitutes acceptance of the updated terms.
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
