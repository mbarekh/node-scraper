import { readFile } from "node:fs/promises";
import path from "node:path";

const logosDirectory = path.join(process.cwd(), "scraper/companies/logos");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (path.basename(id) !== id || !id.endsWith(".png")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const logo = await readFile(path.join(logosDirectory, id));

    return new Response(logo, {
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Type": "image/png",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
