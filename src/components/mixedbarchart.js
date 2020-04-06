import React from 'react';
import {
  ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'


const MixedBarChart = (props) => {
  return (
    <div style={{ height: 250, margin: '0 1rem 2rem 0rem' }}>
      <h4>{props.title}</h4>
      <ResponsiveContainer>
        <BarChart
          width={700}
          height={600}
          data={props.data}
          margin={{
            top: 20, right: 20, left: -5, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={props.tooltip} />
          <Legend/>
            {props.children}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MixedBarChart
