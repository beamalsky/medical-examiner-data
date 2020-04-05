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
      <p>{payload[0]['dataKey']}: <b>{payload[0]['value']}</b></p>
      <p>
        {payload[1]['dataKey']}: <b>{payload[1]['value'] + cv_deaths}</b> <br />
        <i>{cv_deaths} recorded as a COVID-19 death</i>
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

const countKeys = (data) => {
  var keys = data.map(function(value, index) {return stripYear(value['death_date'])})
  var counts = {}

  keys.forEach(function(key, index) {
      if (key in counts) {
          counts[key] += 1;
      } else {
          counts[key] = 1;
      }
  })

  return counts
}

const stripYear = (date) => {
  return date.substr(date.indexOf('-')+1)
}

const MixedBarChart = (props) => {
  var data2020 = countKeys(props.data.cases_2020.nodes)
  var dataCV = countKeys(props.data.cases_cv.nodes)
  var data2019 = countKeys(props.data.cases_2019.nodes)

  var data2020 = Object.entries(data2020).map(
    obj => {
      return {
        day: obj[0],
        cases: obj[1]
      }
    }
  )

  var finalData = {}

  Object.entries(data2020).forEach(function (value) {
    var day = value[1]['day']

    finalData[value[0]] = {
      'day': day,
      '2020 Deaths': value[1]['cases'] - (dataCV[day] || 0),
      'Recorded COVID-19 Deaths': dataCV[day],
      '2019 Deaths': data2019[day]
    }

  })

  finalData = Object.keys(finalData).map(i => finalData[i])

  return (
    <div style={{ width: '100%', height: 300, margin: '0 1rem 2rem 0rem' }}>
      <h4>{props.title}</h4>
      <ResponsiveContainer>
        <BarChart
          width={700}
          height={600}
          data={finalData}
          margin={{
            top: 20, right: 20, left: -5, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>} />
          <Legend/>
          <Bar dataKey="2019 Deaths" fill="#d5c17e"/>
          <Bar dataKey="2020 Deaths" stackId="a" fill="#d5644b"/>
          <Bar dataKey="Recorded COVID-19 Deaths" stackId="a" fill="#934534"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MixedBarChart
