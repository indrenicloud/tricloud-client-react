import React, { Component, Fragment } from "react";
import * as d3 from "d3";
class UsageBar extends Component {
  constructor(props) {
    super(props);
    this.divref = React.createRef();
  }

  componentDidMount() {
    let componentheight = document.getElementById("realcpu_usage").clientHeight;
    let componentwidth = document.getElementById("realcpu_usage").clientWidth;
    this.displayDCPU(componentheight, componentwidth);
  }
  componentDidUpdate() {
    let componentheight = document.getElementById("realcpu_usage").clientHeight;
    let componentwidth = document.getElementById("realcpu_usage").clientWidth;
    this.displayDCPU(componentheight, componentwidth);
  }

  displayDCPU(height, width) {
    let data = this.props.data;
    console.log(data);

    //generation function
    function generate(data, id) {
      const margin = { top: 45, right: 10, bottom: 45, left: 10 };
      height = height - margin.left - margin.right;
      width = width - margin.top - margin.bottom;

      var svg = d3
        .select(id)
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

      for (; i < 20; i++) {
        svg.select("#docker_cpu_rect_" + (i + 1)).style("fill", "#f3f3f3");
      }

      var j = 0;
      for (; j < temp; j++) {
        console.log("coloring stuff");
        svg.select("#docker_cpu_rect_" + (j + 1)).style("fill", "#fff");
      }

      svg.selectAll(".dockerCpuText").remove();

      svg
        .append("text")
        .attr("class", "dockerCpuText")
        .attr("x", 0)
        .attr("y", height * 0.8 + margin.top)
        .text(data + "%");
    }

    function redraw(data) {
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
    console.log(this.props.data);
    generate(data, "#docker-cpu-rect-d3");
    redraw(data);
  }
  render() {
    return (
      <div
        id={"docker-cpu-rect-d3"}
        key={this.divref}
        style={{ height: 200 + "px" }}
      />
    );
  }
}

export default UsageBar;
