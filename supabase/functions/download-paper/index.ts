import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const url = new URL(req.url);
    const fileUrlRaw = url.searchParams.get("fileUrl");
    const filename = url.searchParams.get("filename") || "download.pdf";

    if (!fileUrlRaw) {
      return json(400, { error: "Missing fileUrl" });
    }

    const fileUrl = new URL(fileUrlRaw);

    // Security: only allow proxying from the same backend host
    const backendUrl = Deno.env.get("SUPABASE_URL") || "";
    if (!backendUrl) {
      return json(500, { error: "Backend URL not configured" });
    }

    const allowedHost = new URL(backendUrl).host;
    if (fileUrl.host !== allowedHost) {
      return json(403, { error: "Forbidden file host" });
    }

    const upstream = await fetch(fileUrl.toString(), {
      headers: {
        // Keep it simple; storage/public files should not need auth.
        "Accept": "*/*",
      },
    });

    if (!upstream.ok) {
      console.error("download-paper upstream error:", upstream.status, upstream.statusText);
      return json(502, { error: `Failed to fetch file (${upstream.status})` });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        // Force download (prevents inline PDF viewer / blank screen in WebView)
        "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "\"")}"`,
        // Helpful for DownloadManager progress
        ...(upstream.headers.get("content-length")
          ? { "Content-Length": upstream.headers.get("content-length")! }
          : {}),
      },
    });
  } catch (error) {
    console.error("download-paper error:", error);
    return json(500, { error: (error as Error).message || "Unknown error" });
  }
});
