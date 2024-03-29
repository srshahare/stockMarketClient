import React, { useEffect, useState } from 'react'
import './Home.css'
import { useDispatch, useSelector } from 'react-redux'
import { Segmented, Switch, Select, Button, Drawer } from 'antd';

import AreaChart from '../components/AreaChart';
import { bindActionCreators } from 'redux';
import { dataActions } from '../store/actions';
import { MenuOutlined } from '@ant-design/icons';
import CandleStickChart from '../components/CandlStickChart';
import DualLineChart from '../components/DualLineChart';

const HomeMobile = ({ isLandscape, currentData, setCurrentData }: any) => {
    const dispatch = useDispatch()
    const { initSocket } = bindActionCreators(dataActions, dispatch)

    const chartData = useSelector((state: any) => state.data);
    const { tickData, tickDataBank, minuteData, minuteDataBank, indexMinData, indexMinBankData, client, loading, currentMinTime, currentTickTime, callDone } = chartData

    const [exchange, setExchange] = useState("NIFTY")
    const [chartType, setChartType] = useState("PER")
    const [interval, setInterval] = useState("60")
    const [duration, setDuration] = useState("45");
    const [isMultiAxis, setMultiAxis] = useState(false)
    const [isDualLine, setDualLine] = useState(false)
    const [requestType, setRequestType] = useState("GetMinuteData")
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleDuration = (e: any) => {
        setDuration(e);
        console.log(e)
        const data = {
            requestType: requestType,
            exchange: exchange,
            duration: e,
            subscribe: true,
        }
        setCurrentData(data)
        if (client) {
            client.send(JSON.stringify(data));
        }
    }

    const handleChartType = (e: any) => {
        if (e === "CDL") {
            setRequestType("GetIndexData");
            setDualLine(false)
            setChartType(e);
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
            setChartType(e);
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
        setCurrentData(data)
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
        setCurrentData(data)
        if (client) {
            client.send(JSON.stringify(data));
        }
    }

    const handleRefresh = () => {
        if (client === null) {
            initSocket(currentData)
        }
    }

    useEffect(() => {
        initSocket({
            ...currentData,
            duration: "45"
        });
    }, [callDone])

    const handleDualLine = (e: any) => {
        setDualLine(e)
        if (e) {
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
        } else {
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

    const renderMenuBox = (isLandscape: any) => <div>
        <h3 className='header-text'>Filter</h3>
        <div className='filter-box'>
            <div className='flexbox'>
                <p className='title' style={{ fontSize: isLandscape ? "12px" : "18px" }}>Exchange</p>
                <Switch disabled={isDualLine} onChange={handleExchange} checked={exchange === "NIFTY"} defaultChecked checkedChildren={<div>N</div>} unCheckedChildren={<div>BN</div>} />
            </div>
            <div className='flexbox'>
                <p className='title' style={{ fontSize: isLandscape ? "12px" : "18px" }}>Chart Type</p>
                <Select disabled={isDualLine} style={{ width: 150 }}
                    onChange={handleChartType} value={chartType} defaultValue="STD" options={[
                        {
                            value: "CDL",
                            label: "Candle Stick"
                        },
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
                <p className='title' style={{ fontSize: isLandscape ? "12px" : "18px" }}>Interval</p>
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
                <p className='title' style={{ fontSize: isLandscape ? "12px" : "18px" }}>Multi Axis</p>
                <Switch onChange={e => setMultiAxis(e)} checked={isMultiAxis} disabled={chartType === 'CDL'} />
            </div>
            <div className='flexbox'>
                <p className='title' style={{ fontSize: isLandscape ? "12px" : "18px" }}>Dual Line Chart</p>
                <Switch onChange={handleDualLine} checked={isDualLine} disabled={chartType === "CDL"} />
            </div>
        </div>
        <div className='refresh'>
            <Button block onClick={handleRefresh} disabled={client !== null} loading={loading} type="primary">Refresh Data</Button>
        </div>
    </div>

    return (
        <div className={`home-mobile-container ${isLandscape ? "full" : ''}`}>
            <div className={`home-mobile-infobox ${isLandscape ? "bottom" : ""}`}>
                <div>
                    {isLandscape ?
                        <div className='landscape-duration'>

                        </div> :
                        <div className='flexbox' style={{ marginBottom: 0 }}>
                            <h2>Market Data</h2>
                            <h3>Index: {exchange === "NIFTY" ? "(NIFTY 50)" : "(NIFTY BANK)"}</h3>
                        </div>
                    }
                    <div className='option-box'>
                        {isLandscape ?
                            "" :
                            <p>Select Duration</p>
                        }
                        {isLandscape ?
                            <div className='flexcenter'>
                                <h5 className="time-mobile-landscape">Current Time : {interval === "60" ? currentMinTime : currentTickTime}</h5>
                                <Segmented
                                    value={duration}
                                    className="segment"
                                    onChange={handleDuration}
                                    block
                                    options={["15", "30", "45", "60"]}
                                />
                                <div onClick={showDrawer} className='menu'><MenuOutlined /></div>

                            </div> :
                            <div>
                                <Segmented
                                    value={duration}
                                    className="segment"
                                    onChange={handleDuration}
                                    block
                                    options={["15", "30", "45", "60"]}
                                />
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div className='home-mobile-context'>
                {interval === "60" ?
                    <>
                        {chartType === 'CDL' ?
                            <CandleStickChart
                                candleData={
                                    exchange === "NIFTY" ? indexMinData : indexMinBankData
                                }
                                exchange={exchange}
                                isLandscape={isLandscape}
                                isMobile={true}
                            /> :
                            <>
                                {isDualLine ?
                                    <DualLineChart
                                        data={minuteData}
                                        bankData={minuteDataBank}
                                        exchange={exchange}
                                        isMobile={true}
                                        isLandscape={isLandscape}
                                        multiAxis={isMultiAxis}
                                    /> : <AreaChart data={exchange === "NIFTY" ? minuteData : minuteDataBank} chartType={chartType} multiAxis={isMultiAxis} exchange={exchange} isMobile={true} isLandscape={isLandscape} singleLine={isDualLine} />
                                }
                            </>
                        }
                    </>
                    :
                    <AreaChart data={exchange === "NIFTY" ? tickData : tickDataBank} chartType={chartType} multiAxis={isMultiAxis} exchange={exchange} isMobile={true} isLandscape={isLandscape} singleLine={isDualLine} />
                }
            </div>
            {
                !isLandscape &&
                <h3 className="time-mobile">Current Time : {interval === "60" ? currentMinTime : currentTickTime}</h3>
            }
            {isLandscape ?
                <Drawer title="Market Data" placement="right" width={275} onClose={onClose} open={open}>
                    {renderMenuBox(true)}
                </Drawer>
                :
                renderMenuBox(false)
            }
        </div>
    )
}

export default HomeMobile