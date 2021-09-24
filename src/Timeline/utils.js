import { scaleTime } from 'd3-scale'

import { svgWidth } from './variables'

export const getXScale = (min, max) =>
  scaleTime()
    .domain([new Date(min, 0, 0), new Date(max, 0, 0)])
    .range([0, svgWidth - 10]) //I added 10 here so the last annotation doesn't get cut off
