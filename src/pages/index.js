import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'
import { Col, Row, Form } from 'react-bootstrap'
import styled from 'styled-components'
import { capfirst } from 'journalize'

import VizContext from "../context/vizcontext"
import Layout from "../components/layout"
import SEO from "../components/seo"
import MixedBarChart from "../components/mixedbarchart"
import ActivePieChart from "../components/activepiechart"
import ZipMap from "../components/zipmap"

// import geojson from "../src/data/crimes_by_district.geojson"

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
  const dataCVCombined = data.cases_cv_filtered.concat(
    data.cases_cv_a_filtered
  ).concat(
    data.cases_cv_b_filtered
  )

  return dataCVCombined
}

const getHistoricalData = (data) => {
  const dataCV = countKeys(getCVData(data), 'death_date', false)
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

const DemoTooltip = ({ active, payload, label }) => {
  if (active) {
    return <TooltipWrapper>
      <h3>{payload[0]['payload']['race']}</h3>
      <p>
        <b>{payload[0]['value']}</b> recorded COVID-19 deaths
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

const IndexPageWithContext = (props) => {
  var data = props.data

  filterData(data, props.vizState.location)

  const dataHistorical = getHistoricalData(data)
  const dataCV = getCVData(data)

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

      <Row style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <Col xs={12} md={6}>
          <ActivePieChart
            data={dataCVRaceArray}
            title={`Deaths attributed to COVID-19 in ${capfirst(props.vizState.location)} by race`}
            tooltip=<DemoTooltip/>
            colors={['#4c765c', '#77b88f', '#8bd7a7', '#b7f0cc', '#314d3b']}
          />
          <p style={{ fontFamily: "sans-serif", marginTop: '3rem' }}>
            Take this race data with a grain of salt. As noted by <a href="https://twitter.com/matt_kiefer/status/1246280125290864640">Matt Kiefer</a> and <a href="https://www.dnainfo.com/chicago/20150826/pilsen/cook-county-morgue-calls-latinos-white-making-data-on-gun-violence-flawed/">Joe Ward</a>,
            the Cook County Medical Examiner records Latino people as White.
          </p>
        </Col>
        <Col xs={12} md={6}>
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

const IndexPage = ({data}) => {
  filterData(data, 'chicago')

  const dataCV = getCVData(data)
  const dataZip = countKeys(dataCV, 'residence_zip', false)

  return (
    <Layout>
      <SEO title="Home" />
      <VizContext.Consumer>
        {vizState => (
          <IndexPageWithContext
            data={data}
            vizState={vizState}
          />
        )}
      </VizContext.Consumer>
      <hr />
      <ZipMap
        title={`Deaths attributed to COVID-19 in Chicago by zip code`}
        data={dataZip}
      />
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
        residence_city
        age
        race
        latino
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
        residence_zip
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
        residence_city
        age
        race
        latino
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
        residence_zip
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
        residence_city
        age
        race
        latino
        primarycause
        primarycause_linea
        primarycause_lineb
        gender
        residence_zip
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
