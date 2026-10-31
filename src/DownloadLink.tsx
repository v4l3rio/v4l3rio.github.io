import { useRef, useState } from "react";
import { getContent, loadContent, type Language, type ResumeData } from "./content";
import { Icon } from "@/components/ui/icon";

export function DownloadLink({ language, label, preparingLabel, onError, onContent, ...props }: {
  language: Language; label: string; preparingLabel: string;
  onError: () => void; onContent: (data: ResumeData) => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onError" | "children">) {
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  return <a {...props} href={`/cv/${getContent(language).pdf.filename}`} download
    aria-busy={busy} aria-disabled={busy || undefined}
    onClick={async event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = true;
      setBusy(true);
      try {
        const [data, renderer] = await Promise.all([loadContent(language), import("./ResumePdf")]);
        onContent(data);
        const blob = await renderer.createPdfBlob(data);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = data.pdf.filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch {
        onError();
      } finally {
        pending.current = false;
        setBusy(false);
      }
    }}>
    {busy ? preparingLabel : label}<Icon name="download" aria-hidden="true" feedback={false} />
  </a>;
}
