# Celestial - Natal Chart Generator

## Purpose

A full natal chart generator that calculates accurate planetary positions, Placidus house cusps, and aspects from birth data. Features an interactive SVG chart wheel and detailed text breakdowns for all placements.

## Features

- [x] Birth data input (name, email, date, time, location)
- [x] City search with geocoding (OpenStreetMap Nominatim)
- [x] Timezone detection from coordinates
- [x] Planetary position calculation (Sun through Pluto)
- [x] Placidus house system calculation
- [x] Aspect calculation (conjunction, sextile, square, trine, opposition)
- [x] Interactive SVG chart wheel
- [x] Planet-in-sign interpretations for all placements
- [x] Planet-in-house interpretations for all placements
- [x] House sign descriptions
- [x] Big Three (Sun/Moon/Rising) summary card

## Stack

- React + Vite + Tailwind
- astronomy-engine (planetary calculations)
- framer-motion (animations)
- Deployed to Vercel

## Routes / Pages

- `/` - Single page app with form -> loading -> results flow

## Notes

- Uses Placidus house system (most widely expected)
- Falls back to Equal House for extreme latitudes where Placidus fails
- Geocoding via OpenStreetMap Nominatim (free, no API key)
- Timezone via timeapi.io (free, no API key)
- All calculations happen client-side
- Dark mystical theme with gold accents, readable text
