/* ============================================================
   utils.js – Number formatting, helpers
   ============================================================ */
const Utils = (() => {
  /* Suffixes for "short scale" display */
  const SUFFIXES = [
    '', ' thousand', ' million', ' billion', ' trillion', ' quadrillion',
    ' quintillion', ' sextillion', ' septillion', ' octillion', ' nonillion',
    ' decillion', ' undecillion', ' duodecillion', ' tredecillion',
    ' quattuordecillion', ' quindecillion', ' sexdecillion', ' septendecillion',
    ' octodecillion', ' novemdecillion', ' vigintillion',
    ' unvigintillion', ' duovigintillion', ' trevigintillion',
    ' quattuorvigintillion', ' quinvigintillion', ' sexvigintillion',
    ' septenvigintillion', ' octovigintillion', ' novemvigintillion',
    ' trigintillion', ' untrigintillion', ' duotrigintillion',
    ' infinity'
  ];

  function formatNumber(n) {
    if (n === Infinity) return '∞';
    if (n < 0) return '-' + formatNumber(-n);
    if (n < 1e3) return n % 1 === 0 ? n.toString() : n.toFixed(1);
    let tier = Math.floor(Math.log10(Math.abs(n)) / 3);
    if (tier >= SUFFIXES.length) tier = SUFFIXES.length - 1;
    const divisor = Math.pow(10, tier * 3);
    const val = n / divisor;
    return val.toFixed(3 - Math.floor(Math.log10(val)) - 1) + SUFFIXES[tier];
  }

  function formatCm(n) {
    if (n < 100) return formatNumber(n) + ' cm';
    if (n < 1e5) return formatNumber(n / 100) + ' m';
    if (n < 1e8) return formatNumber(n / 1e5) + ' km';
    // After 1000 km, switch to scientific notation of km
    return formatSci(n / 1e5) + ' km';
  }

  /* Scientific notation: e.g. 1.234e12 km */
  function formatSci(n) {
    if (n === 0) return '0';
    const exp = Math.floor(Math.log10(Math.abs(n)));
    const mantissa = n / Math.pow(10, exp);
    return mantissa.toFixed(3) + 'e' + exp;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* simple event bus */
  const _listeners = {};
  function on(evt, fn) {
    (_listeners[evt] = _listeners[evt] || []).push(fn);
  }
  function emit(evt, data) {
    (_listeners[evt] || []).forEach(fn => fn(data));
  }

  return { formatNumber, formatCm, randomInt, lerp, on, emit, SUFFIXES };
})();
