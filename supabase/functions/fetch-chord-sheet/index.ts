/**
 * Supabase Edge Function: fetch-chord-sheet
 *
 * Fetches and parses chord sheet data from supported sites.
 *
 * Request body:
 * - url: string (required) - The URL of the chord sheet to fetch
 * - html?: string (optional) - Pre-fetched HTML content (for Cloudflare-protected sites)
 *
 * Response:
 * - success: true, data: FetchedChordSheet
 * - success: false, error: string
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import {
  fetchAndParse,
  parseHtmlOnly,
  isSupportedUrl,
} from "../_shared/parsers/index.ts";
import type { FetchRequest, ErrorResponse } from "../_shared/types.ts";

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    const error: ErrorResponse = {
      error: "Method not allowed. Use POST.",
      code: "METHOD_NOT_ALLOWED",
    };
    return new Response(JSON.stringify({ success: false, ...error }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Parse request body
    let body: FetchRequest & { html?: string };
    try {
      body = await req.json();
    } catch {
      const error: ErrorResponse = {
        error: "Invalid JSON in request body",
        code: "INVALID_JSON",
      };
      return new Response(JSON.stringify({ success: false, ...error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate URL
    const { url, html } = body;
    if (!url || typeof url !== "string") {
      const error: ErrorResponse = {
        error: "Missing or invalid 'url' parameter",
        code: "MISSING_URL",
      };
      return new Response(JSON.stringify({ success: false, ...error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if URL is from a supported site
    if (!isSupportedUrl(url)) {
      const error: ErrorResponse = {
        error: "URL is not from a supported site",
        code: "UNSUPPORTED_SITE",
      };
      return new Response(JSON.stringify({ success: false, ...error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the chord sheet
    let result;
    if (html && typeof html === "string") {
      // Use provided HTML (for Cloudflare-protected sites)
      result = parseHtmlOnly(url, html);
    } else {
      // Fetch and parse
      result = await fetchAndParse(url);
    }

    // Return result
    const status = result.success ? 200 : 422;
    return new Response(JSON.stringify(result), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const error: ErrorResponse = {
      error: `Server error: ${message}`,
      code: "SERVER_ERROR",
    };
    return new Response(JSON.stringify({ success: false, ...error }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
