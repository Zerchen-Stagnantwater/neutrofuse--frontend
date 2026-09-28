"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

type FocusCompareProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
};

/**
 * A drag-to-reveal comparison slider. Built specifically for this
 * subject: the left side shows a single defocused source (the
 * problem -- only part of the frame is sharp), the right side shows
 * the fused result (every part sharp at once). Dragging the divider
 * is the "aha" moment a static screenshot can't deliver.
 */
export function FocusCompare({
  beforeSrc,
  afterSrc,
  beforeLabel = "One focus point",
  afterLabel = "Fused — everything sharp",
}: FocusCompareProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-line-bright select-none touch-none cursor-ew-resize"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* After image, full width underneath */}
        <Image
          src={afterSrc}
          alt={afterLabel}
          fill
          className="object-cover pointer-events-none"
          priority
          sizes="(max-width: 768px) 100vw, 640px"
        />

        {/* Before image, clipped to the slider position */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeSrc}
            alt={beforeLabel}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>

        {/* Divider handle */}
        <div
          className="absolute top-0 bottom-0 w-px bg-paper/80"
          style={{ left: `${position}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="Comparison slider: before and after focus fusion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-paper border-2 border-ink shadow-lg flex items-center justify-center cursor-ew-resize focus-visible:outline focus-visible:outline-2 focus-visible:outline-coat-green focus-visible:outline-offset-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M4 3L1 7L4 11" stroke="#0D0F0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 3L13 7L10 11" stroke="#0D0F0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-ink/70 text-paper text-xs font-mono tracking-wide pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-coat-green/90 text-ink text-xs font-mono tracking-wide pointer-events-none">
          {afterLabel}
        </div>
      </div>
      <p className="mt-3 text-sm text-paper-dim text-center font-body">
        Drag the divider — both halves come from the same two source photos. Real output, not a mockup.
      </p>
    </div>
  );
}
