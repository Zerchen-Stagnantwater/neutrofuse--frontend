"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

const MAX_FILE_BYTES = 12 * 1024 * 1024; // 12MB per image
const MAX_LONG_EDGE = 1600; // client-side downsize cap before upload
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type SlotState = {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
};

const emptySlot: SlotState = { file: null, previewUrl: null, error: null };

type UploadStatus = "idle" | "processing" | "done" | "error";

/**
 * Downsizes an image client-side before upload. This matters: the
 * pipeline was verified to take ~2 minutes at full phone-camera
 * resolution (4000x3000) versus ~4 seconds at 800px on the long edge.
 * Capping client-side, before the bytes ever leave the browser, keeps
 * uploads fast and keeps the serverless function comfortably inside
 * its timeout regardless of what the visitor's camera produces.
 */
async function downsizeImage(file: File, maxLongEdge: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const longEdge = Math.max(bitmap.width, bitmap.height);
  const scale = longEdge > maxLongEdge ? maxLongEdge / longEdge : 1;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      "image/jpeg",
      0.92
    );
  });
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Use a JPEG, PNG, or WebP photo.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "That photo is over 12MB. Try a smaller one.";
  }
  return null;
}

function DropSlot({
  label,
  hint,
  slot,
  onFile,
  onClear,
}: {
  label: string;
  hint: string;
  slot: SlotState;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="flex-1">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label={`Upload ${label}`}
        className={`relative aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden
          ${isDragOver ? "border-coat-green bg-coat-green/10" : "border-line-bright hover:border-coat-green/60"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />

        {slot.previewUrl ? (
          <>
            <Image
              src={slot.previewUrl}
              alt={`Preview of ${label}`}
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              aria-label={`Remove ${label}`}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/80 text-paper flex items-center justify-center hover:bg-ink"
            >
              ×
            </button>
          </>
        ) : (
          <div className="text-center px-4">
            <p className="font-display font-medium text-paper">{label}</p>
            <p className="text-sm text-paper-dim mt-1">{hint}</p>
            <p className="text-xs text-paper-dim/70 mt-3 font-mono">JPEG, PNG, or WebP — up to 12MB</p>
          </div>
        )}
      </div>
      {slot.error && <p className="mt-2 text-sm text-aperture-gold">{slot.error}</p>}
    </div>
  );
}

export function FusionUploader() {
  const [slotA, setSlotA] = useState<SlotState>(emptySlot);
  const [slotB, setSlotB] = useState<SlotState>(emptySlot);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = (which: "a" | "b") => (file: File) => {
    const error = validateFile(file);
    const previewUrl = error ? null : URL.createObjectURL(file);
    const next: SlotState = { file: error ? null : file, previewUrl, error };
    if (which === "a") setSlotA(next);
    else setSlotB(next);
    setStatus("idle");
    setResultUrl(null);
  };

  const handleClear = (which: "a" | "b") => () => {
    if (which === "a") setSlotA(emptySlot);
    else setSlotB(emptySlot);
    setStatus("idle");
    setResultUrl(null);
  };

  const canSubmit = slotA.file && slotB.file && status !== "processing";

  const handleSubmit = useCallback(async () => {
    if (!slotA.file || !slotB.file) return;
    setStatus("processing");
    setErrorMessage(null);

    try {
      const [resizedA, resizedB] = await Promise.all([
        downsizeImage(slotA.file, MAX_LONG_EDGE),
        downsizeImage(slotB.file, MAX_LONG_EDGE),
      ]);

      const formData = new FormData();
      formData.append("image_a", resizedA, "image_a.jpg");
      formData.append("image_b", resizedB, "image_b.jpg");

      const response = await fetch("/api/fuse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong on our end. Try again.");
      }

      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("error");
    }
  }, [slotA.file, slotB.file]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <DropSlot
          label="Photo A"
          hint="Focused on the subject"
          slot={slotA}
          onFile={handleFile("a")}
          onClear={handleClear("a")}
        />
        <DropSlot
          label="Photo B"
          hint="Focused on the background"
          slot={slotB}
          onFile={handleFile("b")}
          onClear={handleClear("b")}
        />
      </div>

      <div className="mt-6 flex flex-col items-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-6 py-3 rounded-md bg-coat-green text-ink font-display font-semibold text-base hover:bg-coat-green-bright disabled:bg-line disabled:text-paper-dim disabled:cursor-not-allowed transition-colors"
        >
          {status === "processing" ? "Fusing your photos…" : "Fuse photos"}
        </button>

        {status === "processing" && (
          <p className="mt-3 text-sm text-paper-dim">
            Usually takes a few seconds. Your photos are processed and discarded — never stored.
          </p>
        )}

        {status === "error" && errorMessage && (
          <p className="mt-3 text-sm text-aperture-gold max-w-md text-center">{errorMessage}</p>
        )}
      </div>

      {resultUrl && (
        <div className="mt-8">
          <p className="font-display font-medium text-paper mb-3 text-center">Your fused photo</p>
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-line-bright">
            <Image src={resultUrl} alt="Fused result" fill className="object-cover" unoptimized />
          </div>
          <div className="flex justify-center mt-4">
            <a
              href={resultUrl}
              download="neutrofuse-result.jpg"
              className="px-5 py-2.5 rounded-md border border-line-bright text-paper font-medium hover:border-coat-green hover:text-coat-green transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
