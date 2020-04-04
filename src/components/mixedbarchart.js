import React, { PureComponent } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const countKeys = (data, id, value) => {
  var keys = data.map(function(value, index) {return value['death_date']})
  var counts = {}

  keys.forEach(function(key, index) {
      if (key in counts) {
          counts[key] += 1;
      } else {
          counts[key] = 1;
      }
  })

  var result = Object.entries(counts).map(
    obj => {
      return {
        [id]: stripYear(obj[0]),
        [value]: obj[1]
      }
    }
  )

  return result

}

const countKeysPartial = (data, id, value) => {
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
  var data2020 = countKeys(props.data.cases_2020.nodes, "day", "cases")
  var dataCV = countKeysPartial(props.data.cases_cv.nodes, "day", "cases")
  var data2019 = countKeysPartial(props.data.cases_2019.nodes, "day", "cases")

  var finalData = {}

  Object.entries(data2020).forEach(function (value) {
    var day = value[1]['day']

    finalData[value[0]] = {
      'day': day,
      '2020 Deaths': value[1]['cases'] - (dataCV[day] || 0),
      'COVID-19 Deaths': dataCV[day],
      '2019 Deaths': data2019[day]
    }

  })

  const finalDataArray = Object.keys(finalData).map(i => finalData[i])

  return (
    <div style={{ width: '100%', height: 300, margin: '0 1rem 0rem -1rem' }}>
      <ResponsiveContainer>
        <BarChart
          width={700}
          height={600}
          data={finalDataArray}
          margin={{
            top: 20, right: 0, left: 0, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="2019 Deaths" fill="#d5c17e" />
          <Bar dataKey="2020 Deaths" stackId="a" fill="#d5644b" />
          <Bar dataKey="COVID-19 Deaths" stackId="a" fill="#934534" width='10px' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MixedBarChart
