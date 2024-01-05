"use client"
import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Funnel from 'highcharts/modules/funnel';
import addFunnel from 'highcharts/modules/funnel';
import '../Styles/Pyramid.css'

// Initialize the funnel module
addFunnel(Highcharts);
Funnel(Highcharts);
class FunnelChart extends Component {
  constructor(props) {
    super(props);
 
    // Define your chart configuration options
    this.options = {
      chart: {
        type: "pyramid",
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            // format: '<b>{point.name}</b> ({point.y})',
            // format: '{point.percentage:.1f}%',
            format:
              "{point.name}",
            softConnector: false,
            connectorWidth: 0,
            inside: true,
            color: "black",
            style: {
              fontSize: "8px",
            },
          },
          center: ["34%", "19%"],
          width: "60%",
          height: "45%",
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false, // Remove Highcharts watermark
      },
      series: [
        {
          name: "Data",
          data: [
            {
              name: "P4 & Above",
              y: 40,
              color: "#7207b7",
            },
            {
              name: "P3",
              y: 40,
              color: "#503296",
            },
            // {
            //   name: "P3",
            //   y: 40,
            //   color: "#560BAD",
            // },
            {
              name: "P2B",
              y: 35,
              color: "#E80054",
            },
            {
              name: "P2A",
              y: 30,
              color: "#FFC300",
            },

            {
              name: "P1",
              y: 20,

              color: "#1EA4FF",
            },
          ],
        },
      ],
    };
  }
 
  render() {
    const chartStyle = {
     
      // background: 'none',
      width:"350px",
      height:"40px",
 
    };
 
    return (
      <div style={chartStyle}>
        <HighchartsReact highcharts={Highcharts} options={this.options} className="pyramid-main" />
      </div>
    );
  }
}
 
export default FunnelChart;
 