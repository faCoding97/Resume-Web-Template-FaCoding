"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";

type Props = {
  linkedin: string;
  email: string;
  domain: string;
};

export default function PersonalInfo({ linkedin, email, domain }: Props) {
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState<null | "email" | "linkedin">(null);

  // strip protocol for display and sane links
  const normalizeHttps = (url: string) =>
    `https://${url.replace(/^https?:\/\//, "")}`;

  const downloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "portfolio-qr.png";
    link.click();
  };

  const copyToClipboard = async (text: string, which: "email" | "linkedin") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      // no-op
    }
  };

  const composeEmail = () => {
    const subject = encodeURIComponent("Hello Faraz — via Portfolio");
    const body = encodeURIComponent(
      "Hi Faraz,\n\nI saw your portfolio and would like to connect.\n\n— "
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* LinkedIn Card */}
      <div className="group relative card bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/60 overflow-hidden">
        {/* gradient top border on hover */}
        <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 group-hover:w-full transition-all duration-700" />
        <div className="flex items-start gap-3">
          {/* LinkedIn icon (inline SVG) */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden
            className="mt-0.5 opacity-80">
            <path
              fill="#60a5fa"
              d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.88-2.36-3.88-2.36 0-2.73 1.84-2.73 3.75V24H8z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-400">LinkedIn</div>
            <a
              href={normalizeHttps(linkedin)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block font-semibold break-all text-blue-300 hover:text-blue-200"
              title="Open LinkedIn profile">
              {linkedin.replace(/^https?:\/\//, "")}
            </a>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() =>
                  window.open(
                    normalizeHttps(linkedin),
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="rounded-md bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-300 hover:bg-blue-500/30"
                title="Open profile in new tab">
                Open
              </button>
              <button
                onClick={() =>
                  copyToClipboard(normalizeHttps(linkedin), "linkedin")
                }
                className="rounded-md bg-gray-600/40 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-gray-600/60"
                title="Copy profile URL">
                Copy URL
              </button>
            </div>
          </div>
        </div>

        {/* tiny toast */}
        {copied === "linkedin" && (
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/80 px-3 py-1 text-xs text-gray-100 border border-gray-700/60 animate-fade-in-up"
            aria-live="polite">
            Copied LinkedIn URL
          </div>
        )}
      </div>

      {/* Email Card */}
      <div className="group relative card bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/60 overflow-hidden">
        <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 group-hover:w-full transition-all duration-700" />
        <div className="flex items-start gap-3">
          {/* Mail icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden
            className="mt-0.5 opacity-80">
            <path
              fill="#34d399"
              d="M2 4h20a1 1 0 0 1 1 1v1.2l-11 6.6L1 6.2V5a1 1 0 0 1 1-1zm21 4.3V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8.3l10.4 6.2a2 2 0 0 0 2 0L23 8.3z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-400">Email</div>
            <a
              href={`mailto:${email}`}
              className="mt-1 block font-semibold break-all text-emerald-300 hover:text-emerald-200"
              title="Compose email">
              {email}
            </a>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={composeEmail}
                className="rounded-md bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30"
                title="Compose new email">
                Compose
              </button>
              <button
                onClick={() => copyToClipboard(email, "email")}
                className="rounded-md bg-gray-600/40 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-gray-600/60"
                title="Copy email address">
                Copy
              </button>
            </div>
          </div>
        </div>

        {copied === "email" && (
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/80 px-3 py-1 text-xs text-gray-100 border border-gray-700/60 animate-fade-in-up"
            aria-live="polite">
            Copied email
          </div>
        )}
      </div>

      {/* GitHub Card */}
      <div className="group relative card bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/60 overflow-hidden">
        <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 group-hover:w-full transition-all duration-700" />
        <div className="flex items-start gap-3">
          {/* GitHub icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden
            className="mt-0.5 opacity-80">
            <path
              fill="#cbd5e1"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.337-3.369-1.337-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022.8-.223 1.65-.334 2.5-.338.85.004 1.7.115 2.5.338 1.91-1.291 2.75-1.022 2.75-1.022.544 1.377.201 2.394.098 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-400">GitHub</div>
            <a
              href="https://github.com/faCoding97"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-semibold break-all text-purple-300 hover:text-purple-200"
              title="Visit GitHub profile">
              github.com/faCoding97
            </a>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() =>
                  window.open("https://github.com/faCoding97", "_blank")
                }
                className="rounded-md bg-purple-500/20 px-3 py-1.5 text-sm font-medium text-purple-300 hover:bg-purple-500/30"
                title="View GitHub profile">
                View Profile
              </button>
              <button
                onClick={() =>
                  copyToClipboard("https://github.com/faCoding97", "GitHub URL")
                }
                className="rounded-md bg-gray-600/40 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-gray-600/60"
                title="Copy GitHub URL">
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Card (unchanged, with download) */}
      <div className="group relative card bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/60 overflow-hidden">
        <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-800 group-hover:w-full transition-all duration-700" />
        <div className="flex items-start gap-3">
          {" "}
          <div>
            <div className="text-sm text-gray-400">QR for</div>
            <div className="mt-1 font-semibold break-all">{domain}</div>
            <button
              onClick={downloadQR}
              className="mt-3 inline-flex items-center rounded-lg bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-300 hover:bg-blue-500/30">
              Download QR
            </button>
          </div>
          <QRCodeCanvas
            value={`https://${domain}`}
            size={108}
            bgColor="#1f2937"
            fgColor="#d1d5db"
            includeMargin={false}
            level="M"
            imageSettings={undefined}
            ref={qrRef}
          />
        </div>
      </div>
    </div>
  );
}
