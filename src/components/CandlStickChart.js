import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

const CandleStickChart = ({ isLandscape, isMobile, exchange, candleData }) => {
  const { data } = candleData;

  const state = {
    series: [
      {
        data: data,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: isMobile ? false : true,
        },
        zoom: {
          autoScaleYaxis: true,
        },
        type: "candlestick",
        height: isMobile ? 350 : 680,
        // animations: {
        //   enabled: true,
        //   easing: "easeinout",
        //   speed: 500,
        //   animateGradually: {
        //     enabled: true,
        //     delay: 150,
        //   },
        //   dynamicAnimation: {
        //     enabled: true,
        //     speed: 350,
        //   },
        // },
      },
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#000000",
          fontSize: "24px",
          fontFamily: "Helvetica",
        },
      },
      title: {
        text: isMobile ? "" : "Market Data (" + exchange + ")",
        align: "left",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        padding: {
          left: isMobile ? 8 : 8,
        },
      },
      xaxis: {
        labels: {
          datetimeUTC: false,
          format: "hh:mm",
          offsetX: 0,
        },
        type: "datetime",
        // tickAmount: 356,
      },
      yaxis: {
        title: {
          text: isMobile ? "" : "Percent Volume",
        },
        // labels: {
        //   formatter: (value) => numFormatter(value),
        // },
        opposite: false,
        // tickAmount: 10,
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  function numFormatter(num) {
    // if (num > 999 && num < 1000000) {
    //   return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
    // }
    if (Math.abs(num) > 999) {
      return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
    }
    // else if (num > 1000000) {
    //   return (num / 1000000).toFixed(2) + "M"; // convert to M for number from > 1 million
    // }
    else if (Math.abs(num) < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  return (
    <Chart
      options={state.options}
      series={state.series}
      type="candlestick"
      width="100%"
      style={{ paddingTop: isLandscape ? "2rem" : "" }}
      height={isMobile ? (isLandscape ? window.screen.height - 50 : 350) : 680}
    />
  );
};

export default CandleStickChart;
