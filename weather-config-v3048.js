/*
  Scentory Live Weather configuration.
  Set endpoint to the deployed weather worker URL. Never place the OpenWeather
  API key in this browser file; keep it in the worker's OPENWEATHER_API_KEY secret.
*/
window.SCENTORY_WEATHER_CONFIG = Object.freeze({
  endpoint: '',
  countryCode: 'BD',
  cacheMinutes: 10
});
