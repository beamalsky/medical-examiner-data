import React, { PureComponent } from 'react';
import styled from 'styled-components'
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    const cv_deaths = payload[2] ? payload[2]['value'] : 0

    return <TooltipWrapper>
      <h3>{label}</h3>
      <p>
        {payload[1]['dataKey']}: <b>{payload[1]['value'] + cv_deaths}</b> <br />
        <i>{cv_deaths} recorded as COVID-19</i>
      </p>
      <p>
        Historical average: <b>{payload[0]['value']}</b>
      </p>
    </TooltipWrapper>
  }

  return null
}

const TooltipWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px dotted #999;
  padding: 5px;
  font-size: .7rem;
  p, h3 { margin: 0; }
  h3 {
      font-size: 1rem;
      font-weight: bold;
  }
`

const MixedBarChart = (props) => {
  return (
    <div style={{ width: '100%', height: 300, margin: '0 1rem 2rem 0rem' }}>
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
          <Tooltip content={<CustomTooltip/>} />
          <Legend/>
            {props.children}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MixedBarChart
