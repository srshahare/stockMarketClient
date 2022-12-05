import React, { useEffect } from "react";
import Chart from "react-apexcharts";

const TestChart = () => {
  const state = {
    series: [
      {
        name: "PE (SELL)",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "CE (BUY)",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 680,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#ff0000', '#00ff00'],
      stroke: {
        curve: "smooth",
      },
      // fill: {
      //   colors: ['#ff0000', '#00ff00']
      // },
      xaxis: {
        type: "datetime",
        // categories: [
        //     "1667360700",
        //     "1667360760", 
        //     "1667360820",
        //     "1667360880",
        //     "1667360940",
        //     "1667361000"
        // ],
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      yaxis: {
        title: {
          text: "Volume"
        }
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };

  // useEffect(() => {
  //   setInterval(() => {
  //     ApexCharts.exec('realtime', 'updateSeries', [{
  //       data: candleData
  //     }])
  //   }, 1000)
  // }, [])

  return (
    <Chart
      options={state.options}
      series={state.series}
      type="area"
      width="100%"
      height={680}
    />
  );
};

export default TestChart;
