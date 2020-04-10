import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'
import { Col, Row } from 'react-bootstrap'

import getCVData from "../utils/getcvdata"
import countKeys from "../utils/countkeys"
import Layout from "../components/layout"
import SEO from "../components/seo"
import MixedBarChart from "../components/mixedbarchart"
import CVTooltip from "../components/cvtooltip"
import ActivePieChart from "../components/activepiechart"
import CommunityAreaMap from "../components/communityareamap"

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

const getCVDataByDate = (data) => {
  var dataCV = countKeys(data, 'death_date', false)

  dataCV = Object.entries(dataCV).map(
    obj => {
      return {
        'day': obj[0],
        'COVID-19': obj[1]
      }
    }
  )

  return dataCV
}

const IndexPage = ({data}) => {
  const dataCV = getCVData(
    data.cases_cv.nodes,
    data.cases_cv_a.nodes,
    data.cases_cv_b.nodes
  )

  const CVDataByDate = getCVDataByDate(dataCV)
  const dataCVRace = getRaceData(dataCV)
  const dataCVGender = getGenderData(dataCV)

  const last_updated = dataCV[dataCV.length - 1].death_date

  return (
    <Layout>
      <SEO title="Home" />

      <Row style={{ marginBottom: '2rem' }}>
        <Col xs={12} md={8}>
          <CommunityAreaMap
            title={`COVID-19 deaths by Chicago neighborhood`}
            data={dataCV}
            geojson={data.community_areas}
          />
        </Col>
        <Col style={{ margin: "auto"}} xs={12} md={4}>
          <div style={{ textAlign: "center" }}>
            <h4>
              Total deaths <br />attributed to COVID-19 <br />in Chicago:
            </h4>
            <h1 style={{color: "#77b88f"}}>
               {dataCV.length}
            </h1>
            <p><i>Last updated <br />{last_updated}</i></p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col style={{ marginTop: '2em', marginBottom: '2rem' }}>
          <MixedBarChart
            data={CVDataByDate}
            title={`COVID-19 deaths in Chicago by day`}
            tooltip=<CVTooltip/>
          >
            <Bar dataKey="COVID-19" stackId="a" fill="#d5644b"/>
          </MixedBarChart>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} style={{ marginTop: '2em', marginBottom: '2rem' }}>
          <ActivePieChart
            data={dataCVRace}
            title={`COVID-19 deaths in Chicago by race`}
            colors={['#4c765c', '#77b88f', '#b7f0cc', '#dbdfdc', '#314d3b', '#111a14', '#000000']}
          />
        </Col>
        <Col xs={12} md={6} style={{ marginTop: '2em', marginBottom: '2rem' }}>
          <ActivePieChart
            data={dataCVGender}
            title={`COVID-19 deaths in Chicago by gender`}
            colors={['#788fb9', '#a8bee7', '#536380']}
          />
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
          residence_city: {regex: "/(CHICAGO|Chicago)/"}
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
        latitude
        longitude
      }
    },
    cases_cv_a: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_linea: {regex: "/.*COVID.*/"}
          residence_city: {regex: "/(CHICAGO|Chicago)/"}
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
        latitude
        longitude
      }
    },
    cases_cv_b: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_lineb: {regex: "/.*COVID.*/"}
          residence_city: {regex: "/(CHICAGO|Chicago)/"}
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
        latitude
        longitude
      }
    },
    community_areas:allGeoJson(limit: 10) {
      nodes {
        features {
          type
          properties {
            community
          }
          geometry {
            coordinates
            type
          }
        }
      }
    }
  }
`
