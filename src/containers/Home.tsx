import { useEffect, useState } from "react";
import RightPanel from "../components/RightPanel";
import AreaChart from '../components/AreaChart'
import './Home.css'
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from "redux";
import { dataActions } from "../store/actions";
import TestChart from "../components/TestChart";
import {
    AreaChartOutlined,
    ClockCircleOutlined,
    RetweetOutlined,
    FilterOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Switch, Select, Button } from 'antd';

var W3CWebSocket = require("websocket").w3cwebsocket;
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    onClick?: MenuItem
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        onClick
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Exchange', 'sub1', <AreaChartOutlined />, [
        getItem('NIFTY', 'NIFTY'),
        getItem('BANKNIFTY', 'BANKNIFTY'),
    ])
];
const items1: MenuItem[] = [
    getItem('Chart Type', 'sub2', <RetweetOutlined />, [
        getItem('Standard Volume', 'STD'),
        getItem('Percent Volume', 'PER'),
    ]),
];

const Home = () => {

    const dispatch = useDispatch()
    const [collapsed, setCollapsed] = useState(false);
    const { initSocket } = bindActionCreators(dataActions, dispatch)
    
    const [exchange, setExchange] = useState("NIFTY")
    const [chartType, setChartType] = useState("STD")
    const [interval, setInterval] = useState("60")
    const [duration, setDuration] = useState("15");
    const [isMultiAxis, setMultiAxis] = useState(false)
    const [requestType, setRequestType] = useState("GetMinuteData")

    const chartData = useSelector((state: any) => state.data);
    const { tickData, tickDataBank, minuteData, minuteDataBank, client, loading } = chartData

    const onClick: MenuProps['onClick'] = e => {
        const key = e.key;
        if (key === "NIFTY" || key === "BANKNIFTY") {
            setExchange(key)
            const data = {
                requestType: requestType,
                exchange: key,
                duration: duration,
                subscribe: true,
            }
            if(client) {
                client.send(JSON.stringify(data));
            }
        } else {
            setChartType(key)
        }
    }

    const handleDuration = (e: any) => {
        setDuration(e);
        const data = {
            requestType: requestType,
            exchange: exchange,
            duration: e,
            subscribe: true,
        }
        if(client) {
            client.send(JSON.stringify(data));
        }
    }
    const handleInterval = (e: any) => {
        setInterval(e);
        let request;
        if (e === "30") {
            request = "GetTickData"
            setRequestType("GetTickData")
        } else {
            request = "GetMinuteData"
            setRequestType("GetMinuteData")
        }
        const data = {
            requestType: request,
            exchange: exchange,
            duration: duration,
            subscribe: true,
        }
        if(client) {
            client.send(JSON.stringify(data));
        }
    }

    const handleRefresh = () => {
        if (client === null) {
            initSocket();
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout className="site-layout">
                <Content style={{ margin: '0 0' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        {/* <TestChart /> */}
                        {/* <AdvancedRealTimeChart height={600} theme="light" autosize></AdvancedRealTimeChart> */}
                        {interval === "60" ?
                            <AreaChart data={exchange === "NIFTY" ? minuteData : minuteDataBank} chartType={chartType} multiAxis={isMultiAxis} exchange={exchange} isMobile={false} /> :
                            <AreaChart data={exchange === "NIFTY" ? tickData : tickDataBank} chartType={chartType} multiAxis={isMultiAxis} exchange={exchange} isMobile={false} />
                        }
                        {/* <RenderChart/> */}
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: 'center' }}>Market Data (NIFTY/BANKNIFTY)</Footer> */}
            </Layout>
            <Sider width={350} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="logo">M</div>

                <Menu onClick={onClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />

                <Menu onClick={onClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items1} />

                <Menu defaultOpenKeys={["Filter", "Action"]} title="Filter" theme="dark" mode="inline" >
                    <Menu.SubMenu key="Filter" title="Filter" icon={<FilterOutlined />} >
                        <div className="layout-filter-container">
                            <div className="flex mb2">
                                <h4 style={{ margin: 0, marginRight: "8px" }} >Multi Axis Chart</h4>
                                <Switch checked={isMultiAxis} onChange={e => setMultiAxis(e)} title="Multi Axis Chart" />
                            </div>
                            <div className="mb2">
                                <h4 className="mb2">Interval</h4>
                                <Select
                                    defaultValue="60"
                                    onChange={handleInterval}
                                    style={{ width: "100%" }}
                                    options={[
                                        {
                                            value: '30',
                                            label: '30 Sec',
                                            // disabled: true
                                        },
                                        {
                                            value: '60',
                                            label: '1 Min',
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
                                            value: '15',
                                            label: '15 Min',
                                        },
                                        {
                                            value: '30',
                                            label: '30 Min',
                                        },
                                        {
                                            value: '45',
                                            label: '45 Min',
                                        },
                                        {
                                            value: '60',
                                            label: '60 Min',
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </Menu.SubMenu>
                    <Menu.SubMenu title="Action" key="Action" icon={<ClockCircleOutlined />} >
                        <div className="layout-filter-container mb2 center">
                            <h3 className="mb2">INDEX: {exchange === "NIFTY" ? "NIFTY 50" : "NIFTY BANK"}</h3>
                            <Button onClick={handleRefresh} disabled={client !== null} loading={loading} type="primary">Refresh Data</Button>
                        </div>
                    </Menu.SubMenu>
                </Menu>



                <h3 className="time"> {collapsed ? "" : "Current Time: "} 12:33 PM</h3>
            </Sider>
        </Layout>
    )
}

export default Home