
var margin = 100,
    width = 900 - margin,
    flow_height = 500 - margin; /* for some reason this gets confused with energy-chart's height
                                   if named 'height' */

var svg = d3.select('#fuel-flow-chart')
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinyMin meet')
            .attr('viewBox', '0 0 ' + (width + margin) + ' ' + (flow_height + margin))
            .classed('svg-content-responsive', true)

var formatNumber = d3.format(",.0f"),
    format = function(d) {
        return formatNumber(d) + " TWh";
    },
    color = d3.scaleOrdinal(d3.schemeCategory10);

var sankey = d3.sankey()
               .nodeId(function(d) {
                  return d.name;
               })
               .nodeWidth(15)
               .nodePadding(10)
               .extent([[1, 1], [width + margin, height - 6]]);

var link = svg.append('g')
                .attr('class', 'links')
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('stroke-opacity', 0.2)
              .selectAll('path');

var node = svg.append('g')
                .attr('class', 'nodes')
                .attr('font-family', 'Merriweather, serif')
                .attr('font-size', 10)
              .selectAll('g');

d3.json('data/fuel-flow-chart.json', function(error, energy) {
    if (error) throw error;

    sankey(energy);

    link = link.data(energy.links)
               .enter()
               .append('path')
                .attr('d', d3.sankeyLinkHorizontal())
                .attr('stroke-width', function(d) {
                    return Math.max(1, d.width);
                });

    link.append('title')
          .text(function(d) {
              return d.source.name + " → " + d.target.name + "\n" + format(d.value);
          });

    node = node.data(energy.nodes)
               .enter()
               .append('g');

    node.append('rect')
          .attr('x', function(d) {
              return d.x0;
          })
          .attr('y', function(d) {
              return d.y0;
          })
          .attr('height', function(d) {
              return d.y1 - d.y0;
          })
          .attr('width', function(d) {
              return d.x1 - d.x0;
          })
          .attr('fill', function(d) {
              return color(d.name.replace(/ .*/, ""));
          })
          .attr('stroke', '#000');

    node.append('text')
          .attr('x', function(d) {
              return d.x0 - 6;
          })
          .attr('y', function(d) {
              return (d.y1 + d.y0) / 2;
          })
          .attr('dy', '0.35em')
          .attr('text-anchor', 'end')
          .text(function(d) {
              return d.name;
          })
          .filter(function(d) {
              return d.x0 < width / 2;
          })
          .attr('x', function(d) {
              return d.x1 + 6;
          })
          .attr('text-anchor', 'start');

    node.append('title')
        .text(function(d) {
            return d.name + "\n" + format(d.value);
        })
});
