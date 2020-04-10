import React from 'react';
import {
  AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';


const ShadedAreaChart = (props) => {
  return (
    <div style={{ height: 250, margin: '0 1rem 2rem 0rem' }}>
      <h4>{props.title}</h4>
      <ResponsiveContainer>
        <AreaChart
        width={700}
        height={600}
        data={props.data}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={props.tooltip} />
          {props.children}
      </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ShadedAreaChart
