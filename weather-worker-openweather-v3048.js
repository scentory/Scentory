/* Scentory secure weather gateway v3048. */
const OPENWEATHER_BASE = 'https://api.openweathermap.org';
const DEFAULT_ORIGIN = 'https://scentoryfragrance.com';
const SECURITY_HEADERS = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=()',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Vary': 'Origin'
});

function allowedOrigin(env) {
  return String(env.ALLOWED_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, '');
}

function corsHeaders(origin, env) {
  if (origin !== allowedOrigin(env)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept',
    'Access-Control-Max-Age': '86400'
  };
}

function json(body, status, origin, env, cacheControl = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...SECURITY_HEADERS, ...corsHeaders(origin, env), 'Cache-Control': cacheControl }
  });
}

async function checkedFetch(url, ttl) {
  const response = await fetch(url.toString(), {
    cf: { cacheTtl: ttl, cacheEverything: true },
    signal: AbortSignal.timeout(6500)
  });
  if (!response.ok) throw new Error(`Upstream response ${response.status}`);
  return response.json();
}

async function geocodeCity(city, countryCode, key) {
  const query = city.includes(',') ? city : `${city},${countryCode}`;
  const url = new URL('/geo/1.0/direct', OPENWEATHER_BASE);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '1');
  url.searchParams.set('appid', key);
  const places = await checkedFetch(url, 86400);
  if (!Array.isArray(places) || !places[0]) return null;
  return {
    lat: Number(places[0].lat), lon: Number(places[0].lon),
    name: String(places[0].name || '').slice(0, 90),
    state: String(places[0].state || '').slice(0, 90),
    country: String(places[0].country || countryCode).slice(0, 2)
  };
}

async function currentWeather(lat, lon, key) {
  const url = new URL('/data/2.5/weather', OPENWEATHER_BASE);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('appid', key);
  url.searchParams.set('units', 'metric');
  return checkedFetch(url, 600);
}

async function rateLimit(request, env) {
  if (!env.RATE_LIMITER?.limit) return { success: true };
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  return env.RATE_LIMITER.limit({ key: ip });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const incoming = new URL(request.url);

    if (incoming.pathname === '/health') {
      return json({ ok: true, configured: Boolean(env.OPENWEATHER_API_KEY) }, 200, '', env);
    }
    if (origin !== allowedOrigin(env)) return json({ error: 'Origin not allowed' }, 403, '', env);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { ...SECURITY_HEADERS, ...corsHeaders(origin, env) } });
    }
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, origin, env);
    if (!env.OPENWEATHER_API_KEY) return json({ error: 'Weather service is not configured' }, 503, origin, env);

    const limit = await rateLimit(request, env);
    if (!limit.success) return json({ error: 'Too many requests. Please try again shortly.' }, 429, origin, env);

    try {
      let lat = incoming.searchParams.get('lat');
      let lon = incoming.searchParams.get('lon');
      let requestedPlace = '';
      if (!lat || !lon) {
        const city = (incoming.searchParams.get('city') || '').trim();
        if (!city || city.length > 90 || /[<>]/.test(city)) return json({ error: 'Provide a valid area name' }, 400, origin, env);
        const countryCode = String(env.COUNTRY_CODE || 'BD').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2) || 'BD';
        const place = await geocodeCity(city, countryCode, env.OPENWEATHER_API_KEY);
        if (!place) return json({ error: 'Area not found' }, 404, origin, env);
        lat = place.lat;
        lon = place.lon;
        requestedPlace = [place.name, place.state, place.country].filter(Boolean).join(', ');
      }

      const numericLat = Number(lat);
      const numericLon = Number(lon);
      if (!Number.isFinite(numericLat) || !Number.isFinite(numericLon) || Math.abs(numericLat) > 90 || Math.abs(numericLon) > 180) {
        return json({ error: 'Invalid coordinates' }, 400, origin, env);
      }

      const weather = await currentWeather(numericLat, numericLon, env.OPENWEATHER_API_KEY);
      const temperature = Number(weather.main?.temp);
      if (!Number.isFinite(temperature)) throw new Error('Incomplete upstream weather data');
      return json({
        location: requestedPlace || String(weather.name || 'Current location').slice(0, 120),
        temperature,
        feelsLike: Number(weather.main?.feels_like),
        humidity: Number(weather.main?.humidity),
        condition: String(weather.weather?.[0]?.description || 'Current conditions').slice(0, 120),
        windSpeed: Number(weather.wind?.speed),
        observedAt: new Date((Number(weather.dt) || Math.floor(Date.now() / 1000)) * 1000).toISOString()
      }, 200, origin, env, 'public, max-age=300, s-maxage=600');
    } catch (_) {
      return json({ error: 'Weather service is temporarily unavailable' }, 502, origin, env);
    }
  }
};
