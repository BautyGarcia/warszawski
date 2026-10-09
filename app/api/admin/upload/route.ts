import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { publicUrl, putObject } from "@/lib/s3";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
// Same prefix the Supabase bucket was copied under, so old and new uploads share one public path.
const PREFIX = "product-images";

export async function POST(req: NextRequest) {
  await requireAdmin();

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "tipo no permitido" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "imagen demasiado grande (max 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${PREFIX}/${crypto.randomUUID()}.${ext}`;

  try {
    await putObject(key, Buffer.from(await file.arrayBuffer()), file.type, {
      CacheControl: "public, max-age=31536000, immutable",
    });
    return NextResponse.json({ url: publicUrl(key) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
