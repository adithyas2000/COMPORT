import { useParams } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function FavChart() {
    // let {favName}=useParams();
    // console.log("Param:"+favName);


    const data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
    ];



    return (
        <div id='favchart' class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin: '10%', borderRadius: 50 }}>
            <h2>FavCharts</h2>

            <LineChart width={600} height={300} data={data}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="year" />
                <YAxis />
            </LineChart>
        </div>
    )
}
export default FavChart;

