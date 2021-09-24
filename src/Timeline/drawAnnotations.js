import { data } from '../data/data'
import { select, selectAll} from 'd3-selection'
// import { textwrap } from 'd3-textwrap'
import { annotation, annotationLabel } from 'd3-svg-annotation'
import _ from 'lodash'
import { maxYearInData } from './variables'

export const drawAnnotations = (yearIntoXScale, yScale) => {
  // get annotation data ======

  const annotationData = _.chain(data)
    .map((d) => {
      const dx = d.startYear === maxYearInData ? -250 : 20
      return {
        data: {
          startYear: d.startYear,
          description: d.description,
          title: d.title,
        },
        note: {
          title: `${d.title}. (${d.startYear})`,
          label: d.description,
          align: 'middle',
          orientation: 'leftright',
          wrap: 260,
          padding: 0,
          bgPadding: { top: 0, bottom: 0, left: 0, right: 0 },
        },
        x: yearIntoXScale(d.startYear),
        // y: yScale(d.level),
        y: yScale(d.level),
        dx: dx,
        dy: 0,
      }
    })
    .value()

  // draw annotations ======
  const makeAnnotations = annotation()
    .type(annotationLabel)
    .annotations(annotationData)

  select('svg')
    .append('g')
    .attr('class', 'annotation-group')
    .call(makeAnnotations)

  const allAnnotationText = selectAll('.annotation text')
  const wholeLabels = selectAll('.label')
  const backgroundRects = selectAll('.annotation-note-bg')
  const titles = selectAll('.annotation-note-title')
  const descriptions = selectAll('.annotation-note-label')
  const connectors = selectAll('.connector')

  // annotation styles ==========
  allAnnotationText
    .attr('fill', 'lightgray')
    .attr('font-size', '11px')
    .attr('font-family', 'JosefinSans')
    .attr('transform', 'translate(15,15)')

  connectors.attr('stroke', 'lightgray')

  descriptions.attr('display', 'none').attr('opacity', 0)

  wholeLabels.style('cursor', 'pointer')

  backgroundRects
    .attr('fill', '#282c34')
    .attr('fill-opacity', 0.7)
    .attr('stroke-dasharray', (d ) => {
      const description = d.note.label.trim()
      return description.length ? 2 : null
    })
    .attr('stroke', (d ) => {
      const description = d.note.label.trim()
      return description.length ? '#f9a03f' : '#956025'
    })
    .attr('width', 210) // hard coding this because the wrap above seems to make the rect too big
    .attr('height', (d ) => {
      return getClosedLabelHeight(d.note.title)
    }) // hard coding this (estimating the height of a title)
    .style('cursor', 'pointer')

  titles.style('cursor', 'pointer')

  // annotation mouse overs ========

  wholeLabels.on('mouseleave', function () {
    const parentGroup = select(this)
    closeAnnotation(parentGroup)
  })

  backgroundRects.on('mouseover', function () {
    openAnnotation(this)
  })

  titles.on('mouseover', function () {
    openAnnotation(this)
  })
}

const openAnnotation = (textOrRectSelection) => {
  const labelParentGroup = select(
    textOrRectSelection?.parentNode?.parentNode?.parentNode
  )
  labelParentGroup.raise()

  const backgroundRects = labelParentGroup.select('.annotation-note-bg')

  backgroundRects
    .transition()
    .duration(300)
    .attr('fill-opacity', 1)
    .attr('height', (d ) => {
      const title = d.note.title
      const titleLength = title.trim().length
      const descriptionLength = d.note.label.trim().length

      if (!descriptionLength) return getClosedLabelHeight(title)
      const textHeight = titleLength + descriptionLength
      const rectHeight = textHeight / 2.7 + 60 // bit hacky - using the text length to try to calculate the rect height
      return Math.max(rectHeight, 50)
    })

  const descriptions = labelParentGroup.select('.annotation-note-label')
  descriptions
    .transition()
    .duration(750)
    .attr('opacity', 1)
    .attr('display', 'block')
}

const closeAnnotation = (parentGroup) => {
  parentGroup
    .select('.annotation-note-bg')
    .transition()
    .duration(300)
    .attr('height', (d) => {
      return getClosedLabelHeight(d.note.title)
    })
    .attr('fill-opacity', 0.7)

  parentGroup.select('.annotation-note-label').transition().attr('opacity', 0)
}

const getClosedLabelHeight = (title) => {
  const lines = title.trim().length / 30
  const lineHeight = 18
  const textHeight = lineHeight * lines
  const padding = 30
  const closedLabelHeight = textHeight + padding
  return Math.max(closedLabelHeight, 50)
}
