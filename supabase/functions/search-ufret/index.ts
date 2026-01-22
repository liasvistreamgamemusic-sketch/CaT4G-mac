/**
 * Supabase Edge Function: search-ufret
 *
 * Searches U-Fret for songs by query string.
 *
 * Request body:
 * - query: string (required) - The search query
 * - page?: number (optional) - Page number for pagination (default: 1)
 *
 * Response:
 * - success: true, data: UfretSearchResponse
 * - success: false, error: string
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchPage } from "../_shared/http.ts";
import { parseSearchResults } from "../_shared/parsers/ufret.ts";
import type { ErrorResponse } from "../_shared/types.ts";

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
    let body: { query?: string; page?: number };
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

    // Validate query
    const { query, page = 1 } = body;
    if (!query || typeof query !== "string") {
      const error: ErrorResponse = {
        error: "Missing or invalid 'query' parameter",
        code: "MISSING_QUERY",
      };
      return new Response(JSON.stringify({ success: false, ...error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build search URL
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.ufret.jp/search.php?key=${encodedQuery}&p=${page}`;

    // Fetch search results page
    const html = await fetchPage(searchUrl);

    // Parse search results
    const result = parseSearchResults(html, page);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const error: ErrorResponse = {
      error: `Search error: ${message}`,
      code: "SEARCH_ERROR",
    };
    return new Response(JSON.stringify({ success: false, ...error }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
