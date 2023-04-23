import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

const CandleStickChart = ({ isLandscape, isMobile, exchange, candleData }) => {
  const { data, CEPercent, PEPercent } = candleData;
  const state = {
    series: [
      {
        name: "Index Data",
        data: data,
        type: "candlestick",
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
        opposite: true,
        // tickAmount: 10,
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        x: {
          format: "hh:mm",
        },
      },
    },
  };

  const state1 = {
    series: [
      {
        name: "CE",
        data: CEPercent,
      },
      {
        name: "PE",
        data: PEPercent,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: isMobile ? false : false,
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
      colors: ["#00c853", "#d50000"],
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      title: {
        text: "",
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
      yaxis: [
        {
          title: {
            text: isMobile ? "" : "Percent Volume",
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

  return (
    <div>
      <Chart
        options={state.options}
        series={state.series}
        type="candlestick"
        width="100%"
        style={{ paddingTop: isLandscape ? "2rem" : "" }}
        height={
          isMobile
            ? isLandscape
              ? window.screen.height / 2 - 50
              : 350
            : 680 / 2
        }
      />
      <Chart
        options={state1.options}
        series={state1.series}
        type="area"
        width="100%"
        style={{ paddingTop: isLandscape ? "2rem" : "" }}
        height={
          isMobile
            ? isLandscape
              ? window.screen.height / 2 - 50
              : 350
            : 680 / 2
        }
      />
    </div>
  );
};

export default CandleStickChart;
