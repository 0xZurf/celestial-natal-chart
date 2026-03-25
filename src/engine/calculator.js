/**
 * Natal Chart Calculation Engine
 *
 * Uses astronomy-engine for planetary positions and implements
 * Placidus house calculations with Equal House fallback.
 */

import * as Astronomy from 'astronomy-engine';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BODIES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Sextile', angle: 60, orb: 6 },
  { name: 'Square', angle: 90, orb: 8 },
  { name: 'Trine', angle: 120, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 }
];

// ---------------------------------------------------------------------------
// Helpers -- angle math
// ---------------------------------------------------------------------------

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function rad(deg) { return deg * DEG2RAD; }
function deg(r) { return r * RAD2DEG; }

/** Normalize angle to [0, 360) */
function norm(angle) {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

/** Shortest angular distance between two ecliptic longitudes */
function angularDistance(lon1, lon2) {
  const diff = Math.abs(lon1 - lon2);
  return Math.min(diff, 360 - diff);
}

// ---------------------------------------------------------------------------
// Timezone resolution
// ---------------------------------------------------------------------------

/**
 * Try to resolve the IANA timezone name from coordinates via the TimeAPI.
 * Returns an object { timeZone, utcOffset } or null on failure.
 */
async function fetchTimezone(latitude, longitude) {
  try {
    const url =
      `https://timeapi.io/api/timezone/coordinate?latitude=${latitude}&longitude=${longitude}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      timeZone: data.timeZone || null,
      utcOffset: data.currentUtcOffset || null
    };
  } catch {
    return null;
  }
}

/**
 * Convert a local date/time string + timezone to a UTC Date object.
 *
 * @param {string} dateStr  "YYYY-MM-DD"
 * @param {string} timeStr  "HH:MM" (24-hour)
 * @param {string} tz       IANA timezone name (e.g. "America/New_York")
 * @returns {Date}          UTC Date
 */
function localToUTC(dateStr, timeStr, tz) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  // Build an initial guess: treat the values as UTC
  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  // Use Intl to find what the local time would be in `tz` at our guess
  // Then adjust by the difference.
  // Two iterations is enough for DST edge cases.
  for (let i = 0; i < 2; i++) {
    const parts = getLocalParts(guess, tz);
    const diffMs =
      (hour - parts.hour) * 3600000 +
      (minute - parts.minute) * 60000 +
      (day - parts.day) * 86400000;
    guess = new Date(guess.getTime() + diffMs);
  }

  return guess;
}

/** Extract local date/time parts in a given timezone from a Date object */
function getLocalParts(date, tz) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const parts = {};
  for (const { type, value } of fmt.formatToParts(date)) {
    if (type === 'year') parts.year = Number(value);
    if (type === 'month') parts.month = Number(value);
    if (type === 'day') parts.day = Number(value);
    if (type === 'hour') parts.hour = Number(value) % 24; // midnight can be 24
    if (type === 'minute') parts.minute = Number(value);
    if (type === 'second') parts.second = Number(value);
  }
  return parts;
}

/**
 * Fallback: estimate UTC offset from longitude alone (no DST awareness).
 */
function estimateUTCOffset(longitude) {
  return Math.round(longitude / 15);
}

// ---------------------------------------------------------------------------
// Planet positions
// ---------------------------------------------------------------------------

/**
 * Calculate ecliptic longitude for a body at a given time.
 * @returns {number} ecliptic longitude in degrees [0, 360)
 */
function bodyLongitude(bodyName, astroTime) {
  const vec = Astronomy.GeoVector(bodyName, astroTime, true);
  const ecl = Astronomy.Ecliptic(vec);
  return norm(ecl.elon);
}

/**
 * Determine whether a planet is retrograde at a given time by comparing
 * its longitude one day apart. Sun and Moon are never retrograde.
 */
function isRetrograde(bodyName, astroTime) {
  if (bodyName === 'Sun' || bodyName === 'Moon') return false;

  const lon1 = bodyLongitude(bodyName, astroTime);
  const later = Astronomy.MakeTime(
    new Date(astroTime.date.getTime() + 86400000)
  );
  const lon2 = bodyLongitude(bodyName, later);

  // If the longitude decreased (accounting for wrap-around), retrograde
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/**
 * Return sign index (0-11), sign name, and degree within sign for a longitude.
 */
function signFromLongitude(longitude) {
  const signIndex = Math.floor(longitude / 30);
  return {
    sign: signIndex,
    signName: SIGN_NAMES[signIndex],
    degree: longitude - signIndex * 30
  };
}

// ---------------------------------------------------------------------------
// Obliquity of the ecliptic
// ---------------------------------------------------------------------------

/**
 * Approximate obliquity for a given Julian date.
 * T = Julian centuries from J2000.0
 */
function obliquity(utcDate) {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0); // 2000-01-01T12:00Z
  const T = (utcDate.getTime() - J2000) / (365.25 * 86400000 * 100);
  return 23.4393 - 0.013 * T;
}

// ---------------------------------------------------------------------------
// House calculations -- Placidus
// ---------------------------------------------------------------------------

/**
 * Calculate MC (Midheaven) ecliptic longitude from RAMC and obliquity.
 * MC = atan2(sin(RAMC), cos(RAMC) * cos(obliquity))
 * Normalize to [0, 360).
 */
function calcMC(ramcDeg, oblDeg) {
  const ramcR = rad(ramcDeg);
  const oblR = rad(oblDeg);
  let mc = deg(Math.atan2(Math.sin(ramcR), Math.cos(ramcR) * Math.cos(oblR)));
  return norm(mc);
}

/**
 * Calculate ASC (Ascendant) ecliptic longitude.
 * ASC = atan2(-cos(RAMC), sin(obl)*tan(lat) + cos(obl)*sin(RAMC)) + 180
 */
function calcASC(ramcDeg, oblDeg, latDeg) {
  const ramcR = rad(ramcDeg);
  const oblR = rad(oblDeg);
  const latR = rad(latDeg);

  let asc = deg(
    Math.atan2(
      -Math.cos(ramcR),
      Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(ramcR)
    )
  ) + 180;

  return norm(asc);
}

/**
 * Convert a Right Ascension to ecliptic longitude.
 * lon = atan2(sin(RA), cos(RA) * cos(obliquity))
 */
function raToEclipticLon(raDeg, oblDeg) {
  const raR = rad(raDeg);
  const oblR = rad(oblDeg);
  let lon = deg(Math.atan2(Math.sin(raR), Math.cos(raR) * Math.cos(oblR)));
  return norm(lon);
}

/**
 * Ecliptic longitude to declination.
 * dec = asin(sin(obliquity) * sin(longitude))
 */
function eclipticLonToDec(lonDeg, oblDeg) {
  return deg(Math.asin(Math.sin(rad(oblDeg)) * Math.sin(rad(lonDeg))));
}

/**
 * Diurnal semi-arc (DSA) for a given declination and latitude.
 * DSA = acos(-tan(lat) * tan(dec))
 * Returns degrees. If the argument is out of [-1,1], returns null (circumpolar).
 */
function diurnalSemiArc(decDeg, latDeg) {
  const arg = -Math.tan(rad(latDeg)) * Math.tan(rad(decDeg));
  if (arg < -1 || arg > 1) return null; // circumpolar -- Placidus fails
  return deg(Math.acos(arg));
}

/**
 * Compute a single Placidus intermediate cusp via iteration.
 *
 * @param {number} ramcDeg  RAMC in degrees
 * @param {number} oblDeg   obliquity in degrees
 * @param {number} latDeg   geographic latitude in degrees
 * @param {number} fraction fraction of semi-arc (e.g. 1/3, 2/3)
 * @param {boolean} diurnal true for cusps 11/12 (above horizon), false for 2/3
 * @returns {number|null}   ecliptic longitude or null if failed
 */
function placidusIterate(ramcDeg, oblDeg, latDeg, fraction, diurnal) {
  // Initial guess for the RA of the cusp
  let ra;
  if (diurnal) {
    // Start with RAMC + fraction * 90 as a rough guess
    ra = ramcDeg + fraction * 90;
  } else {
    // For nocturnal cusps, start from IC side
    ra = ramcDeg + 180 - fraction * 90;
  }
  ra = norm(ra);

  const MAX_ITER = 50;
  const TOLERANCE = 0.001; // degrees

  for (let i = 0; i < MAX_ITER; i++) {
    const lon = raToEclipticLon(ra, oblDeg);
    const dec = eclipticLonToDec(lon, oblDeg);
    const dsa = diurnalSemiArc(dec, latDeg);
    if (dsa === null) return null;
    const nsa = 180 - dsa;

    let newRa;
    if (diurnal) {
      newRa = ramcDeg + fraction * dsa;
    } else {
      newRa = ramcDeg + 180 - fraction * nsa;
    }
    newRa = norm(newRa);

    const diff = angularDistance(ra, newRa);
    ra = newRa;
    if (diff < TOLERANCE) break;
  }

  return raToEclipticLon(ra, oblDeg);
}

/**
 * Calculate all 12 house cusps using Placidus system.
 * Falls back to Equal House if Placidus fails (extreme latitudes).
 *
 * @returns {{ cusps: number[], ascendant: number, midheaven: number, system: string }}
 */
function calculateHouses(ramcDeg, oblDeg, latDeg) {
  const mc = calcMC(ramcDeg, oblDeg);
  const asc = calcASC(ramcDeg, oblDeg, latDeg);

  // Attempt Placidus intermediate cusps
  const cusp11 = placidusIterate(ramcDeg, oblDeg, latDeg, 1 / 3, true);
  const cusp12 = placidusIterate(ramcDeg, oblDeg, latDeg, 2 / 3, true);
  const cusp2 = placidusIterate(ramcDeg, oblDeg, latDeg, 2 / 3, false);
  const cusp3 = placidusIterate(ramcDeg, oblDeg, latDeg, 1 / 3, false);

  const placidusOk =
    cusp11 !== null && cusp12 !== null && cusp2 !== null && cusp3 !== null;

  if (placidusOk) {
    // Build cusp array: cusp 1 = ASC, cusp 10 = MC
    const cusps = new Array(12);
    cusps[0] = norm(asc);       // House 1 (Ascendant)
    cusps[1] = norm(cusp2);     // House 2
    cusps[2] = norm(cusp3);     // House 3
    cusps[3] = norm(mc + 180);  // House 4 (IC, opposite MC)
    cusps[4] = norm(cusp11 + 180); // House 5 (opposite cusp 11)
    cusps[5] = norm(cusp12 + 180); // House 6 (opposite cusp 12)
    cusps[6] = norm(asc + 180); // House 7 (Descendant)
    cusps[7] = norm(cusp2 + 180); // House 8 (opposite cusp 2)
    cusps[8] = norm(cusp3 + 180); // House 9 (opposite cusp 3)
    cusps[9] = norm(mc);        // House 10 (Midheaven)
    cusps[10] = norm(cusp11);   // House 11
    cusps[11] = norm(cusp12);   // House 12

    return { cusps, ascendant: norm(asc), midheaven: norm(mc), system: 'Placidus' };
  }

  // Fallback: Equal House system (each house = ASC + n * 30)
  const cusps = Array.from({ length: 12 }, (_, i) => norm(asc + i * 30));
  return { cusps, ascendant: norm(asc), midheaven: norm(mc), system: 'Equal' };
}

// ---------------------------------------------------------------------------
// House assignment
// ---------------------------------------------------------------------------

/**
 * Determine which house (1-12) a planet falls in, given the cusp array.
 * A planet is in house N if its longitude is between cusp[N-1] and cusp[N],
 * moving counterclockwise (increasing longitude with wrap-around).
 */
function assignHouse(planetLon, cusps) {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];

    if (start < end) {
      // Normal case: no wrap-around
      if (planetLon >= start && planetLon < end) return i + 1;
    } else {
      // Wrap-around at 360/0 boundary
      if (planetLon >= start || planetLon < end) return i + 1;
    }
  }

  // Shouldn't happen, but default to house 1
  return 1;
}

// ---------------------------------------------------------------------------
// Aspect calculation
// ---------------------------------------------------------------------------

/**
 * Find all aspects between the given planet positions.
 * @param {{ name: string, longitude: number }[]} planets
 * @returns {Array} aspect objects
 */
function calculateAspects(planets) {
  const aspects = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const dist = angularDistance(planets[i].longitude, planets[j].longitude);

      for (const aspect of ASPECTS) {
        const orb = Math.abs(dist - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: aspect.name,
            angle: aspect.angle,
            orb: Math.round(orb * 100) / 100,
            exact: orb < 0.5
          });
          break; // only the closest matching aspect for each pair
        }
      }
    }
  }

  return aspects;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Calculate a complete natal chart.
 *
 * @param {Object} params
 * @param {string} params.name        Person's name
 * @param {string} params.email       Person's email (passed through, not used in calc)
 * @param {string} params.birthDate   "YYYY-MM-DD"
 * @param {string} params.birthTime   "HH:MM" (24-hour local time)
 * @param {number} params.latitude    Geographic latitude (-90 to 90)
 * @param {number} params.longitude        Geographic longitude (-180 to 180)
 * @param {string} [params.locationDisplay] Human-readable location name
 * @param {string} [params.timezone]        IANA timezone name (e.g. "America/New_York")
 * @returns {Promise<Object>}               Complete chart data
 */
export async function calculateChart({
  name,
  email,
  birthDate,
  birthTime,
  latitude,
  longitude,
  locationDisplay,
  timezone
}) {
  // -----------------------------------------------------------------------
  // 1. Resolve timezone
  // -----------------------------------------------------------------------
  let tz = timezone;

  if (!tz) {
    const fetched = await fetchTimezone(latitude, longitude);
    if (fetched && fetched.timeZone) {
      tz = fetched.timeZone;
    }
  }

  // -----------------------------------------------------------------------
  // 2. Convert local birth time to UTC
  // -----------------------------------------------------------------------
  let utcDate;

  if (tz) {
    utcDate = localToUTC(birthDate, birthTime, tz);
  } else {
    // Last resort: estimate offset from longitude
    const offset = estimateUTCOffset(longitude);
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    utcDate = new Date(Date.UTC(year, month - 1, day, hour - offset, minute, 0));
  }

  const astroTime = Astronomy.MakeTime(utcDate);

  // -----------------------------------------------------------------------
  // 3. Calculate planet positions
  // -----------------------------------------------------------------------
  const planets = BODIES.map((bodyName) => {
    const longitude = bodyLongitude(bodyName, astroTime);
    const { sign, signName, degree } = signFromLongitude(longitude);
    const retrograde = isRetrograde(bodyName, astroTime);

    return {
      name: bodyName,
      longitude: Math.round(longitude * 10000) / 10000,
      sign,
      signName,
      degree: Math.round(degree * 10000) / 10000,
      house: 0, // assigned after house calc
      retrograde
    };
  });

  // -----------------------------------------------------------------------
  // 4. Calculate houses
  // -----------------------------------------------------------------------
  const obl = obliquity(utcDate);

  // Greenwich Sidereal Time in hours
  const gstHours = Astronomy.SiderealTime(astroTime);

  // Local Sidereal Time in hours
  const lstHours = gstHours + longitude / 15;

  // RAMC in degrees
  const ramcDeg = norm(lstHours * 15);

  const houses = calculateHouses(ramcDeg, obl, latitude);

  // -----------------------------------------------------------------------
  // 5. Assign planets to houses
  // -----------------------------------------------------------------------
  for (const planet of planets) {
    planet.house = assignHouse(planet.longitude, houses.cusps);
  }

  // Round house cusps for clean output
  houses.cusps = houses.cusps.map((c) => Math.round(c * 10000) / 10000);
  houses.ascendant = Math.round(houses.ascendant * 10000) / 10000;
  houses.midheaven = Math.round(houses.midheaven * 10000) / 10000;

  // -----------------------------------------------------------------------
  // 6. Calculate aspects
  // -----------------------------------------------------------------------
  const aspects = calculateAspects(planets);

  // -----------------------------------------------------------------------
  // 7. Return complete chart
  // -----------------------------------------------------------------------
  return {
    name,
    birthData: {
      date: birthDate,
      time: birthTime,
      location: locationDisplay || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      timezone: tz || `UTC${estimateUTCOffset(longitude) >= 0 ? '+' : ''}${estimateUTCOffset(longitude)}`
    },
    planets,
    houses,
    aspects
  };
}
