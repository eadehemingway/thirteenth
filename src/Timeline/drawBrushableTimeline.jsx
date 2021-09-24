import { select } from 'd3-selection'
import { axisBottom } from "d3-axis"
import { brushX } from 'd3-brush'
import { scaleLinear } from 'd3-scale'
import textures from 'textures'
import { data, periodChunks } from '../data/data'
import { drawAreaGraph } from './drawAreaGraph'
import {
  initialMaxYear,
  initialMinYear,
  maxYearInData,
  miniYBottom,
  miniYTop,
  minYearInData,
  smallTimelineHeight,
  svgWidth,
  textureColors,
} from './variables'
import { getXScale } from './utils'

export const drawBrushableTimeline = (setYearMin, setYearMax) => {
  const svg = select('svg').append('g').attr('class', 'mini-timeline')

  // ---------SMALL TIMELINE create scales-----------------------------------------------------------------

  const mini_xScale = getXScale(minYearInData, maxYearInData)

  const miniYearIntoXScale = (year) => mini_xScale(new Date(year, 0, 0))

  const mini_yScale = scaleLinear()
    .domain([0, 4])
    .range([miniYBottom, miniYTop])

  // ---------SMALL TIMELINE draw axis-----------------------------------------------------------------

  svg
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + miniYBottom + ')')
    .call(axisBottom(mini_xScale))

  // ---------SMALL TIMELINE draw textured bgs-----------------------------------------------------------------

  svg
    .selectAll('.textured-bg-rects')
    .data(periodChunks)
    .enter()
    .append('rect')
    .attr('class', 'textured-bg-rects')
    .attr('x', (d) => miniYearIntoXScale(d.startYear))
    .attr('y', miniYTop)
    .attr('height', smallTimelineHeight)
    .attr(
      'width',
      (d) =>
        miniYearIntoXScale(d.endYear) - miniYearIntoXScale(d.startYear)
    )
    .attr('fill', (d, i) => {
      const color = textures.lines().lighter().size(8).stroke(textureColors[i])
      svg.call(color)
      return color.url()
    })
  // ---------SMALL TIMELINE draw period labels-----------------------------------------------------------------

  svg
    .append('g')
    .attr('class', 'period-text')
    .selectAll('text.period')
    .data(periodChunks)
    .join('text')
    .attr('class', 'period')
    .attr('x', (d ) => miniYearIntoXScale(d.startYear))
    .attr('y', miniYTop - 10)
    .attr('text-anchor', 'start')
    .attr('fill', (d, i) => textureColors[i])
    .attr('font-size', '11.5px')
    .attr('font-weight', 700)
    .text((d ) => d.name)

  // ---------SMALL TIMELINE draw lines-----------------------------------------------------------------

  svg
    .selectAll('.brush-lines')
    .data(data, (d ) => d.id)
    .enter()
    .append('line')
    .attr('x1', (d) => miniYearIntoXScale(d.startYear))
    .attr('x2', (d) => miniYearIntoXScale(d.startYear))
    .attr('y1', (d) => mini_yScale(d.level))
    .attr('y2', (d) => mini_yScale(d.level) + 10 * d.level)
    .attr('stroke-width', 2)
    .attr('stroke', 'lightgray')

  // ---------SMALL TIMELINE draw brush-----------------------------------------------------------------

  const brush = brushX()
    .extent([
      [0, miniYTop], // [x0, y0] is the top-left corner and
      [svgWidth - 10, miniYBottom], //[x1, y1] is the bottom-right corner (the -10 makes it stop at end, not sure why 10)
    ])
    .on('brush', brushed)

  const defaultSelection = [
    miniYearIntoXScale(initialMinYear),
    miniYearIntoXScale(initialMaxYear),
  ] // on page load what it selects

  svg.append('g').call(brush).call(brush.move, defaultSelection)

  function brushed({ selection }) {
    // the value we get from the inverse xscale is for example Sat Dec 31 1864 00:00:00
    // when the year should be 1865 should try and work out why but for now, just adding one
    const xYearMin = mini_xScale.invert(selection[0]).getFullYear() + 1
    const xYearMax = mini_xScale.invert(selection[1]).getFullYear() + 1

    setYearMin(xYearMin)
    setYearMax(xYearMax)
  }

  drawAreaGraph('mini', minYearInData, maxYearInData)
}
