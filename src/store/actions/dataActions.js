import { ActionTypes } from "../constants/actionTypes";
var W3CWebSocket = require("websocket").w3cwebsocket;

export const initSocket = (currentData) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_DATA_INIT,
        payload: null,
      });

      // const client = new W3CWebSocket("ws://ec2-65-2-75-232.ap-south-1.compute.amazonaws.com:5000//marketData");
      const client = new W3CWebSocket("ws://localhost:5000//marketData");

      client.onopen = () => {
        console.log("websocket client connected");
        dispatch({
          type: ActionTypes.CONNECTION_SUCCESS,
          payload: client,
        });
        setTimeout(() => {
          console.log(currentData)
          const data = currentData;
          client.send(JSON.stringify(data));
        }, 500);
      };

      client.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data)
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
        if(data.MessageType === "GetIndexData") {
          if(data.Request.Exchange === 'NIFTY') {
            dispatch({
              type: ActionTypes.FETCH_INDEX_COMPLETE,
              payload: data.Result,
            });
          }else if (data.Request.Exchange === "BANKNIFTY") {
            dispatch({
              type: ActionTypes.FETCH_INDEX_COMPLETE_BANK,
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

      client.onclose = () => {
        console.log("websocket closed!")
        dispatch({
          type: ActionTypes.CONNECTION_CLOSED,
          payload: null,
        });
      }

    } catch (err) {
      console.log(err);
      dispatch({
        type: ActionTypes.FETCH_DATA_FAILED,
        payload: null,
      });
    }
  };
};
