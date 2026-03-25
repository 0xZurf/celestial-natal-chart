import { jsPDF } from 'jspdf'
import { SIGNS, PLANETS as PLANET_DATA, HOUSES, formatDegree, getSignFromLongitude } from '../data/zodiac'
import { planetInSign, planetInHouse, risingSign } from '../data/interpretations'

// Colors
const GOLD = [251, 191, 36]
const WHITE = [255, 255, 255]
const MUTED = [180, 180, 200]
const BG = [12, 4, 32]
const CARD_BG = [26, 16, 64]
const LAVENDER = [196, 181, 253]

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 20
const CONTENT_W = PAGE_W - MARGIN * 2

export function generatePDF(chartData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  let y = 0

  function newPage() {
    doc.addPage()
    drawBackground(doc)
    y = MARGIN
  }

  function checkSpace(needed) {
    if (y + needed > PAGE_H - MARGIN) {
      newPage()
    }
  }

  function drawText(text, x, size, color, opts = {}) {
    doc.setFontSize(size)
    doc.setTextColor(...color)
    if (opts.bold) doc.setFont('helvetica', 'bold')
    else doc.setFont('helvetica', 'normal')

    if (opts.align === 'center') {
      doc.text(text, PAGE_W / 2, y, { align: 'center' })
    } else {
      doc.text(text, x, y)
    }
  }

  function drawWrapped(text, x, maxW, size, color) {
    doc.setFontSize(size)
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(text, maxW)
    lines.forEach((line) => {
      checkSpace(5)
      doc.text(line, x, y)
      y += size * 0.45
    })
  }

  // ── Page 1: Cover ──
  drawBackground(doc)
  y = 80

  drawText('CELESTIAL', 0, 28, GOLD, { align: 'center', bold: true })
  y += 10
  drawText('Natal Chart Reading', 0, 12, MUTED, { align: 'center' })
  y += 20

  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.3)
  doc.line(PAGE_W / 2 - 20, y, PAGE_W / 2 + 20, y)
  y += 15

  drawText(chartData.name, 0, 20, WHITE, { align: 'center', bold: true })
  y += 10
  drawText(`${chartData.birthData.date}  at  ${chartData.birthData.time}`, 0, 10, MUTED, { align: 'center' })
  y += 6

  if (typeof chartData.birthData.location === 'string') {
    const locLines = doc.splitTextToSize(chartData.birthData.location, 140)
    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    locLines.forEach((line) => {
      drawText(line, 0, 9, MUTED, { align: 'center' })
      y += 5
    })
  }

  // ── Page 2: Big Three + Summary ──
  newPage()

  drawText('THE BIG THREE', 0, 14, GOLD, { align: 'center', bold: true })
  y += 12

  const sun = chartData.planets.find((p) => p.name === 'Sun')
  const moon = chartData.planets.find((p) => p.name === 'Moon')
  const ascSign = getSignFromLongitude(chartData.houses.ascendant)
  const sunSign = SIGNS[sun.sign]
  const moonSign = SIGNS[moon.sign]

  const bigThree = [
    { label: 'Sun', sign: sunSign, degree: formatDegree(sun.longitude) },
    { label: 'Moon', sign: moonSign, degree: formatDegree(moon.longitude) },
    { label: 'Rising', sign: ascSign, degree: formatDegree(chartData.houses.ascendant) },
  ]

  bigThree.forEach((item) => {
    checkSpace(18)
    // Card background
    doc.setFillColor(...CARD_BG)
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, 16, 3, 3, 'F')

    drawText(item.label.toUpperCase(), MARGIN + 6, 8, MUTED, { bold: true })
    drawText(`${item.sign.name}`, MARGIN + 40, 11, GOLD, { bold: true })
    drawText(item.degree, PAGE_W - MARGIN - 6, 8, MUTED)
    doc.text(item.degree, PAGE_W - MARGIN - 6, y, { align: 'right' })

    y += 20
  })

  // Rising sign interpretation
  if (risingSign?.[ascSign.name]) {
    y += 4
    drawText('YOUR RISING SIGN', 0, 10, LAVENDER, { align: 'center', bold: true })
    y += 8
    drawWrapped(risingSign[ascSign.name], MARGIN, CONTENT_W, 9, WHITE)
    y += 6
  }

  // ── Pages: Planet Placements ──
  newPage()
  drawText('PLANET PLACEMENTS', 0, 14, GOLD, { align: 'center', bold: true })
  y += 12

  chartData.planets.forEach((planet) => {
    const sign = SIGNS[planet.sign]
    const planetInfo = PLANET_DATA.find((p) => p.name === planet.name)
    const house = HOUSES[planet.house - 1]
    const signInterp = planetInSign?.[planet.name]?.[sign.name] || ''
    const houseInterp = planetInHouse?.[planet.name]?.[planet.house] || ''

    // Estimate space needed
    const interpLines = doc.splitTextToSize(signInterp + ' ' + houseInterp, CONTENT_W - 12)
    const needed = 30 + interpLines.length * 4
    checkSpace(needed)

    // Card background
    doc.setFillColor(...CARD_BG)
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, needed - 4, 3, 3, 'F')

    // Planet name + sign
    drawText(`${planet.name}${planet.retrograde ? ' (Rx)' : ''}`, MARGIN + 6, 11, WHITE, { bold: true })
    doc.setFontSize(11)
    doc.setTextColor(...GOLD)
    doc.text(`${sign.name}  /  House ${planet.house}`, PAGE_W - MARGIN - 6, y, { align: 'right' })
    y += 6

    // Degree + keyword
    drawText(`${formatDegree(planet.longitude)}  -  ${planetInfo?.keyword || ''}`, MARGIN + 6, 8, MUTED)
    y += 6

    // Interpretations
    if (signInterp) {
      drawText(`In ${sign.name}:`, MARGIN + 6, 8, LAVENDER, { bold: true })
      y += 4
      drawWrapped(signInterp, MARGIN + 6, CONTENT_W - 12, 8.5, WHITE)
      y += 2
    }

    if (houseInterp) {
      drawText(`${house.name} (${house.keyword}):`, MARGIN + 6, 8, LAVENDER, { bold: true })
      y += 4
      drawWrapped(houseInterp, MARGIN + 6, CONTENT_W - 12, 8.5, WHITE)
    }

    y += 10
  })

  // ── Houses ──
  newPage()
  drawText('HOUSES', 0, 14, GOLD, { align: 'center', bold: true })
  y += 12

  chartData.houses.cusps.forEach((cusp, i) => {
    const house = HOUSES[i]
    const sign = getSignFromLongitude(cusp)
    const planetsInHouse = chartData.planets.filter((p) => p.house === i + 1)

    checkSpace(22)

    doc.setFillColor(...CARD_BG)
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, 18, 3, 3, 'F')

    drawText(`House ${i + 1}`, MARGIN + 6, 10, WHITE, { bold: true })
    doc.setFontSize(10)
    doc.setTextColor(...GOLD)
    doc.text(`${sign.name}`, PAGE_W / 2, y, { align: 'center' })
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(formatDegree(cusp), PAGE_W - MARGIN - 6, y, { align: 'right' })
    y += 5

    drawText(`${house.keyword} - ${house.description}`, MARGIN + 6, 7.5, [...MUTED])
    y += 4

    if (planetsInHouse.length > 0) {
      drawText(`Planets: ${planetsInHouse.map((p) => p.name).join(', ')}`, MARGIN + 6, 7.5, LAVENDER)
    }

    y += 12
  })

  // ── Aspects ──
  newPage()
  drawText('ASPECTS', 0, 14, GOLD, { align: 'center', bold: true })
  y += 12

  // Table header
  doc.setFillColor(...CARD_BG)
  doc.roundedRect(MARGIN, y - 4, CONTENT_W, 8, 2, 2, 'F')
  drawText('Planet 1', MARGIN + 6, 7.5, MUTED, { bold: true })
  drawText('Aspect', MARGIN + 50, 7.5, MUTED, { bold: true })
  drawText('Planet 2', MARGIN + 90, 7.5, MUTED, { bold: true })
  drawText('Orb', PAGE_W - MARGIN - 6, 7.5, MUTED, { bold: true })
  doc.text('Orb', PAGE_W - MARGIN - 6, y, { align: 'right' })
  y += 8

  chartData.aspects.forEach((aspect) => {
    checkSpace(7)

    drawText(aspect.planet1, MARGIN + 6, 8, WHITE)
    drawText(aspect.type, MARGIN + 50, 8, GOLD)
    drawText(aspect.planet2, MARGIN + 90, 8, WHITE)
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(`${aspect.orb.toFixed(1)}\u00B0`, PAGE_W - MARGIN - 6, y, { align: 'right' })

    y += 6
  })

  // ── Footer on last page ──
  y = PAGE_H - 20
  drawText('Generated by Celestial  -  Built by JohnnyLeeXYZ', 0, 7, MUTED, { align: 'center' })

  // Save
  const filename = `${chartData.name.replace(/\s+/g, '_')}_natal_chart.pdf`
  doc.save(filename)
}

function drawBackground(doc) {
  doc.setFillColor(...BG)
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F')
}
