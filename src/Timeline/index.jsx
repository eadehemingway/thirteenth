import React, { useCallback, useEffect, useState } from 'react'
import { area, curveCardinal} from 'd3-shape'
import styled from 'styled-components'
import { axisBottom } from 'd3-axis'
import { select, selectAll } from 'd3-selection'
import '../styles.css'
import { drawTimeline } from './drawTimeline'
import { drawBrushableTimeline } from './drawBrushableTimeline'
import { getXScale } from './utils'
import {
  bigTimelineHeight,
  maxYearInData,
  miniYBottom,
  minYearInData,
} from './variables'
import { getYScaleForArea } from './drawAreaGraph'
import { cream, Svg } from '../styles'

export function Timeline() {
  const [isRate, setIsRate] = useState(true)
  const [yearMin, setYearMin] = useState()
  const [yearMax, setYearMax] = useState()

  useEffect(() => {
    drawTimeline()
    drawBrushableTimeline(setYearMin, setYearMax)
  }, [])

  const updateTimeline = useCallback(() => {
    const newxscale = getXScale(yearMin, yearMax)
    const newYearIntoXScale = (year) => newxscale(new Date(year, 0, 0))

    // upate axis
    select('.big-axis').call(axisBottom(newxscale))

    // update lines
    selectAll('.big-timeline-line')
      .attr('x1', (d ) => newYearIntoXScale(d.startYear))
      .attr('x2', (d ) => newYearIntoXScale(d.startYear))

    // update backgrounds
    selectAll('.big-tm-textured-bg')
      .attr('x', (d ) => newYearIntoXScale(d.startYear))
      .attr('width', (d ) => {
        const initialVal =
          newYearIntoXScale(d.endYear) - newYearIntoXScale(d.startYear)
        return Math.max(initialVal, 100)
      })

    // update labels
    selectAll('.label').attr('transform', (d ) => {
      return `translate(${newYearIntoXScale(d.data.startYear)}, ${d.y})`
    })

    //update area graph
  }, [yearMin, yearMax])

  const updateArea = useCallback(
    (minX, maxX, areaClassName, isMini) => {
      const newxscale = getXScale(minX, maxX)
      const newYearIntoXScale = (year) => newxscale(new Date(year, 0, 0))

      const yScaleForArea = getYScaleForArea(isMini, isRate)
      const bottom = isMini ? miniYBottom : bigTimelineHeight
      const selected_area = area()
        .x((d ) => newYearIntoXScale(+d.year))
        .y0(bottom)
        .y1((d ) => {
          const data = isRate ? d.rate : d.total
          return yScaleForArea(data)
        })
        .curve(curveCardinal)

      selectAll(areaClassName).attr('d', (d ) => selected_area(d))
    },
    [isRate]
  )

  useEffect(() => {
    updateTimeline()

    updateArea(minYearInData, maxYearInData, '.mini-area', true)
    updateArea(yearMin, yearMax, '.big-area', false)
  }, [updateTimeline, updateArea, yearMax, yearMin])

  return (
    <Container>
      <div>
        <ToggleWrapper>
          <Label htmlFor="absolute-number">total population</Label>
          <Radio
            id="absolute-number"
            type="radio"
            value="on"
            name="number-rate"
            checked={isRate}
            onClick={() => setIsRate(true)}
          />
          <Label htmlFor="incarceration-rate">incarceration rate</Label>
          <Radio
            id="incarceration-rate"
            type="radio"
            value="off"
            name="number-rate"
            checked={!isRate}
            onClick={() => setIsRate(false)}
          />
        </ToggleWrapper>
        <Svg />
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  display: grid;
  justify-items: center;
`
const ToggleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;
`

const Label = styled.label`
  color: ${cream};
  margin: 10px;
`
const Radio = styled.input`
  cursor: pointer;
  color: red;
  background: green;
  &:checked {
    color: red;
    background: pink;
  }
`
