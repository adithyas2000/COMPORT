import { useSearchParams } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip } from 'recharts';
import axios from "axios";
import env from 'react-dotenv';
import { useEffect, useState } from "react";

function FavChart() {
    var dataFound = false;
    const [chartData, setChartData] = useState(null);
    const [state, setstate] = useState(false);
    // var state = false;
    var chartitem = window.sessionStorage.getItem("chartitem");

    const lhost = env.LOCALHOST;
    // var data = [
    //     { year: 2010, count: 10 },
    //     { year: 2011, count: 20 },
    //     { year: 2012, count: 15 },
    //     { year: 2013, count: 25 },
    //     { year: 2014, count: 22 },
    //     { year: 2015, count: 30 },
    //     { year: 2016, count: 28 },
    // ];
    if (chartData == null) {
        axios.get(lhost + "getwatchitem/?prodname=" + encodeURIComponent(chartitem), { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
            .then(res => {
                console.log(res.data["Chartdata"]);
                console.log("Chartdata state");
                console.log(chartData);
                // data = res.data["Chartdata"]
                setChartData(res.data["Chartdata"]);
            })
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        if (chartData != null) {
            setstate(true);
        }

        console.log("State:" + state);
    }, [chartData])

    useEffect(() => {
        console.log("Re Rendering");
    })



    if ((chartitem != null) && (chartitem != "")) {
        console.log("CHartitem:" + chartitem);
        console.log("Chart data:....: " + chartData)
        console.log("State - " + state);
        return (
            <div>
                {!state && <h1>No item</h1>}
                {state && <Chart dataDict={chartData} title={chartitem}/>}
            </div>
        )
    } else {
        console.log("CHartitem:" + chartitem);
        return (
            <div class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin: '10%', borderRadius: 50 }}>
                <h1>No item</h1>
            </div>
        )
    }

}
export default FavChart;

const Chart = ({ dataDict,title }) => {
    // console.log("data dict:");
    // console.log(dataDict);
    // const [chartData, setchartdata] = useState(null);
    // var data = null;
    // useEffect(() => {
    //     console.log("First render");
    //     data = getData();
    //     console.log(data);
    //     settestname("LOL");
    // }, ["CONST"])
    // useEffect(() => {
    //     console.log("Char data Useeffect");
    //     console.log(chartData);
    //     settestname("WTH");
    // }, [chartData])

    // if(dataDict!=null){
    //     setchartdata(dataDict);
    //     console.log("Chartdata in component : "+chartData);
    // }
    var data = [
        { date: 2010, price: 10 },
        { date: 2011, price: 20 },
        { date: 2012, price: 15 },
        { date: 2013, price: 25 },
        { date: 2014, price: 22 },
        { date: 2015, price: 30 },
        { date: 2016, price: 28 },
    ];
    // if (chartData == null) {
    //     data = getData();
    //     console.log("Data after getdata" + data);
    //     // setchartdata(data);
    //     // settestname("LOL");
    //     console.log("Chartdata in component 1: " + chartData);
    // } else {
    //     console.log("Chartdata in component : " + chartData);
    // }
    // console.warn(dataDict);
    // var chartitem = window.sessionStorage.getItem("chartitem");
    return (
        <div id='favchart' class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin: '10%', borderRadius: 50 }}>
            <h2>{title}</h2><br/>

            <LineChart width={600} height={300} data={dataDict}>
                <Line isAnimationActive={false} type="monotone" dataKey="price" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </div>
    )
}

function getData() {
    var chartitem = window.sessionStorage.getItem("chartitem");
    const lhost = env.LOCALHOST;
    var data = [];
    axios.get(lhost + "getwatchitem/?prodname=" + encodeURIComponent(chartitem), { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
        .then(res => {
            console.log("Res data : " + res.data["Chartdata"]);
            data = res.data["Chartdata"]
            // setChartData(res.data["Chartdata"]);
            console.log("Data returned from getdata");
            console.log(data);
            return data;

        })
        .catch(err => {
            console.error(err);
            return err;
        });
    console.log("After return");
    // return data;
}
