import d3 from 'd3';
import * as request from 'superagent';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const legendData = [{Name:'Doping Allegations', Doping: true},{Name: 'No Doping Allegations'}];
const margin = {
  top: 80,
  left: 60,
  right: 100,
  bottom: 50
};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
const r = 5;

function init(err, response) {
  let data = JSON.parse(response.text);

  let yScale = d3.scale.linear()
    .domain(d3.extent(data, racePositions))
    .range([0, height]);

  let xScale = d3.scale.ordinal() 
    .domain(data.map(raceTime))
    .rangePoints([width, 0]);

  let _yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(10);

  let _xAxis = d3.svg.axis()
    .scale(xScale)
    .tickValues(xScale.domain().filter(getRaceTime))
    .orient('bottom');

  let svg = d3.select('#root').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right + margin.left)
    .attr('background-color', 'white');

  let yAxis = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(60,80)')
    .call(_yAxis)
    .append('text')
    .text('Ranking')
    .attr('transform', 'rotate(-90)')
    .attr('x', -50)
    .attr('y', -20);

  let xAxis = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', "translate(60" + "," +  (height + margin.top) + ")")
    .call(_xAxis)
    .append('text')
    .text('Finish Time')
    .attr('x', width / 2)
    .attr('y', (margin.bottom - 10));

  let scatter = svg.append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

  let circles = scatter.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .on('mouseover', show)
    .on('mouseout', hide)
    .attr('fill', _fill)
    .attr('cx', _xScale)
    .attr('cy', _yScale)
    .attr('r', r);

  let labels = scatter.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', _xScale)
    .attr('y', _yScale)
    .attr('transform', 'translate(15,4)')
    .text(_text);

  let legend = scatter.append('g')
    .attr('transform', "translate(" + (width - 50) + "," + (height / 2) + ")");

  let legendCircles = legend.selectAll('.legend')
    .data(legendData)
    .enter()
    .append('circle')
    .attr('fill', _fill)
    .attr('cy', legendY)
    .attr('r', r);

  let legendText = legend.selectAll('.legend text')
    .data(legendData)
    .enter()
    .append('text')
    .attr('transform', 'translate(15,4)')
    .attr('y', legendY)
    .text(_text);

  let toolTip = d3.select('#root').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('top', margin.top + "px")
    .style('left', margin.left + "px")
    .style('width', (height / 3) + "px");


  function show(d) {
    let html = d.Name + ": " + 
      d.Nationality + 
      "</br>" + 
      d.Year + ", " + d.Time +
      "</br>" +
      "</br>" + 
      d.Doping;

    toolTip.transition()
      .duration(200)
      .style('opacity', 0.6);

    return toolTip.html(html);
  }

  function hide(d) {
    return toolTip.transition()
      .duration(500)
      .style('opacity', 0);
  }

  function legendY(d,i) {
    return i * 30;
  }

  function getRaceTime(d,i) {
    return !(i % 2);
  }

  function raceTime(d) {
    return d.Time;
  }

  function racePositions(d) {
    return d.Place;
  }

  function _xScale(d) {
    return xScale(d.Time);
  }

  function _yScale(d) {
    return yScale(d.Place);
  }

  function _fill(d) {
    return d.Doping ? 'teal' : 'maroon';
  }

  function _text(d) {
    return d.Name;
  }
}

request.get(url)
  .end(init);
