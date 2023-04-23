import axios from "axios";
import { ActionTypes } from "../constants/actionTypes";
import moment from "moment";
var W3CWebSocket = require("websocket").w3cwebsocket;

export const initSocket = (currentData) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_DATA_INIT,
        payload: null,
      });

      // const client = new W3CWebSocket("ws://ec2-65-2-75-232.ap-south-1.compute.amazonaws.com:5000//marketData");
      const client = new W3CWebSocket("ws://localhost:5080//marketData");

      client.onopen = () => {
        console.log("websocket client connected");
        dispatch({
          type: ActionTypes.CONNECTION_SUCCESS,
          payload: client,
        });
        setTimeout(() => {
          console.log(currentData);
          const data = currentData;
          client.send(JSON.stringify(data));
        }, 500);
      };

      client.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data);
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
        if (data.MessageType === "GetIndexData") {
          if (data.Request.Exchange === "NIFTY") {
            dispatch({
              type: ActionTypes.FETCH_INDEX_COMPLETE,
              payload: data.Result,
            });
          } else if (data.Request.Exchange === "BANKNIFTY") {
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
        console.log("websocket closed!");
        dispatch({
          type: ActionTypes.CONNECTION_CLOSED,
          payload: null,
        });
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

export const fetchIndexData = (exchange, interval, duration, timestamp) => {
  return async (dispatch) => {
    try {
      const result = await axios.get("http://localhost:5080/indexData", {
        params: {
          exchange,
          interval,
          timestamp,
        },
      });
      const data = result.data;
      const result1 = await axios.get("http://localhost:5080/expoData", {
        params: {
          exchange,
          interval,
          duration,
          timestamp,
        },
      });
      const data1 = result1.data;
      if (data) {
        dispatch({
          type: ActionTypes.FETCH_INDEX_DATA,
          payload: { _indexData: data?.data, _expoData: data1?.data, exchange },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const changeDuration = (duration) => {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.CHANGE_DURATION,
      payload: duration,
    });
  };
};
