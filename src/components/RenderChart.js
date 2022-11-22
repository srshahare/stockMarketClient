import { useEffect, useState } from "react";
import { TypeChooser } from "vision-react-stock-chart/lib/helper";
import Chart from "./Chart";
import { getData } from "../utils/dataGenerator";
import moment from "moment";
var W3CWebSocket = require("websocket").w3cwebsocket;

const RenderChart = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    getData().then((data) => {
      console.log(data)
      setData(data);
    });
  }, []);

  const [chartData, setChartData] = useState(null);

  // useEffect(() => {
  //   const client = new W3CWebSocket("ws://localhost:5000/marketData");

  //   client.onopen = () => {
  //     console.log("websocket client connected");

  //     setTimeout(() => {
  //       const data = {
  //         requestType: "GetMinuteData",
  //       };
  //       client.send(JSON.stringify(data));
  //     }, 5000);
  //   };

  //   client.onmessage = (message) => {
  //     const data = JSON.parse(message.data);
  //     // console.log(data);
  //     if (data.MessageType === "GetMinuteData") {
  //       const listData = {
  //         date: moment.unix(data.Result.tradeTime).toDate(),
  //         open: 0,
  //         high: 0,
  //         low: 0,
  //         close: 0,
  //         volume: data.Result.CE.Volume,
  //       };
  //       if (chartData === null) {
  //         setChartData([listData]);
  //       } else {
  //         setChartData([...chartData, listData]);
  //       }
  //     }
  //   };

  //   client.onerror = () => {
  //     console.log("connection error");
  //   };
  // }, []);

  return (
    <div>
      {!data ? (
        <h2>Loading...</h2>
      ) : (
        <div>
          <TypeChooser>
            {(type) => <Chart type={type} data={data} />}
          </TypeChooser>
        </div>
      )}
    </div>
  );
};

export default RenderChart;
