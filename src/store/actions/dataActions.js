import { ActionTypes } from "../constants/actionTypes";
var W3CWebSocket = require("websocket").w3cwebsocket;

export const initSocket = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_DATA_INIT,
        payload: null,
      });

      const client = new W3CWebSocket("ws://ec2-65-2-75-232.ap-south-1.compute.amazonaws.com:5000//marketData");

      client.onopen = () => {
        console.log("websocket client connected");
        dispatch({
          type: ActionTypes.CONNECTION_SUCCESS,
          payload: client,
        });
        setTimeout(() => {
          const data = {
            requestType: "GetMinuteData",
            exchange: "NIFTY",
            duration: "15",
            subscribe: true,
          };
          client.send(JSON.stringify(data));
        }, 2000);
      };

      client.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.MessageType === "GetMinuteData") {
          if (data.Request.Exchange === "NIFTY") {
            dispatch({
              type: ActionTypes.FETCH_DATA_COMPLETE,
              payload: data.Result,
            });
          } else if (data.Request.Exchange === "BANKNIFTY") {
            dispatch({
              type: ActionTypes.FETCH_DATA_COMPLETE_BANK,
              payload: data.Result,
            });
          }
        }
        if (data.MessageType === "GetTickData") {
          if (data.Request.Exchange === "NIFTY") {
            dispatch({
              type: ActionTypes.FETCH_TICK_DATA_COMPLETE,
              payload: data.Result,
            });
          } else if (data.Request.Exchange === "BANKNIFTY") {
            dispatch({
              type: ActionTypes.FETCH_TICK_DATA_COMPLETE_BANK,
              payload: data.Result,
            });
          }
        }
      };

      client.onerror = () => {
        console.log("connection error");
      };
    } catch (err) {
      console.log(err);
      dispatch({
        type: ActionTypes.FETCH_DATA_FAILED,
        payload: null,
      });
    }
  };
};
