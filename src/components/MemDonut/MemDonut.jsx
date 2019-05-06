import React, { Component, Fragment } from "react";
import * as d3 from "d3";
import * as scale from "d3-scale";
export default class MemDonut extends Component {
  constructor(props) {
    super(props);
    this.sca = null;
    this.getData = this.getData.bind(this)
  
  }


  componentDidMount() {
    let componentheight = document.getElementById("mem_usagebar").clientHeight;
    let componentwidth = document.getElementById("mem_usagebar").clientWidth;    
    this.displayMem(componentheight, componentwidth, false);
    this.displayMem(componentheight, componentwidth, false);
  }
  componentDidUpdate() {
    let componentheight = document.getElementById("mem_usagebar").clientHeight;
    let componentwidth = document.getElementById("mem_usagebar").clientWidth;
    
  
    this.displayMem(componentheight, componentwidth);
  }

  getData() {
    return  this.props.memory
  }

  displayMem(cheight,cwidth, _redraw=true) {
    var data = this.getData()
    console.log(data)

    var category = ['Free', 'Used'],
        cateColor = [ "#ffee00" , "#0068b7"];

    //generation function
    function generate(data, id) {
      var margin = {top: 20, right: 0, bottom: 40, left: 0},
          width = cwidth - margin.left - margin.right,
          height = cheight - margin.top - margin.bottom;

      var radius = Math.min(width, height) / 2,
          innerRadius = radius * 0.25,
          outerRadius = radius * 0.75;

      var legendRectSize = radius/8,
          legendSpacing = radius/5;

      var color = scale
          .scaleOrdinal()
          .domain(category)
          .range(cateColor);

      var formatPercent = d3.format(".0%");

      var pie = d3
          .pie()
          .value(function(d) {return d.value; })
          .sort(null);

      var arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);

      var svgX = (width+margin.right+margin.left) / 2,
          svgY = (radius*2 + margin.top*2) / 2;

      var svg = d3.select(id).append("svg")
          .attr("width", width+margin.right+margin.left)
          .attr("height", height+margin.top+margin.bottom)
          .append("g")
          .attr("transform", "translate(" + svgX + "," + svgY + ")");

      var path = svg.datum(data).selectAll(".solidArc")
          .data(pie)
          .enter()
          .append("path")
          .attr("fill", function(d) {
            return color(d.data.inits);
          })
          .attr("class", "solidArc")
          .attr("stroke", "none")
          .attr("d", arc)
          .each(function(d) {
            this._current=d;
          })
          .on('mouseover', function(d) {
            console.log(d);

            d3.select(this).transition().duration(200).attr("d", arc.innerRadius(innerRadius).outerRadius(outerRadius / 0.75 * 0.9));

            //count the sum
            var count = 0;
            for (var i = 0; i < category.length; i++) {
              count += data[i]['value'];
            }

            svg.append("svg:text")
                .attr("class", "donutCenterText")
                .attr("dy", "-.3em")
                .attr("text-anchor", "middle")
                .transition().duration(200)
                .text(d['data']['inits']);

            svg.append("svg:text")
                .attr("class", "donutCenterText")
                .attr("dy", ".8em")
                .attr("text-anchor", "middle")
                .transition().duration(200)
                .text(formatPercent(d['value'] / count));

          })
          .on('mouseout', function(d) {
            d3.select(this).transition().duration(200).attr("d", arc.innerRadius(innerRadius).outerRadius(outerRadius));

            d3.selectAll('.donutCenterText').remove();
          });

      //legend rendering
      var legend = svg.selectAll('.legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr("id", function(d) {
            return "legend-" + d;
          })
          .attr('class', 'legend')
          .attr('transform', function(d, i) {
            var horz = (i-2.8)*(legendSpacing+legendRectSize);
            var vert =  radius + margin.bottom / 4;
            return 'translate(' + horz + ',' + vert + ')';
          });

      legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color);

      legend.append('text')
          .data(data)
          .attr('x', legendRectSize*1.2)
          .attr('y', legendRectSize/1.3)
          .text(function(d) {
            //console.log(d);
            return d.inits; });

      this.getPath = function() {
        return path;
      }

      this.getArc = function() {
        return d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
      }
    }

    //redraw function
    function redraw(data, path, arc) {
      //for the transition effect of donut chart
      var arcTween = function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      var donut = d3
          .pie()
          .value(function(d) {return d.value; })
          .sort(null);

      donut.value(function(d) { return d['value']; });
      path = path.datum(data).data(donut).attr("d", arc); // compute the new angles
      path.transition().duration(750).attrTween("d", arcTween);
    }

    //inits chart
    if (this.sca == null ) {
    this.sca = new generate(data, "#sensor-cpu-donut-d3");
    return
    }
    console.log("UPDATE IN HERE");
    let sca = this.sca;
   // setInterval(function() {
   
    redraw(data, this.sca.getPath(), this.sca.getArc());  
 // }, 5000)
}

  render() {
    return <div id={"sensor-cpu-donut-d3"} style={{ height: "280px" }} />;
  }
}
