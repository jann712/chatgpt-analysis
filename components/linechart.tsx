import dynamic from "next/dynamic"


export default function FinalizedLineChart() {
    const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}]
    const LineChart = dynamic(() => 
        import('recharts').then((mod) => mod.LineChart), {ssr: false})
    //@ts-ignore
    const Line = dynamic(() =>
        import('recharts').then((mod) => mod.Line), {ssr: false})
    return (
        <LineChart data={data} width={400} height={400}>
            <Line type={"monotone"} dataKey={"uv"} stroke='#8884d8'/>
        </LineChart>
    )
}