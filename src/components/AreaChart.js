import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

const AreaChart = ({ data, chartType, multiAxis, exchange }) => {
  const { CE, PE, CEPercent, PEPercent, tradeTime } = data;
  const state = {
    series: [
      {
        name: "CE",
        data: chartType === "STD" ? CE: CEPercent,
      },
      {
        name: "PE",
        data: chartType === "STD" ? PE: PEPercent,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
        },
        zoom: {
          autoScaleYaxis: true,
        },
        type: "area",
        height: 680,
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
        align: 'center',  
        verticalAlign: 'middle',  
        offsetX: 0,  
        offsetY: 0,  
        style: {  
          color: "#000000",  
          fontSize: '24px',  
          fontFamily: "Helvetica"  
        }  
      },
      colors: ['#00c853', '#d50000'],
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      // fill: {
      //   type: 'gradient',
      //   gradient: {
      //     shade: 'dark',
      //     type: "horizontal",
      //     shadeIntensity: 0.0,
      //     gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      //     inverseColors: true,
      //     opacityFrom: 0.6,
      //     opacityTo: 0.6,
      //     stops: [0, 50, 100],
      //     colorStops: []
      //   }
      // },
      title: {
        text: "Market Data (" + exchange + ")",
        align: "left",
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      xaxis: {
        labels: {
          datetimeUTC: false,
        },
        type: "datetime",
        // tickAmount: 356,
      },
      yaxis: multiAxis
        ? [
            {
              title: {
                text: `Call Volume (${chartType})`,
              },
            },
            {
              opposite: true,
              title: {
                text: `Put Volume (${chartType})`,
              },
            },
          ]
        : [
            {
              title: {
                text: chartType === "STD" ? "Volume": "Percent Volume",
              },
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

export default AreaChart;
