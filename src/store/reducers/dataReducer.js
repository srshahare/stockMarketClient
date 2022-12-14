import { ActionTypes } from "../constants/actionTypes";
import moment from "moment";

const chartState = {
  minuteData: {
    loading: false,
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
    tradeTime: [],
  },
  minuteDataBank: {
    loading: false,
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
    tradeTime: [],
  },
  tickData: {
    loading: false,
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
    tradeTime: [],
  },
  tickDataBank: {
    loading: false,
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
    tradeTime: [],
  },
  callDone: false,
  client: null,
  loading: false,
  error: "",
  currentMinTime: "",
  currentTickTime: ""
};

const dataReducer = (state = chartState, action) => {
  const month = moment().month();
  const date = moment().date();
  const year = moment().year();
  let endTime = moment([year, month, date, 15, 30, 0, 0]).unix();

  switch (action.type) {
    case ActionTypes.CONNECTION_SUCCESS:
      return {
        ...state,
        client: action.payload,
        loading: false
      };
    case ActionTypes.CONNECTION_CLOSED:
      return {
        ...state,
        client: null,
        callDone: false,
        error: "Connection Closed! Please Click On Refresh Button!"
      };
    case ActionTypes.FETCH_DATA_INIT:
      return {
        ...state,
        loading: true,
        callDone: true,
      };
    case ActionTypes.FETCH_DATA_COMPLETE:
      let data = action.payload;
      if (data) {
        if (data.constructor === Array) {
          let callData = [];
          let putData = [];
          let callDataPer = [];
          let putDataPer = [];
          let tradeTime = [];
          const filteredData = data.filter((t) => t.tradeTime <= endTime);
          const sortedData = filteredData.sort((a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime))
          let timestamp;
          sortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            tradeTime.push(item.tradeTime);
          });
          const minTime = moment(timestamp).format("hh:mm:ss A")
          return {
            ...state,
            minuteData: {
              ...state.minuteData,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
              tradeTime: tradeTime,
              loading: false,
            },
            loading: false,
            currentMinTime: minTime
          };
        } else {
          let { CE, PE, tradeTime } = data;
          if (tradeTime <= endTime) {
            const timestamp = moment.unix(tradeTime);
            const callData = [...state.minuteData.CE, [timestamp, CE.Volume]];
            const pullData = [...state.minuteData.PE, [timestamp, PE.Volume]];
            const callDataPer = [
              ...state.minuteData.CEPercent,
              [timestamp, CE.PercentVolume],
            ];
            const putDataPer = [
              ...state.minuteData.PEPercent,
              [timestamp, PE.PercentVolume],
            ];
            const minTime = moment(timestamp).format("hh:mm:ss A")
            const sortedCallData = callData.sort((a, b) => a[0] - b[0])
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0])
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0])
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0])
            return {
              ...state,
              minuteData: {
                ...state.minuteData,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
                tradeTime: [...state.minuteData.tradeTime, timestamp],
                loading: false,
              },
              loading: false,
              currentMinTime: minTime
            };
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }
    case ActionTypes.FETCH_DATA_COMPLETE_BANK:
      const bankData = action.payload;
      if (bankData) {
        if (bankData.constructor === Array) {
          let callData = [];
          let putData = [];
          let callDataPer = [];
          let putDataPer = [];
          let tradeTime = [];
          const filteredData = bankData.filter((t) => t.tradeTime <= endTime);
          const sortedData = filteredData.sort((a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime))
          let timestamp;
          sortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            tradeTime.push(item.tradeTime);
          });
          const minTime = moment(timestamp).format("hh:mm:ss A")
          return {
            ...state,
            minuteDataBank: {
              ...state.minuteDataBank,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
              tradeTime: tradeTime,
              loading: false,
            },
            loading: false,
            currentMinTime: minTime
          };
        } else {
          let { CE, PE, tradeTime } = bankData;
          if (tradeTime <= endTime) {
            const timestamp = moment.unix(tradeTime);
            const callData = [
              ...state.minuteDataBank.CE,
              [timestamp, CE.Volume],
            ];
            const pullData = [
              ...state.minuteDataBank.PE,
              [timestamp, PE.Volume],
            ];
            const callDataPer = [
              ...state.minuteDataBank.CEPercent,
              [timestamp, CE.PercentVolume],
            ];
            const putDataPer = [
              ...state.minuteDataBank.PEPercent,
              [timestamp, PE.PercentVolume],
            ];
            const minTime = moment(timestamp).format("hh:mm:ss A")
            const sortedCallData = callData.sort((a, b) => a[0] - b[0])
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0])
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0])
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0])
            return {
              ...state,
              minuteDataBank: {
                ...state.minuteDataBank,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
                tradeTime: [...state.minuteDataBank.tradeTime, timestamp],
                loading: false,
              },
              loading: false,
              currentMinTime: minTime
            };
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }
    case ActionTypes.FETCH_TICK_DATA_COMPLETE:
      const tickData = action.payload;
      if (tickData) {
        if (tickData.constructor === Array) {
          let callData = [];
          let putData = [];
          let callDataPer = [];
          let putDataPer = [];
          let tradeTime = [];
          const filteredData = tickData.filter((t) => t.tradeTime <= endTime);
          const sortedData = filteredData.sort((a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime))
          let timestamp;
          sortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            tradeTime.push(item.tradeTime);
          });
          const tickTime = moment(timestamp).format("hh:mm:ss A")
          return {
            ...state,
            tickData: {
              ...state.tickData,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
              tradeTime: tradeTime,
              loading: false,
            },
            loading: false,
            currentTickTime: tickTime
          };
        } else {
          let { CE, PE, tradeTime } = tickData;
          if (tradeTime <= endTime) {
            const timestamp = moment.unix(tradeTime);
            const callData = [...state.tickData.CE, [timestamp, CE.Volume]];
            const pullData = [...state.tickData.PE, [timestamp, PE.Volume]];
            const callDataPer = [
              ...state.tickData.CEPercent,
              [timestamp, CE.PercentVolume],
            ];
            const putDataPer = [
              ...state.tickData.PEPercent,
              [timestamp, PE.PercentVolume],
            ];
            const tickTime = moment(timestamp).format("hh:mm:ss A")
            const sortedCallData = callData.sort((a, b) => a[0] - b[0])
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0])
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0])
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0])
            return {
              ...state,
              tickData: {
                ...state.tickData,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
                tradeTime: [...state.tickData.tradeTime, timestamp],
                loading: false,
              },
              loading: false,
              currentTickTime: tickTime
            };
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }
    case ActionTypes.FETCH_TICK_DATA_COMPLETE_BANK:
      const tickDataBank = action.payload;
      if (tickDataBank) {
        if (tickDataBank.constructor === Array) {
          let callData = [];
          let putData = [];
          let callDataPer = [];
          let putDataPer = [];
          let tradeTime = [];
          const filteredData = tickDataBank.filter(
            (t) => t.tradeTime <= endTime
          );
          const sortedData = filteredData.sort((a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime))
          let timestamp;
          sortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            tradeTime.push(item.tradeTime);
          });
          const tickTime = moment(timestamp).format("hh:mm:ss A")
          return {
            ...state,
            tickDataBank: {
              ...state.tickDataBank,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
              tradeTime: tradeTime,
              loading: false,
            },
            loading: false,
            currentTickTime: tickTime
          };
        } else {
          let { CE, PE, tradeTime } = tickDataBank;
          if (tradeTime <= endTime) {
            const timestamp = moment.unix(tradeTime);
            const callData = [...state.tickDataBank.CE, [timestamp, CE.Volume]];
            const pullData = [...state.tickDataBank.PE, [timestamp, PE.Volume]];
            const callDataPer = [
              ...state.tickDataBank.CEPercent,
              [timestamp, CE.PercentVolume],
            ];
            const putDataPer = [
              ...state.tickDataBank.PEPercent,
              [timestamp, PE.PercentVolume],
            ];
            const tickTime = moment(timestamp).format("hh:mm:ss A")
            const sortedCallData = callData.sort((a, b) => a[0] - b[0])
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0])
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0])
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0])
            return {
              ...state,
              tickDataBank: {
                ...state.tickDataBank,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
                tradeTime: [...state.tickDataBank.tradeTime, timestamp],
                loading: false,
              },
              loading: false,
              currentTickTime: tickTime
            };
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }
    case ActionTypes.FETCH_DATA_FAILED:
      return {
        ...state,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default dataReducer;
