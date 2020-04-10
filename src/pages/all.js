import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'
import { Col, Row, Form } from 'react-bootstrap'
import { capfirst } from 'journalize'

import getCVData from "../utils/getcvdata"
import countKeys from "../utils/countkeys"
import stripYear from "../utils/stripyear"
import VizContext from "../context/vizcontext"
import Layout from "../components/layout"
import SEO from "../components/seo"
import MixedBarChart from "../components/mixedbarchart"
import ActivePieChart from "../components/activepiechart"
import TooltipWrapperStyle from "../components/tooltipwrapperstyle"
import CVTooltip from "../components/cvtooltip"


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

const getHistoricalData = (data) => {
  const dataCV = countKeys(
    getCVData(
        data.cases_cv_filtered,
        data.cases_cv_a_filtered,
        data.cases_cv_b_filtered
      ),
    'death_date',
    false
  )
  var data2020 = countKeys(data.cases_2020_filtered, 'death_date', false)

  const dataHistorical_days = countKeys(data.cases_historical_filtered, 'death_date', true)
  const dataHistorical_dates = countKeys(data.cases_historical_filtered, 'death_date', false)
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

const getRaceData = (data) => {
  var keys

  keys = data.map(function(value, index) {
    if (value.latino) {
      return 'Latinx'
    } else if (value.race == null) {
      return 'Unknown'
    } else {
      return value['race']
    }
  })

  var counts = {}

  keys.forEach(function(key, index) {
      if (key in counts) {
          counts[key] += 1;
      } else {
          counts[key] = 1;
      }
  })

  return objectToArray(counts)
}

const getGenderData = (data) => {
  var keys

  keys = data.map(function(value, index) {
    if (value.gender == null) {
      return 'Unknown'
    } else {
      return value['gender']
    }
  })

  var counts = {}

  keys.forEach(function(key, index) {
      if (key in counts) {
          counts[key] += 1;
      } else {
          counts[key] = 1;
      }
  })

  return objectToArray(counts)
}

const objectToArray = (obj) => {
  return Object.entries(obj).map(
    obj => {
      return {
        name: obj[0],
        value: obj[1]
      }
    }
  )
}

const attemptLower = (string) => {
    if (string) {
      return string.toLowerCase()
    } else {
      return ''
    }
}

const filterData = (data, city) => {
  if (city === 'Cook County') {
    data.cases_cv_filtered = data.cases_cv.nodes
    data.cases_cv_a_filtered = data.cases_cv_a.nodes
    data.cases_cv_b_filtered = data.cases_cv_b.nodes
    data.cases_2020_filtered = data.cases_2020.nodes
    data.cases_historical_filtered = data.cases_historical.nodes
  } else {
    data.cases_cv_filtered = data.cases_cv.nodes.filter(d => attemptLower(d.residence_city) === city)
    data.cases_cv_a_filtered = data.cases_cv_a.nodes.filter(d => attemptLower(d.residence_city) === city)
    data.cases_cv_b_filtered = data.cases_cv_b.nodes.filter(d => attemptLower(d.residence_city) === city)
    data.cases_2020_filtered = data.cases_2020.nodes.filter(d => attemptLower(d.residence_city) === city)
    data.cases_historical_filtered = data.cases_historical.nodes.filter(d => attemptLower(d.residence_city) === city)
  }
}

const HistoricalTooltip = ({ active, payload, label }) => {
  if (active) {
    const cv_deaths = payload[2] ? payload[2]['value'] : 0

    return <TooltipWrapperStyle>
      <h3>{label}</h3>
      <p>
        {payload[1]['dataKey']}: <b>{payload[1]['value'] + cv_deaths}</b> <br />
        <i>{cv_deaths} recorded as COVID-19</i>
      </p>
      <p>
        Historical average: <b>{payload[0]['value']}</b>
      </p>
    </TooltipWrapperStyle>
  }

  return null
}

const DemoTooltip = ({ active, payload, label }) => {
  if (active) {
    return <TooltipWrapperStyle>
      <h3>{payload[0]['payload']['race']}</h3>
      <p>
        <b>{payload[0]['value']}</b> recorded COVID-19 deaths
      </p>
    </TooltipWrapperStyle>
  }

  return null
}

const PageWithContext = (props) => {
  var data = props.data

  filterData(data, props.vizState.location)

  const dataCV = getCVData(
    data.cases_cv_filtered,
    data.cases_cv_a_filtered,
    data.cases_cv_b_filtered
  )

  const dataHistorical = getHistoricalData(data)

  const dataCVRaceArray = getRaceData(dataCV)
  const dataCVGenderArray = getGenderData(dataCV)

  const last_updated = props.data.cases_2020.nodes[props.data.cases_2020.nodes.length - 1].death_date

  return (
    <>
      <Row style={{ marginBottom: '2rem' }}>
        <Col style={{textAlign: "center", margin: "auto"}} xs={12} md={6}>
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1" style={{ width: '300px', margin: '0 auto' }}>
              <Form.Control
                as="select"
                onChange={e => props.vizState.setLocation(e.target.value)}
              >
                <option value="Cook County">All of Cook County</option>
                <option value="chicago">Chicago</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <h3>
            Total deaths <br />attributed to COVID-19:
          </h3>
          <h1 style={{color: "#77b88f"}}>
             {dataCV.length}
          </h1>
          <p><i>Last updated <br />{last_updated}</i></p>
        </Col>
        <Col xs={12} md={6}>
          <MixedBarChart
            data={dataHistorical}
            title={`Deaths attribued to COVID-19 in ${capfirst(props.vizState.location)} by day`}
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
            title={`All reported deaths in ${capfirst(props.vizState.location)} by day`}
            tooltip=<HistoricalTooltip/>
          >
            <Bar dataKey="Average Deaths" fill="#d5c17e"/>
            <Bar dataKey="2020 Deaths" stackId="a" fill="#d5644b"/>
            <Bar dataKey="COVID-19" stackId="a" fill="#934534"/>
          </MixedBarChart>
          <p style={{ fontFamily: "sans-serif", marginTop: '3rem' }}>
            It's possible that deaths from COVID-19 are and will continue to be undercounted, as <a href="https://www.nytimes.com/2020/04/05/us/coronavirus-deaths-undercount.html">the
            New York Times has reported</a>. Note the gap in the chart above between COVID-19 deaths
            and abnormally high daily death rates.
          </p>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <ActivePieChart
            data={dataCVRaceArray}
            title={`Deaths attributed to COVID-19 in ${capfirst(props.vizState.location)} by race`}
            tooltip=<DemoTooltip/>
            colors={['#4c765c', '#77b88f', '#b7f0cc', '#dbdfdc', '#314d3b', '#111a14', '#000000']}
          />
        </Col>
        <Col xs={12} md={6} style={{ marginTop: '2em', marginBottom: '2rem' }}>
          <ActivePieChart
            data={dataCVGenderArray}
            title={`Deaths attributed to COVID-19 in ${capfirst(props.vizState.location)} by gender`}
            tooltip=<DemoTooltip/>
            colors={['#788fb9', '#a8bee7', '#536380']}
          />
        </Col>
      </Row>
    </>
  )
}

const AllDeathsPage = ({data}) => {
  return (
    <Layout>
      <SEO title="" />
      <VizContext.Consumer>
        {vizState => (
          <PageWithContext
            data={data}
            vizState={vizState}
          />
        )}
      </VizContext.Consumer>
    </Layout>
  )
}

export default AllDeathsPage

export const query = graphql`
  query AllQuery {
    cases_cv: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause: {regex: "/.*COVID.*/"}
        },
      ) {
      nodes {
        death_date(formatString: "YYYY-MM-DD")
        race
        latino
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
        residence_city
        latitude
        longitude
      }
    },
    cases_cv_a: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_linea: {regex: "/.*COVID.*/"}
        },
      ) {
      nodes {
        death_date(formatString: "YYYY-MM-DD")
        race
        latino
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
        residence_city
        latitude
        longitude
      }
    },
    cases_cv_b: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_lineb: {regex: "/.*COVID.*/"}
        },
      ) {
      nodes {
        death_date(formatString: "YYYY-MM-DD")
        race
        latino
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
        residence_city
        latitude
        longitude
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
      residence_city
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
      residence_city
      age
      race
      primarycause
      primarycause_linea
      gender
    }
  }
  }
`
