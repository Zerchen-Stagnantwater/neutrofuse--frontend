import { NextRequest, NextResponse } from "next/server";

// Matches the runtime cost verified against the real pipeline: ~4s at
// 800px on the long edge, ~2 minutes at full phone-camera resolution.
// Client-side downsizing (see FusionUploader.tsx) keeps real requests
// well under this, but it's set explicitly rather than left to the
// hosting platform's default, since defaults vary across plans and an
// open-source deployer may not know to check.
export const maxDuration = 30;

const MAX_FILE_BYTES = 12 * 1024 * 1024; // 12MB per image, matches the client-side cap
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BACKEND_URL = process.env.NEUTROFUSE_API_URL;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    // Misconfiguration, not a user error -- don't expose this distinction
    // to the client beyond a generic message (see data-security guidance:
    // avoid leaking internal details in error responses).
    console.error("NEUTROFUSE_API_URL is not set");
    return NextResponse.json(
      { error: "The fusion service isn't configured. Try again later." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest("Could not read the upload. Try again.");
  }

  const imageA = formData.get("image_a");
  const imageB = formData.get("image_b");

  if (!(imageA instanceof File) || !(imageB instanceof File)) {
    return badRequest("Both photos are required.");
  }

  for (const [label, file] of [["Photo A", imageA], ["Photo B", imageB]] as const) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return badRequest(`${label} must be a JPEG, PNG, or WebP image.`);
    }
    if (file.size > MAX_FILE_BYTES) {
      return badRequest(`${label} is too large. Keep it under 12MB.`);
    }
    if (file.size === 0) {
      return badRequest(`${label} appears to be empty.`);
    }
  }

  const upstreamForm = new FormData();
  upstreamForm.append("image_a", imageA, "image_a.jpg");
  upstreamForm.append("image_b", imageB, "image_b.jpg");

  let upstreamResponse: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28_000); // leave headroom under maxDuration

    upstreamResponse = await fetch(`${BACKEND_URL}/fuse`, {
      method: "POST",
      body: upstreamForm,
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "That took too long. Try smaller photos." },
        { status: 504 }
      );
    }
    console.error("Upstream fusion request failed:", err);
    return NextResponse.json(
      { error: "Couldn't reach the fusion service. Try again in a moment." },
      { status: 502 }
    );
  }

  if (!upstreamResponse.ok) {
    // Don't forward the upstream's raw error body to the client --
    // it may contain stack traces or internal details. Log it
    // server-side and return a clean, generic message instead.
    const text = await upstreamResponse.text().catch(() => "");
    console.error("Upstream fusion service returned an error:", upstreamResponse.status, text);
    return NextResponse.json(
      { error: "Couldn't fuse those photos. Try a different pair." },
      { status: 502 }
    );
  }

  const resultBlob = await upstreamResponse.blob();
  return new NextResponse(resultBlob, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      // Never cache a response derived from someone's uploaded photo.
      "Cache-Control": "no-store",
    },
  });
}
