export const SIGNS = [
  { name: 'Aries', symbol: '\u2648', element: 'fire', modality: 'cardinal', ruler: 'Mars', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '\u2649', element: 'earth', modality: 'fixed', ruler: 'Venus', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '\u264A', element: 'air', modality: 'mutable', ruler: 'Mercury', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '\u264B', element: 'water', modality: 'cardinal', ruler: 'Moon', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '\u264C', element: 'fire', modality: 'fixed', ruler: 'Sun', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '\u264D', element: 'earth', modality: 'mutable', ruler: 'Mercury', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '\u264E', element: 'air', modality: 'cardinal', ruler: 'Venus', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '\u264F', element: 'water', modality: 'fixed', ruler: 'Pluto', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '\u2650', element: 'fire', modality: 'mutable', ruler: 'Jupiter', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '\u2651', element: 'earth', modality: 'cardinal', ruler: 'Saturn', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '\u2652', element: 'air', modality: 'fixed', ruler: 'Uranus', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '\u2653', element: 'water', modality: 'mutable', ruler: 'Neptune', dates: 'Feb 19 - Mar 20' },
]

export const PLANETS = [
  { name: 'Sun', symbol: '\u2609', keyword: 'Identity', description: 'Your core self, ego, and life purpose' },
  { name: 'Moon', symbol: '\u263D', keyword: 'Emotions', description: 'Your inner world, instincts, and emotional needs' },
  { name: 'Mercury', symbol: '\u263F', keyword: 'Communication', description: 'How you think, learn, and express ideas' },
  { name: 'Venus', symbol: '\u2640', keyword: 'Love', description: 'What you value, how you love, and your aesthetic sense' },
  { name: 'Mars', symbol: '\u2642', keyword: 'Drive', description: 'Your ambition, energy, aggression, and desires' },
  { name: 'Jupiter', symbol: '\u2643', keyword: 'Expansion', description: 'Where you find growth, luck, and wisdom' },
  { name: 'Saturn', symbol: '\u2644', keyword: 'Discipline', description: 'Your challenges, responsibilities, and life lessons' },
  { name: 'Uranus', symbol: '\u26E2', keyword: 'Revolution', description: 'Where you break the mold and seek freedom' },
  { name: 'Neptune', symbol: '\u2646', keyword: 'Intuition', description: 'Your dreams, illusions, and spiritual connection' },
  { name: 'Pluto', symbol: '\u2647', keyword: 'Transformation', description: 'Deep change, power, and rebirth in your life' },
]

export const HOUSES = [
  { number: 1, name: 'First House', keyword: 'Self', description: 'Identity, appearance, first impressions, and how you approach life' },
  { number: 2, name: 'Second House', keyword: 'Value', description: 'Money, possessions, self-worth, and personal resources' },
  { number: 3, name: 'Third House', keyword: 'Communication', description: 'Siblings, neighbors, short trips, learning, and daily expression' },
  { number: 4, name: 'Fourth House', keyword: 'Home', description: 'Family, roots, home life, emotional foundation, and ancestry' },
  { number: 5, name: 'Fifth House', keyword: 'Creativity', description: 'Romance, children, play, creative expression, and joy' },
  { number: 6, name: 'Sixth House', keyword: 'Service', description: 'Health, daily routines, work habits, and acts of service' },
  { number: 7, name: 'Seventh House', keyword: 'Partnership', description: 'Marriage, business partners, contracts, and one-on-one relationships' },
  { number: 8, name: 'Eighth House', keyword: 'Transformation', description: 'Shared resources, intimacy, death, rebirth, and the occult' },
  { number: 9, name: 'Ninth House', keyword: 'Philosophy', description: 'Travel, higher education, beliefs, religion, and the search for meaning' },
  { number: 10, name: 'Tenth House', keyword: 'Career', description: 'Public image, career, ambition, authority, and legacy' },
  { number: 11, name: 'Eleventh House', keyword: 'Community', description: 'Friends, groups, hopes, wishes, and humanitarian ideals' },
  { number: 12, name: 'Twelfth House', keyword: 'Unconscious', description: 'Hidden strengths, solitude, karma, spirituality, and the unseen' },
]

export const ASPECTS = [
  { name: 'Conjunction', symbol: '\u260C', angle: 0, orb: 8, color: 'var(--color-conjunction)', meaning: 'Fusion of energies, intensification' },
  { name: 'Sextile', symbol: '\u26B9', angle: 60, orb: 6, color: 'var(--color-sextile)', meaning: 'Opportunity, talent, easy flow' },
  { name: 'Square', symbol: '\u25A1', angle: 90, orb: 8, color: 'var(--color-square)', meaning: 'Tension, challenge, growth through friction' },
  { name: 'Trine', symbol: '\u25B3', angle: 120, orb: 8, color: 'var(--color-trine)', meaning: 'Harmony, natural gifts, ease' },
  { name: 'Opposition', symbol: '\u260D', angle: 180, orb: 8, color: 'var(--color-opposition)', meaning: 'Polarity, awareness, balancing act' },
]

export const ELEMENT_COLORS = {
  fire: 'var(--color-fire)',
  earth: 'var(--color-earth)',
  air: 'var(--color-air)',
  water: 'var(--color-water)',
}

export function getSignFromLongitude(longitude) {
  const index = Math.floor(((longitude % 360) + 360) % 360 / 30)
  return SIGNS[index]
}

export function getDegreeInSign(longitude) {
  return ((longitude % 360) + 360) % 360 % 30
}

export function formatDegree(longitude) {
  const sign = getSignFromLongitude(longitude)
  const deg = getDegreeInSign(longitude)
  const degrees = Math.floor(deg)
  const minutes = Math.floor((deg - degrees) * 60)
  return `${degrees}\u00B0${minutes}' ${sign.name}`
}
