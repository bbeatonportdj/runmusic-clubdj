const FILE_ID_RE = /^[a-zA-Z0-9_-]{3,}$/;

export function extractDriveFileId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  if (FILE_ID_RE.test(s) && !s.startsWith("http://") && !s.startsWith("https://")) return s;

  try {
    const u = new URL(s);

    const idParam = u.searchParams.get("id");
    if (idParam && FILE_ID_RE.test(idParam)) return idParam;

    const m = u.pathname.match(/\/file\/d\/([^/]+)\//);
    if (m?.[1] && FILE_ID_RE.test(m[1])) return m[1];
  } catch {
    return null;
  }

  return null;
}

export function toDriveDirectDownloadUrl(idOrUrl: string): string | null {
  const id = extractDriveFileId(idOrUrl);
  if (!id) return null;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

