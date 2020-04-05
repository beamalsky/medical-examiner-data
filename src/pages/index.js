import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'
import { Col, Row } from 'react-bootstrap'
import styled from 'styled-components'

import Layout from "../components/layout"
import SEO from "../components/seo"
import MixedBarChart from "../components/mixedbarchart"
import CustomPieChart from "../components/custompiechart"

const countKeys = (data, groupKey, strip) => {
  var keys

  if (strip) {
    keys = data.map(function(value, index) {return stripYear(value[groupKey])})
  } else {
    keys = data.map(function(value, index) {return value[groupKey]})
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

  return dataCVCombined
}

const getHistoricalData = (data) => {
  const dataCV = countKeys(getCVData(data), 'death_date', false)
  var data2020 = countKeys(data.cases_2020.nodes, 'death_date', false)

  const dataHistorical_days = countKeys(data.cases_historical.nodes, 'death_date', true)
  const dataHistorical_dates = countKeys(data.cases_historical.nodes, 'death_date', false)
  const dataHistorical_frequency = countDays(dataHistorical_dates)

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
  // data2020.pop()

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

const HistoricalTooltip = ({ active, payload, label }) => {
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

const CVTooltip = ({ active, payload, label }) => {
  if (active) {
    const cv_deaths = payload[0] ? payload[0]['value'] : 0

    return <TooltipWrapper>
      <h3>{label}</h3>
      <p>
        <b>{cv_deaths}</b> recorded COVID-19 deaths
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

const IndexPage = ({data}) => {
  const dataHistorical = getHistoricalData(data)
  const dataCV = getCVData(data)

  const dataCVRace = countKeys(dataCV, 'race', false)
  const dataCVRaceArray = Object.entries(dataCVRace).map(
    obj => {
      return {
        race: obj[0],
        value: obj[1]
      }
    }
  )

  const dataCVGender = countKeys(dataCV, 'gender', false)
  const dataCVGenderArray = Object.entries(dataCVGender).map(
    obj => {
      return {
        race: obj[0],
        value: obj[1]
      }
    }
  )

  const last_updated = data.cases_2020.nodes[data.cases_2020.nodes.length - 1].death_date
  console.log(last_updated)

  return (
    <Layout>
      <SEO title="Home" />

      <Row>
        <Col style={{textAlign: "center", margin: "auto"}}>
          <h3>
            Total deaths <br />attributed to COVID-19:
          </h3>
          <h1 style={{color: "#77b88f"}}>
             {dataCV.length}
          </h1>
          <p><i>Last updated <br />{last_updated}</i></p>
        </Col>
        <Col>
          <MixedBarChart
            data={dataHistorical}
            title="Deaths attributed to COVID-19 by day"
            tooltip=<CVTooltip/>
          >
            <Bar dataKey="COVID-19" stackId="a" fill="#934534"/>
          </MixedBarChart>
        </Col>
      </Row>

      <Row>
        <Col>
          <MixedBarChart
            data={dataHistorical}
            title="All reported deaths by day"
            tooltip=<HistoricalTooltip/>
          >
            <Bar dataKey="Average Deaths" fill="#d5c17e"/>
            <Bar dataKey="2020 Deaths" stackId="a" fill="#d5644b"/>
            <Bar dataKey="COVID-19" stackId="a" fill="#934534"/>
          </MixedBarChart>
        </Col>
      </Row>

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
