import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'

import Layout from "../components/layout"
import SEO from "../components/seo"
import MixedBarChart from "../components/mixedbarchart"

const countKeys = (data, strip) => {
  if (strip) {
    var keys = data.map(function(value, index) {return stripYear(value['death_date'])})
  } else {
    var keys = data.map(function(value, index) {return value['death_date']})
  }

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

const countDays = (data) => {
  var keys = Object.entries(data).map(obj => {return stripYear(obj[0])})
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

const getCVData = (data) => {
  const dataCVCombined = data.cases_cv.nodes.concat(
    data.cases_cv_a.nodes
  ).concat(
    data.cases_cv_b.nodes
  )

  return countKeys(dataCVCombined, false)
}

const getHistoricalData = (data) => {
  const dataCV = getCVData(data)
  var data2020 = countKeys(data.cases_2020.nodes, false)

  const dataHistorical_days = countKeys(data.cases_historical.nodes, true)
  const dataHistorical_dates = countKeys(data.cases_historical.nodes, false)
  const dataHistorical_frequency = countDays(dataHistorical_dates)

  console.log(data2020)

  data2020 = Object.entries(data2020).map(
    obj => {
      return {
        date: obj[0],
        day: stripYear(obj[0]),
        cases: obj[1]
      }
    }
  )

  // Take off the current day to avoid reporting partial data
  data2020.pop()

  var mergedData = {}

  Object.entries(data2020).forEach(function (value) {
    var date = value[1]['date'] // YYYY-MM-DD
    var day = value[1]['day'] // MM-DD

    mergedData[value[0]] = {
      'day': day,
      '2020 Deaths': value[1]['cases'] - (dataCV[date] || 0),
      'COVID-19': dataCV[date],
      'Average Deaths': dataHistorical_days[day] / dataHistorical_frequency[day]
    }

  })

  return Object.keys(mergedData).map(i => mergedData[i])

}

const IndexPage = ({data}) => {
  const dataHistorical = getHistoricalData(data)

  return (
    <Layout>
      <SEO title="Home" />
      <MixedBarChart
        data={dataHistorical}
        title="Reported Deaths Over Time"
      >
        <Bar dataKey="Average Deaths" fill="#d5c17e"/>
        <Bar dataKey="2020 Deaths" stackId="a" fill="#d5644b"/>
        <Bar dataKey="COVID-19" stackId="a" fill="#934534"/>
      </MixedBarChart>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query PageQuery {
    cases_cv: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause: {regex: "/.*COVID.*/"}
        },
        sort: {
          fields: death_date,
          order: ASC
        }
      ) {
      nodes {
        id
        death_date(formatString: "YYYY-MM-DD")
        age
        race
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
      }
    },
    cases_cv_a: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_linea: {regex: "/.*COVID.*/"}
        },
        sort: {
          fields: death_date,
          order: ASC
        }
      ) {
      nodes {
        id
        death_date(formatString: "YYYY-MM-DD")
        age
        race
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
      }
    },
    cases_cv_b: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_lineb: {regex: "/.*COVID.*/"}
        },
        sort: {
          fields: death_date,
          order: ASC
        }
      ) {
      nodes {
        id
        death_date(formatString: "YYYY-MM-DD")
        age
        race
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
      }
    },
    cases_2020: allCases(
        filter: {
          death_date: {gte: "2020-03-16"},
        },
        sort: {
          fields: death_date,
          order: ASC
        }
      ) {
      nodes {
        id
        death_date(formatString: "YYYY-MM-DD")
        age
        race
        primarycause
        primarycause_linea
        gender
      }
    },
    cases_historical: allCases(
        filter: {
          death_date: {gte: "2015-03-16", lt: "2020-01-01"}
        },
        sort: {
          fields: death_date,
          order: ASC
        }
      ) {
      nodes {
        id
        death_date(formatString: "YYYY-MM-DD")
        age
        race
        primarycause
        primarycause_linea
        gender
      }
    }
  }
`
