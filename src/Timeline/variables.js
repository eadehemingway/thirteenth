import { data } from '../data/data'
import { purple, red, sienna, orange } from '../styles'

export const textureColors = [red, purple, sienna, orange]

export const svgWidth = 1000
export const svgHeight = 500
export const startYears = data.map((d) => d.startYear)

export const minYearInData = Math.min(...startYears)
export const maxYearInData = Math.max(...startYears)

export const bigTimelineHeight = 250

export const initialMinYear = 1950
export const initialMaxYear = 1970

const bottomPadding = 50
export const smallTimelineHeight = 100
export const miniYBottom = svgHeight - bottomPadding
export const miniYTop = svgHeight - smallTimelineHeight - bottomPadding
