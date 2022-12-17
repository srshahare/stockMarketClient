import React, { useEffect, useState } from 'react'
import { bindActionCreators } from "redux";
import { dataActions } from "../store/actions";
import { useDispatch, useSelector } from 'react-redux'
import Home from './Home';
import HomeMobile from './HomeMobile';

const Layout = () => {
    const dispatch = useDispatch()
    const { initSocket } = bindActionCreators(dataActions, dispatch)

    const chartData = useSelector((state: any) => state.data);
    const { callDone, client } = chartData

    const [isMobileView, setMobileView] = useState(false)
    const [isLandscape, setLandscape] = useState(false);
    const [currentData, setCurrentData] = useState({
        requestType: "GetMinuteData",
        exchange: "NIFTY",
        duration: "15",
        subscribe: true,
    })


    useEffect(() => {
        window.addEventListener("orientationchange", function () {
            const orientation = window.screen.orientation.type
            if (orientation === "landscape-primary") {
                console.log("Landscape Primary!");
                setLandscape(true)
            } else if (orientation === "landscape-secondary") {
                console.log("Landscape Secondary!");
                setLandscape(true)
            } else {
                console.log("Portrait")
                setLandscape(false)
            }
        }, false);


        const maxMobileWidth = 900;
        const width = window.screen.width;
        if (width <= maxMobileWidth) {
            setMobileView(true)
            console.log("Mobile View!")
        } else {
            setMobileView(false)
            console.log("Desktop View!")
        }
        window.addEventListener("resize", function () {
            const width = window.screen.width;
            if (width <= maxMobileWidth) {
                setMobileView(true)
                console.log("Mobile View!")
            } else {
                setMobileView(false)
                console.log("Desktop View!")
            }
        }, false)


    }, [])

    useEffect(() => {
        if (!callDone) {
            initSocket(currentData)
        }
    }, [callDone]);


    return (
        <div>
            {isMobileView ?
                <HomeMobile setCurrentData={setCurrentData} currentData={currentData} isLandscape={isLandscape} /> :
                <Home setCurrentData={setCurrentData} currentData={currentData} />
            }
        </div>
    )
}

export default Layout