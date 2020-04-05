import React, { PureComponent } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Legend, Tooltip
} from 'recharts';


const CustomPieChart = (props) => {
  console.log(props.data)
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h4>{props.title}</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={props.data} innerRadius={50} outerRadius={100} fill="#82ca9d" />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomPieChart
