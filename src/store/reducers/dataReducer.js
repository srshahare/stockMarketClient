import { ActionTypes } from "../constants/actionTypes";
import moment, { duration } from "moment";

const chartState = {
  minuteData: {
    loading: false,
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
    Diff: [],
    DiffPercent: [],
    tradeTime: [],
  },
  indexMinData: {
    loading: false,
    data: [],
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
  },
  indexMinBankData: {
    loading: false,
    data: [],
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
  },
  minuteDataBank: {
    loading: false,
    CE: [],
    CEPercent: [],
    PE: [],
    PEPercent: [],
    Diff: [],
    DiffPercent: [],
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
  currentTickTime: "",
  duration: "15",
  websocket: true,
};

const dataReducer = (state = chartState, action) => {
  const month = moment().month();
  const date = moment().date();
  const year = moment().year();
  let endTime = moment([year, month, date, 15, 30, 0, 0]).unix();

  switch (action.type) {
    case ActionTypes.CHANGE_DURATION:
      const duration = action.payload;
      return {
        ...state,
        duration,
      };
    case ActionTypes.CONNECTION_SUCCESS:
      return {
        ...state,
        client: action.payload,
        websocket: true,
        loading: false,
      };
    case ActionTypes.CONNECTION_CLOSED:
      return {
        ...state,
        client: null,
        callDone: false,
        error: "Connection Closed! Please Click On Refresh Button!",
      };
    case ActionTypes.FETCH_INDEX_INIT:
      return {
        ...state,
        loading: true,
        callDone: true,
      };
    case ActionTypes.FETCH_INDEX_COMPLETE:
      let iData = action.payload;
      if (iData) {
        if (iData.indexData.constructor === Array) {
          let indexData = [];

          let callData = [];
          let putData = [];
          let callDataPer = [];
          let putDataPer = [];
          let tradeTime = [];

          let timestamp;
          // filtering expo data
          const efilteredData = iData.expoData.filter(
            (t) => t.tradeTime <= endTime
          );
          const esortedData = efilteredData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
          esortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            tradeTime.push(item.tradeTime);
          });

          // filtering index data
          const filterData = iData.indexData.filter(
            (t) => t.tradeTime <= endTime
          );
          const sortedData = filterData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
          sortedData.map((item) => {
            const { data } = item;
            const { Close, High, Low, Open } = data;
            timestamp = moment.unix(item.tradeTime);
            indexData.push([timestamp, Open, High, Low, Close]);
          });
          const minTime = moment(timestamp).format("hh:mm:ss A");
          const dur = parseInt(state.duration);
          for (let i = 0; i < dur - 1; i++) {
            indexData.shift();
          }
          return {
            ...state,
            indexMinData: {
              ...state.indexMinData,
              loading: false,
              data: indexData,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
            },
            minuteData: {
              ...state.minuteData,
              loading: false,
              CE: callData,
              CEPercent: callDataPer,
              PE: [],
              PEPercent: [],
              Diff: [],
              DiffPercent: [],
              tradeTime: [],
            },
            loading: false,
            currentMinTime: minTime,
          };
        } else {
          let { CE, PE } = iData;
          const { data, tradeTime } = iData.indexData;
          const { Close, High, Low, Open } = data;
          if (tradeTime <= endTime) {
            // expo data
            const timestamp = moment.unix(tradeTime);
            const callData = [...state.indexMinData.CE, [timestamp, CE.Volume]];
            const pullData = [...state.indexMinData.PE, [timestamp, PE.Volume]];
            const callDataPer = [
              ...state.indexMinData.CEPercent,
              [timestamp, CE.PercentVolume],
            ];
            const putDataPer = [
              ...state.indexMinData.PEPercent,
              [timestamp, PE.PercentVolume],
            ];
            const sortedCallData = callData.sort((a, b) => a[0] - b[0]);
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0]);
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0]);
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0]);

            // index data
            const indexData = [
              ...state.indexMinData.data,
              [timestamp, Open, High, Low, Close],
            ];
            const minTime = moment(timestamp).format("hh:mm:ss A");
            const sortedIndexData = indexData.sort((a, b) => a[0] - b[0]);
            return {
              ...state,
              indexMinData: {
                ...state.indexMinData,
                loading: false,
                data: sortedIndexData,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
              },
              loading: false,
              currentMinTime: minTime,
            };
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }
    case ActionTypes.FETCH_INDEX_FAILED:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.FETCH_INDEX_INIT_BANK:
      return {
        ...state,
        loading: true,
        callDone: true,
      };
    case ActionTypes.FETCH_INDEX_COMPLETE_BANK:
      let bData = action.payload;
      if (bData) {
        if (bData.indexData.constructor === Array) {
          let indexData = [];

          let callData = [];
          let putData = [];
          let callDataPer = [];
          let putDataPer = [];
          let tradeTime = [];

          let timestamp;
          // filtering expo data
          const efilteredData = bData.expoData.filter(
            (t) => t.tradeTime <= endTime
          );
          const esortedData = efilteredData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
          esortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            tradeTime.push(item.tradeTime);
          });

          //filtering index data
          const filterData = bData.indexData.filter(
            (t) => t.tradeTime <= endTime
          );
          const sortedData = filterData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
          sortedData.map((item) => {
            const { data } = item;
            const { Close, High, Low, Open } = data;
            timestamp = moment.unix(item.tradeTime);
            indexData.push([timestamp, Open, High, Low, Close]);
          });
          const minTime = moment(timestamp).format("hh:mm:ss A");
          const dur = parseInt(state.duration);
          for (let i = 0; i < dur - 1; i++) {
            indexData.shift();
          }
          return {
            ...state,
            indexMinBankData: {
              ...state.indexMinBankData,
              loading: false,
              data: indexData,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
            },
            loading: false,
            currentMinTime: minTime,
          };
        } else {
          let { CE, PE } = bData;
          const { data, tradeTime } = bData.indexData;
          const { Close, High, Low, Open } = data;
          if (tradeTime <= endTime) {
            let { CE, PE } = bData;
            const { data, tradeTime } = bData.indexData;
            const { Close, High, Low, Open } = data;
            if (tradeTime <= endTime) {
              // expo data
              const timestamp = moment.unix(tradeTime);
              const callData = [
                ...state.indexMinBankData.CE,
                [timestamp, CE.Volume],
              ];
              const pullData = [
                ...state.indexMinBankData.PE,
                [timestamp, PE.Volume],
              ];
              const callDataPer = [
                ...state.indexMinBankData.CEPercent,
                [timestamp, CE.PercentVolume],
              ];
              const putDataPer = [
                ...state.indexMinBankData.PEPercent,
                [timestamp, PE.PercentVolume],
              ];
              const sortedCallData = callData.sort((a, b) => a[0] - b[0]);
              const sortedPutData = pullData.sort((a, b) => a[0] - b[0]);
              const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0]);
              const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0]);

              // index data
              const indexData = [
                ...state.indexMinBankData.data,
                [timestamp, Open, High, Low, Close],
              ];
              const minTime = moment(timestamp).format("hh:mm:ss A");
              const sortedIndexData = indexData.sort((a, b) => a[0] - b[0]);
              return {
                ...state,
                indexMinBankData: {
                  ...state.indexMinBankData,
                  loading: false,
                  data: sortedIndexData,
                  CE: sortedCallData,
                  PE: sortedPutData,
                  CEPercent: sortedCallDataPer,
                  PEPercent: sortedPutDataPer,
                },
                loading: false,
                currentMinTime: minTime,
              };
            }
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }
    case ActionTypes.FETCH_INDEX_FAILED_BANK:
      return {
        ...state,
        loading: false,
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
          let diffData = [];
          let diffDataPer = [];
          const filteredData = data.filter((t) => t.tradeTime <= endTime);
          const sortedData = filteredData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
          let timestamp;
          sortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            diffData.push([timestamp, parseFloat(CE.Volume - PE.Volume)]);
            diffDataPer.push([
              timestamp,
              parseFloat(CE.PercentVolume - PE.PercentVolume),
            ]);
            tradeTime.push(item.tradeTime);
          });
          const minTime = moment(timestamp).format("hh:mm:ss A");
          return {
            ...state,
            minuteData: {
              ...state.minuteData,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
              DiffPercent: diffDataPer,
              Diff: diffData,
              tradeTime: tradeTime,
              loading: false,
            },
            loading: false,
            currentMinTime: minTime,
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
            const diffData = [
              ...state.minuteData.Diff,
              [timestamp, parseFloat(CE.Volume - PE.Volume)],
            ];
            const diffDataPer = [
              ...state.minuteData.DiffPercent,
              [timestamp, parseFloat(CE.PercentVolume - PE.PercentVolume)],
            ];
            const minTime = moment(timestamp).format("hh:mm:ss A");
            const sortedCallData = callData.sort((a, b) => a[0] - b[0]);
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0]);
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0]);
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0]);
            const sortedDiffData = diffData.sort((a, b) => a[0] - b[0]);
            const sortedDiffDataPer = diffDataPer.sort((a, b) => a[0] - b[0]);
            return {
              ...state,
              minuteData: {
                ...state.minuteData,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
                Diff: sortedDiffData,
                DiffPercent: sortedDiffDataPer,
                tradeTime: [...state.minuteData.tradeTime, timestamp],
                loading: false,
              },
              loading: false,
              currentMinTime: minTime,
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
          let diffData = [];
          let diffDataPer = [];
          let tradeTime = [];
          const filteredData = bankData.filter((t) => t.tradeTime <= endTime);
          const sortedData = filteredData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
          let timestamp;
          sortedData.map((item) => {
            let { CE, PE } = item;
            timestamp = moment.unix(item.tradeTime);
            callData.push([timestamp, CE.Volume]);
            putData.push([timestamp, PE.Volume]);
            callDataPer.push([timestamp, CE.PercentVolume]);
            putDataPer.push([timestamp, PE.PercentVolume]);
            diffData.push([timestamp, parseFloat(CE.Volume - PE.Volume)]);
            diffDataPer.push([
              timestamp,
              parseFloat(CE.PercentVolume - PE.PercentVolume),
            ]);
            tradeTime.push(item.tradeTime);
          });
          const minTime = moment(timestamp).format("hh:mm:ss A");
          return {
            ...state,
            minuteDataBank: {
              ...state.minuteDataBank,
              CE: callData,
              PE: putData,
              CEPercent: callDataPer,
              PEPercent: putDataPer,
              DiffPercent: diffDataPer,
              Diff: diffData,
              tradeTime: tradeTime,
              loading: false,
            },
            loading: false,
            currentMinTime: minTime,
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
            const diffData = [
              ...state.minuteDataBank.Diff,
              [timestamp, parseFloat(CE.Volume - PE.Volume)],
            ];
            const diffDataPer = [
              ...state.minuteDataBank.DiffPercent,
              [timestamp, parseFloat(CE.PercentVolume - PE.PercentVolume)],
            ];
            const minTime = moment(timestamp).format("hh:mm:ss A");
            const sortedCallData = callData.sort((a, b) => a[0] - b[0]);
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0]);
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0]);
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0]);
            const sortedDiffData = diffData.sort((a, b) => a[0] - b[0]);
            const sortedDiffDataPer = diffDataPer.sort((a, b) => a[0] - b[0]);
            return {
              ...state,
              minuteDataBank: {
                ...state.minuteDataBank,
                CE: sortedCallData,
                PE: sortedPutData,
                CEPercent: sortedCallDataPer,
                PEPercent: sortedPutDataPer,
                Diff: sortedDiffData,
                DiffPercent: sortedDiffDataPer,
                tradeTime: [...state.minuteDataBank.tradeTime, timestamp],
                loading: false,
              },
              loading: false,
              currentMinTime: minTime,
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
          const sortedData = filteredData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
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
          const tickTime = moment(timestamp).format("hh:mm:ss A");
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
            currentTickTime: tickTime,
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
            const tickTime = moment(timestamp).format("hh:mm:ss A");
            const sortedCallData = callData.sort((a, b) => a[0] - b[0]);
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0]);
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0]);
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0]);
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
              currentTickTime: tickTime,
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
          const sortedData = filteredData.sort(
            (a, b) => parseInt(a.tradeTime) - parseInt(b.tradeTime)
          );
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
          const tickTime = moment(timestamp).format("hh:mm:ss A");
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
            currentTickTime: tickTime,
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
            const tickTime = moment(timestamp).format("hh:mm:ss A");
            const sortedCallData = callData.sort((a, b) => a[0] - b[0]);
            const sortedPutData = pullData.sort((a, b) => a[0] - b[0]);
            const sortedCallDataPer = callDataPer.sort((a, b) => a[0] - b[0]);
            const sortedPutDataPer = putDataPer.sort((a, b) => a[0] - b[0]);
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
              currentTickTime: tickTime,
            };
          }
        }
      } else {
        return {
          ...state,
          loading: false,
        };
      }

    case ActionTypes.FETCH_INDEX_DATA:
      const { _indexData, _expoData, exchange } = action.payload;

      let indexData = [];

      let callData = [];
      let putData = [];
      let callDataPer = [];
      let putDataPer = [];
      let tradeTime = [];
      let diffData = [];
      let diffDataPer = [];

      let timestamp;
      // filtering expo data
      const esortedData = _expoData.sort(
        (a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp)
      );
      esortedData.map((item) => {
        const { expoAvgData } = item;
        const data = JSON.parse(expoAvgData);
        let { CE, PE } = data;
        timestamp = moment.unix(item.timeStamp);
        callData.push([timestamp, CE.Volume]);
        putData.push([timestamp, PE.Volume]);
        callDataPer.push([timestamp, CE.PercentVolume]);
        putDataPer.push([timestamp, PE.PercentVolume]);
        diffData.push([timestamp, parseFloat(CE.Volume - PE.Volume)]);
        diffDataPer.push([
          timestamp,
          parseFloat(CE.PercentVolume - PE.PercentVolume),
        ]);
        tradeTime.push(item.timeStamp);
      });

      // filtering index data
      const sortedData = _indexData.sort(
        (a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp)
      );
      sortedData.map((item) => {
        const { snapshotData } = item;
        const data = JSON.parse(snapshotData);
        const { Close, High, Low, Open } = data.data;
        timestamp = moment.unix(item.timeStamp);
        indexData.push([timestamp, Open, High, Low, Close]);
      });
      const minTime = moment(timestamp).format("hh:mm:ss A");
      const dur = parseInt(state.duration);
      for (let i = 0; i < dur - 1; i++) {
        indexData.shift();
      }

      if (exchange === "NIFTY") {
        return {
          ...state,
          indexMinData: {
            ...state.indexMinData,
            loading: false,
            data: indexData,
            CE: callData,
            PE: putData,
            CEPercent: callDataPer,
            PEPercent: putDataPer,
          },
          minuteData: {
            ...state.minuteData,
            loading: false,
            CE: callData,
            CEPercent: callDataPer,
            PE: putData,
            PEPercent: putDataPer,
            Diff: diffData,
            DiffPercent: diffDataPer,
            tradeTime: tradeTime,
          },
          loading: false,
          currentMinTime: minTime,
          websocket: false,
        };
      }else {
        return {
          ...state,
          indexMinBankData: {
            ...state.indexMinData,
            loading: false,
            data: indexData,
            CE: callData,
            PE: putData,
            CEPercent: callDataPer,
            PEPercent: putDataPer,
          },
          minuteDataBank: {
            ...state.minuteData,
            loading: false,
            CE: callData,
            CEPercent: callDataPer,
            PE: putData,
            PEPercent: putDataPer,
            Diff: diffData,
            DiffPercent: diffDataPer,
            tradeTime: tradeTime,
          },
          loading: false,
          currentMinTime: minTime,
          websocket: false,
        };
      }

    case ActionTypes.FETCH_EXPO_DATA:
      return {
        ...state,
        websocket: false,
      };

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
