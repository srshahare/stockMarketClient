import React, { useState } from 'react'
import './Home.css'
import { useDispatch, useSelector } from 'react-redux'
import { Segmented, Switch, Select, Button, Radio } from 'antd';

import AreaChart from '../components/AreaChart';
import { bindActionCreators } from 'redux';
import { dataActions } from '../store/actions';

const HomeMobile = ({ isLandscape }: any) => {
    const dispatch = useDispatch()
    const { initSocket } = bindActionCreators(dataActions, dispatch)

    const chartData = useSelector((state: any) => state.data);
    const { tickData, tickDataBank, minuteData, minuteDataBank, client, loading } = chartData

    const [exchange, setExchange] = useState("NIFTY")
    const [chartType, setChartType] = useState("STD")
    const [interval, setInterval] = useState("60")
    const [duration, setDuration] = useState("15");
    const [isMultiAxis, setMultiAxis] = useState(false)
    const [requestType, setRequestType] = useState("GetMinuteData")

    const handleDuration = (e: any) => {
        setDuration(e);
        console.log(e)
        const data = {
            requestType: requestType,
            exchange: exchange,
            duration: e,
            subscribe: true,
        }
        if (client) {
            client.send(JSON.stringify(data));
        }
    }
    const handleChartType = (e: any) => {
        setChartType(e);
    }


    const handleExchange = (e: any) => {
        if (e) {
            setExchange("NIFTY");
        } else {
            setExchange("BANKNIFTY")
        }
        const data = {
            requestType: requestType,
            exchange: e ? "NIFTY" : "BANKNIFTY",
            duration: duration,
            subscribe: true,
        }
        if (client) {
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
        if (client) {
            client.send(JSON.stringify(data));
        }
    }

    const handleRefresh = () => {
        if (client === null) {
            initSocket();
        }
    }

    return (
        <div className='home-mobile-container'>
            <div className='home-mobile-infobox'>

                <div>
                    <div className='flexbox' style={{ marginBottom: 0 }}>
                        <h2>Market Data</h2>
                        <h3>Index: {exchange === "NIFTY" ? "(NIFTY 50)" : "(NIFTY BANK)"}</h3>
                    </div>
                    <div className='option-box'>
                        <p>Select Duration</p>
                        <Segmented
                            value={duration}
                            onChange={handleDuration}
                            block
                            options={["15", "30", "45", "60"]}
                        />
                    </div>
                </div>

            </div>
            <div className='home-mobile-context'>
                {interval === "60" ?
                    <AreaChart data={exchange === "NIFTY" ? minuteData : minuteDataBank} chartType={chartType} multiAxis={isMultiAxis} exchange={exchange} isMobile={true} /> :
                    <AreaChart data={exchange === "NIFTY" ? tickData : tickDataBank} chartType={chartType} multiAxis={isMultiAxis} exchange={exchange} isMobile={true} />
                }
            </div>
            <h3 className='header-text'>Filter</h3>
            <div className='filter-box'>
                <div className='flexbox'>
                    <p className='title'>Exchange</p>
                    <Switch onChange={handleExchange} checked={exchange === "NIFTY"} defaultChecked checkedChildren={<div>N</div>} unCheckedChildren={<div>BN</div>} />
                </div>
                <div className='flexbox'>
                    <p className='title'>Chart Type</p>
                    <Select style={{ width: 150 }}
                        onChange={handleChartType} value={chartType} defaultValue="STD" options={[
                            {
                                value: "STD",
                                label: "Standard Volume"
                            },
                            {
                                value: "PER",
                                label: "Percent Volume"
                            },
                        ]} />
                </div>
                <div className='flexbox'>
                    <p className='title'>Interval</p>
                    <Select style={{ width: 150 }} value={interval} defaultValue="60"
                        onChange={handleInterval}
                        options={[
                            {
                                value: "30",
                                label: "30 Seconds"
                            },
                            {
                                value: "60",
                                label: "1 Minute"
                            },
                        ]} />
                </div>
                <div className='flexbox'>
                    <p className='title'>Multi Axis</p>
                    <Switch onChange={e => setMultiAxis(e)} checked={isMultiAxis} />
                </div>
            </div>
            <div className='refresh'>
                <Button block onClick={handleRefresh} disabled={client !== null} loading={loading} type="primary">Refresh Data</Button>            </div>
        </div>
    )
}

export default HomeMobile