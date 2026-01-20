/**
 * Supabase Edge Function: get-supported-sites
 *
 * Returns the list of supported chord sheet sites.
 *
 * Response:
 * - sites: SupportedSite[]
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { SUPPORTED_SITES } from "../_shared/parsers/index.ts";

serve((_req: Request): Response => {
  // Handle CORS preflight
  if (_req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Return supported sites
  return new Response(
    JSON.stringify({
      success: true,
      sites: SUPPORTED_SITES,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
