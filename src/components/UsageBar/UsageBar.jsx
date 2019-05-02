import React, { Component, Fragment } from "react";
import * as d3 from "d3";
class UsageBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data :0,
    };
  }

  componentDidMount() {
    let componentheight = document.getElementById("realcpu_usage").clientHeight;
    let componentwidth = document.getElementById("realcpu_usage").clientWidth;   
    this.displayDCPU(componentheight,componentwidth);
  }

  displayDCPU(height,width) {
    var data = 25;
    this.setState(
        {   
        data:this.props.data,
        }
    )
 
    //generation function
    function generate(data,id) {
      const margin = { top: 45, right: 10, bottom: 45, left: 10 };
        height = height - margin.left - margin.right
        width = width - margin.top - margin.bottom;

      var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      for (var i = 0; i < 20; i++) {
        svg
          .append("rect")
          .attr("width", (width - 84) / 20)
          .attr("height", height * 0.55)
          .attr("id", "docker_cpu_rect_" + (i + 1))
          .attr("transform", "translate(" + (i * (width - 4)) / 20 + ",0)");
      }

      var i = 0;
      var temp = Math.floor(data / 5);
      if (temp === 0 && data !== 0) temp = 1;

      for (; i < temp; i++) {
        svg.select("#docker_cpu_rect_" + (i + 1)).style("fill", "#00afff");
      }

      for (; i < 20; i++) {
        svg.select("#docker_cpu_rect_" + (i + 1)).style("fill", "#f3f3f3");
      }

      svg.selectAll(".dockerCpuText").remove();

      svg
        .append("text")
        .attr("class", "dockerCpuText")
        .attr("x", 0)
        .attr("y", height * 0.8 + margin.top)
        .text(data + "%");
    }

    //redraw function
    function redraw(data) {

      //format of time data
      var i = 0;
      var temp = Math.floor(data / 5);
      if (temp === 0 && data !== 0) temp = 1;

      for (; i < temp; i++) {
        d3.select("#docker_cpu_rect_" + (i + 1)).style("fill", "#00afff");
      }

      for (; i < 20; i++) {
        d3.select("#docker_cpu_rect_" + (i + 1)).style("fill", "#f3f3f3");
      }

      d3.select(".dockerCpuText").text(data + "%");
    }

    //inits chart
    var sca = new generate(data, "#docker-cpu-rect-d3");
    let newdata = this.state.data;
    //dynamic data and chart update
    setInterval(function() {
        //update donut data
        data = newdata;
        console.log(data);

        redraw(data);
      }, 1500);
  }
  render() {
    
    return (
    <div id="docker-cpu-rect-d3" style={{height: 200 + 'px'}}></div>
    );
  }
}

export default UsageBar;
