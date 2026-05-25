/* ═══════════════════════════════════════════════════════════════════
   CORS helper — restrictive by default.
   Set env.ALLOWED_ORIGIN to a comma-separated whitelist:
     "https://ritmopadel.shop,https://www.ritmopadel.shop"
   ═══════════════════════════════════════════════════════════════════ */
export function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allow = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowed = allow.includes(origin) ? origin : (allow[0] || '*');
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function preflight(request, env) {
  return new Response(null, { status: 204, headers: corsHeaders(request, env) });
}

export function jsonResponse(body, init = {}, request, env) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(request, env),
      ...(init.headers || {}),
    },
  });
}
