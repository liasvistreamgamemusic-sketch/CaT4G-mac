/**
 * Supabase Edge Function: fetch-artist-songs
 *
 * Fetches song list from a U-Fret artist page.
 *
 * Request body:
 * - artistUrl: string (required) - The artist page URL
 * - artistName: string (required) - The artist name
 *
 * Response:
 * - success: true, data: UfretSearchResult[]
 * - success: false, error: string
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchPage } from "../_shared/http.ts";
import { parseArtistPage } from "../_shared/parsers/ufret.ts";
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
    let body: { artistUrl?: string; artistName?: string };
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

    // Validate artistUrl
    const { artistUrl, artistName } = body;
    if (!artistUrl || typeof artistUrl !== "string") {
      const error: ErrorResponse = {
        error: "Missing or invalid 'artistUrl' parameter",
        code: "MISSING_ARTIST_URL",
      };
      return new Response(JSON.stringify({ success: false, ...error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate artistName
    if (!artistName || typeof artistName !== "string") {
      const error: ErrorResponse = {
        error: "Missing or invalid 'artistName' parameter",
        code: "MISSING_ARTIST_NAME",
      };
      return new Response(JSON.stringify({ success: false, ...error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch artist page
    const html = await fetchPage(artistUrl);

    // Parse artist page to extract songs
    const results = parseArtistPage(html, artistName);

    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const error: ErrorResponse = {
      error: `Fetch artist songs error: ${message}`,
      code: "FETCH_ERROR",
    };
    return new Response(JSON.stringify({ success: false, ...error }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
