import { useEffect, useState } from "react";
import AreaChart from "../components/AreaChart";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { dataActions } from "../store/actions";
import {
  AreaChartOutlined,
  ClockCircleOutlined,
  RetweetOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Switch, Select, Button } from "antd";
import CandleStickChart from "../components/CandlStickChart";
import DualLineChart from "../components/DualLineChart";
const { Content, Sider } = Layout;

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}

const items = [
  getItem("Exchange", "sub1", <AreaChartOutlined />, [
    getItem("NIFTY", "NIFTY"),
    getItem("BANKNIFTY", "BANKNIFTY"),
  ]),
];
const items1 = [
  getItem("Chart Type", "sub2", <RetweetOutlined />, [
    getItem("Candle Stick", "CDL"),
    getItem("Standard Volume", "STD"),
    getItem("Percent Volume", "PER"),
  ]),
];

const Home = ({ currentData, setCurrentData }) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const { initSocket } = bindActionCreators(dataActions, dispatch);

  const [exchange, setExchange] = useState("NIFTY");
  const [chartType, setChartType] = useState("STD");
  const [interval, setInterval] = useState("60");
  const [duration, setDuration] = useState("15");
  const [isMultiAxis, setMultiAxis] = useState(false);
  const [isDualLine, setDualLine] = useState(false);
  const [requestType, setRequestType] = useState("GetMinuteData");

  const chartData = useSelector((state) => state.data);
  const {
    tickData,
    tickDataBank,
    minuteData,
    minuteDataBank,
    indexMinData,
    indexMinBankData,
    client,
    loading,
    currentMinTime,
    currentTickTime,
  } = chartData;

  const onClick = (e) => {
    const key = e.key;
    if (key === "NIFTY" || key === "BANKNIFTY") {
      setExchange(key);
      const data = {
        requestType: requestType,
        exchange: key,
        duration: duration,
        subscribe: true,
      };
      setCurrentData(data);
      if (client) {
        client.send(JSON.stringify(data));
      }
    } else if (key === "CDL") {
      setRequestType("GetIndexData");
      setDualLine(false)
      setChartType(key);
      const data = {
        requestType: "GetIndexData",
        exchange: exchange,
        duration: duration,
        subscribe: true,
      };
      if (client) {
        client.send(JSON.stringify(data));
      }
    } else {
      setChartType(key);
      setRequestType("GetMinuteData");
      const data = {
        requestType: "GetMinuteData",
        exchange: exchange,
        duration: duration,
        subscribe: true,
      };
      if (client) {
        client.send(JSON.stringify(data));
      }
    }
  };

  const handleDuration = (e) => {
    setDuration(e);
    const data = {
      requestType: requestType,
      exchange: exchange,
      duration: e,
      subscribe: true,
    };
    setCurrentData(data);
    if (client) {
      client.send(JSON.stringify(data));
    }
  };
  const handleInterval = (e) => {
    setInterval(e);
    let request;
    if (e === "30") {
      request = "GetTickData";
      setRequestType("GetTickData");
    } else {
      request = "GetMinuteData";
      setRequestType("GetMinuteData");
    }
    const data = {
      requestType: request,
      exchange: exchange,
      duration: duration,
      subscribe: true,
    };
    setCurrentData(data);
    if (client) {
      client.send(JSON.stringify(data));
    }
  };

  const handleRefresh = () => {
    if (client === null) {
      initSocket(currentData);
    }
  };

  const handleDualLine = (e) => {
    setDualLine(e)
    if(e) {
      setRequestType("GetBothData");
      const data = {
        requestType: "GetBothData",
        exchange: "Both",
        duration: duration,
        subscribe: true,
      };
      if (client) {
        client.send(JSON.stringify(data));
      }
    }else {
      setRequestType("GetMinuteData")
      const data = {
        requestType: "GetMinuteData",
        exchange: exchange,
        duration: duration,
        subscribe: true,
      };
      if (client) {
        client.send(JSON.stringify(data));
      }
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content style={{ margin: "0 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {/* <TestChart /> */}
            {/* <AdvancedRealTimeChart height={600} theme="light" autosize></AdvancedRealTimeChart> */}
            {interval === "60" ? (
              <>
                {chartType === "CDL" ? (
                  <CandleStickChart
                    candleData={
                      exchange === "NIFTY" ? indexMinData : indexMinBankData
                    }
                    exchange={exchange}
                    isLandscape={false}
                    isMobile={false}
                  />
                ) : (
                  <>
                    {isDualLine ? (
                      <DualLineChart
                        data={minuteData}
                        bankData={minuteDataBank}
                        exchange={exchange}
                        isMobile={false}
                        isLandscape={false}
                        multiAxis={isMultiAxis}
                      />
                    ) : (
                      <AreaChart
                        data={
                          exchange === "NIFTY" ? minuteData : minuteDataBank
                        }
                        chartType={chartType}
                        multiAxis={isMultiAxis}
                        singleLine={isDualLine}
                        exchange={exchange}
                        isMobile={false}
                        isLandscape={false}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <AreaChart
                data={exchange === "NIFTY" ? tickData : tickDataBank}
                chartType={chartType}
                multiAxis={isMultiAxis}
                exchange={exchange}
                singleLine={isDualLine}
                isMobile={false}
                isLandscape={false}
              />
            )}
            {/* <RenderChart/> */}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Market Data (NIFTY/BANKNIFTY)</Footer> */}
      </Layout>
      <Sider
        width={350}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">M</div>

        <Menu
          onClick={onClick}
          theme="dark"
          disabled={isDualLine}
          defaultSelectedKeys={["NIFTY"]}
          mode="inline"
          items={items}
        />

        <Menu
          onClick={onClick}
          theme="dark"
          disabled={isDualLine}
          defaultSelectedKeys={["STD"]}
          mode="inline"
          items={items1}
        />

        <Menu
          defaultOpenKeys={["Filter", "Action"]}
          title="Filter"
          theme="dark"
          mode="inline"
        >
          <Menu.SubMenu key="Filter" title="Filter" icon={<FilterOutlined />}>
            <div className="layout-filter-container">
              <div className="flex mb2">
                <h4 style={{ margin: 0, marginRight: "8px" }}>
                  Multi Axis Chart
                </h4>
                <Switch
                  checked={isMultiAxis}
                  onChange={(e) => setMultiAxis(e)}
                  disabled={chartType === "CDL"}
                  title="Multi Axis Chart"
                />
              </div>
              <div className="flex mb2">
                <h4 style={{ margin: 0, marginRight: "8px" }}>
                  Dual Line Chart
                </h4>
                <Switch
                  disabled={chartType === "CDL"}
                  checked={isDualLine}
                  onChange={handleDualLine}
                  title="Dual Line Chart"
                />
              </div>
              <div className="mb2">
                <h4 className="mb2">Interval</h4>
                <Select
                  defaultValue="60"
                  onChange={handleInterval}
                  style={{ width: "100%" }}
                  options={[
                    {
                      value: "30",
                      label: "30 Sec",
                      // disabled: true
                    },
                    {
                      value: "60",
                      label: "1 Min",
                    },
                  ]}
                />
              </div>
              <div className="mb2">
                <h4 className="mb2">Duration</h4>
                <Select
                  defaultValue="15"
                  onChange={handleDuration}
                  style={{ width: "100%" }}
                  options={[
                    {
                      value: "15",
                      label: "15 Min",
                    },
                    {
                      value: "30",
                      label: "30 Min",
                    },
                    {
                      value: "45",
                      label: "45 Min",
                    },
                    {
                      value: "60",
                      label: "60 Min",
                    },
                  ]}
                />
              </div>
            </div>
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Action"
            key="Action"
            icon={<ClockCircleOutlined />}
          >
            <div className="layout-filter-container mb2 center">
              <h3 className="mb2">
                INDEX: {exchange === "NIFTY" ? "NIFTY 50" : "NIFTY BANK"}
              </h3>
              <Button
                onClick={handleRefresh}
                disabled={client !== null || loading}
                loading={loading}
                type="primary"
              >
                Refresh Data
              </Button>
            </div>
          </Menu.SubMenu>
        </Menu>

        <h3 className="time">
          {" "}
          {collapsed ? "" : "Current Time: "}{" "}
          {interval === "60" ? currentMinTime : currentTickTime}
        </h3>
      </Sider>
    </Layout>
  );
};

export default Home;
