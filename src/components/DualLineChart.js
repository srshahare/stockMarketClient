import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

const DualLineChart = ({
  data,
  bankData,
  exchange,
  isMobile,
  isLandscape,
  multiAxis,
}) => {
  const { Diff } = data;
  // console.log(Diff)
  const state = {
    series: [
      {
        name: "NIFTY",
        data: Diff,
      },
      {
        name: "BANKNIFTY",
        data: bankData.Diff,
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
        type: "area",
        height: isMobile ? 350 : 680,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 500,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
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
      //   colors: ["#00c853", "#d50000"],
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      title: {
        text: isMobile ? "" : "Market Data",
        align: "left",
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        // size: [2,2],
        // colors: undefined,
        // strokeWidth: 1,
        // strokeOpacity: 0.9,
        // strokeDashArray: 0,
        // fillOpacity: 1,
        // discrete: [],
        // shape: "circle",
        // radius: 10,
        // showNullDataPoints: true,
        size: 0,
        hover: {
          size: undefined,
          sizeOffset: 5,
        },
        style: "hollow",
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
      yaxis: multiAxis
        ? [
            {
              title: {
                text: `NIFTY Volume`,
              },
              labels: {
                formatter: (value) => numFormatter(value),
              },
              tickAmount: 10,
            },
            {
              opposite: true,
              title: {
                text: `BANKNIFTY Volume`,
              },
              labels: {
                formatter: (value) => numFormatter(value),
              },
              tickAmount: 10,
            },
          ]
        : [
            {
              title: {
                text: isMobile ? "" : "Volume",
              },
              labels: {
                formatter: (value) => numFormatter(value),
              },
              opposite: true,
              tickAmount: 10,
            },
          ],
      tooltip: {
        x: {
          format: "dd MMM yyyy hh:mm:ss",
        },
      },
      //   yaxis: {
      //     tooltip: {
      //       enabled: true,
      //     },
      //   },
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
      style={{ paddingTop: isLandscape ? "2rem" : "" }}
      height={isMobile ? (isLandscape ? window.screen.height - 50 : 350) : 680}
    />
  );
};

export default DualLineChart;
