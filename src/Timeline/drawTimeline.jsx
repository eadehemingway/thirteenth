import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { axisBottom } from 'd3-axis'
import textures from 'textures'
import { data, periodChunks } from '../data/data'
import { drawAnnotations } from './drawAnnotations'
import { drawAreaGraph } from './drawAreaGraph'
import {
  bigTimelineHeight,
  initialMaxYear,
  initialMinYear,
  svgHeight,
  svgWidth,
  textureColors,
} from './variables'
import { getXScale } from './utils'


export const drawTimeline = () => {
  const bigTimelineGroup = select('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)
    .append('g')
    .attr('class', 'big-timeline')
    .attr('overflow', 'hidden')
    .attr('width', 100)

  // ---------BIG TIMELINE create scales-----------------------------------------------------------------

  const xScale = getXScale(initialMinYear, initialMaxYear)
  const yearIntoXScale = (year) => xScale(new Date(year, 0, 0))

  const yScale = scaleLinear().domain([-1, 5]).range([bigTimelineHeight, 0])

  // ---------BIG TIMELINE draw textured bgs-----------------------------------------------------------------

  bigTimelineGroup
    .selectAll('.big-tm-textured-bg')
    .data(periodChunks)
    .enter()
    .append('rect')
    .attr('class', 'big-tm-textured-bg')
    .attr('x', (d ) => yearIntoXScale(d.startYear))
    .attr('y', 0)
    .attr('height', bigTimelineHeight)
    .attr(
      'width',
      (d ) => yearIntoXScale(d.endYear) - yearIntoXScale(d.startYear)
    )
    .attr('fill', (d, i) => {
      const color = textures.lines().lighter().size(8).stroke(textureColors[i])
      select('svg').call(color)
      return color.url()
    })

  // ---------BIG TIMELINE draw the x axis-----------------------------------------------------------------
  bigTimelineGroup
    .append('g')
    .attr('class', 'big-axis')
    .attr('transform', `translate(0,${svgHeight / 2})`)
    .call(axisBottom(xScale))

  // ---------BIG TIMELINE plot lines-----------------------------------------------------------------
  bigTimelineGroup
    .append('g')
    .attr('class', 'big-timeline-line-group')
    .selectAll('line')
    .data(data, (d ) => d.id)
    .enter()
    .append('line')
    .attr('class', 'big-timeline-line')
    .attr('x1', (d) => yearIntoXScale(d.startYear))
    .attr('x2', (d) => yearIntoXScale(d.startYear))
    .attr('y1', (d) => yScale(d.level))
    .attr('y2', (d) => yScale(d.level) + 15)
    .attr('stroke-width', 3)
    .attr('stroke', 'lightgray')

  // ---------BIG TIMELINE draw labels-----------------------------------------------------------------
  drawAnnotations(yearIntoXScale, yScale)

  drawAreaGraph('big', initialMinYear, initialMaxYear)
}
