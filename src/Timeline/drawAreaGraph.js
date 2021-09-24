import { getXScale } from './utils'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { select } from 'd3-selection'
import { curveCardinal, area as d3area } from "d3-shape"
import { incarcerations } from '../data/data'
import { bigTimelineHeight, miniYBottom, miniYTop } from './variables'

export const drawAreaGraph = (type, minX, maxX) => {
  const xScale = getXScale(minX, maxX)

  const yearIntoXScale = (year) => xScale(new Date(year, 0, 0))
  const isMini = type === 'mini'
  const bottom = isMini ? miniYBottom : bigTimelineHeight

  const yScaleForArea = getYScaleForArea(isMini)

  const area = d3area()
    .x((d ) => yearIntoXScale(+d.year))
    .y0(bottom)
    .y1((d ) => yScaleForArea(d.total))
    .curve(curveCardinal)

  select(`.${type}-timeline`)
    .append('g')
    .attr('class', 'incarcerations-group')
    .selectAll(`${type}-area`)
    .data([incarcerations])
    .join('path')
    .attr('class', `${type}-area`)
    .attr('d', (d ) => area(d))
    .attr('fill', 'white')
    .attr('stroke', 'white')
    .attr('stroke-opacity', 1)
    .attr('fill-opacity', 0.1)
}

export function getYScaleForArea(isMini, isRate = true) {
  const bottom = isMini ? miniYBottom : bigTimelineHeight
  const top = isMini ? miniYTop : 0

  return scaleLinear()
    .domain(extent(incarcerations, (d) => (isRate ? d.rate : d.total)))
    .range([bottom, top])
}
