import React from "react"
import { graphql } from "gatsby"
import { Area } from 'recharts'
import { Col, Row } from 'react-bootstrap'

import getCVData from "../utils/getcvdata"
import countKeys from "../utils/countkeys"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ShadedAreaChart from "../components/shadedareachart"
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

  const last_updated_raw = new Date(Date.parse(data.all_cases.nodes[0].death_date))
  const last_updated = last_updated_raw.toLocaleString()

  return (
    <Layout>
      <SEO title="Home" />

      <Row style={{ marginBottom: '2rem' }}>
        <Col style={{ margin: "1rem auto", padding: "0 2rem" }} xs={12} md={7}>
          <div style={{ textAlign: "center" }}>
            <h1>
              COVID-19 Deaths in Chicago’s Neighborhoods
            </h1>
            <h3>
              <i>A Live Tracker</i>
            </h3>
            <p>
              By Bea Malsky
            </p>
            <p style={{ textAlign: "justify" }}>
              Chicago is a city of socially knit neighborhoods, not of precisely boxed off zip codes or uniform experience. In order to understand the public health of our city and to properly advocate for just allocation of care and resources, we must see clearly the way health is allocated along lines of disparity. This live tracker of COVID-19 deaths by community area is intended for use as a tool toward those ends.
            </p>
            <hr />
            <h4>
              Total deaths attributed <br />to COVID-19 in Chicago:
            </h4>
            <h1 style={{color: 'white'}}>
              <span style={{backgroundColor: 'black', padding: '7px'}}>
               {dataCV.length}
              </span>
            </h1>
            <p><i>Last updated {last_updated}</i></p>
            <hr />
            <div style={{ margin: "4rem 0" }}>
              <ActivePieChart
                data={dataCVRace}
                title={`COVID-19 deaths in Chicago by race`}
                colors={['#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f', '#f1eef6']}
              />
            </div>
            <hr />
            <div style={{ margin: "4rem 0" }}>
              <ShadedAreaChart
                data={CVDataByDate}
                title={`COVID-19 deaths in Chicago by day`}
                tooltip=<CVTooltip/>
              >
                <Area dataKey="COVID-19" fill="#d5644b" stroke="#a01f03" type="natural" />
              </ShadedAreaChart>
            </div>
            <hr />
            <div style={{ margin: "2rem 0" }}>
              <p style={{ textAlign: "justify" }}>
                All data shown is from the Cook County Medical Examiner (CCME), which is kept up to date on the Chicago Data Portal. As part of this live tracker, we are keeping records of changes made to CCME data over time in order to create an archive of when death records are created and modified.
              </p>
            </div>
          </div>
        </Col>

        <Col xs={12} md={5}>
          <CommunityAreaMap
            title={`Per capita COVID-19 deaths by Chicago neighborhood`}
            data={dataCV}
            geojson={data.community_areas}
            colors={['#e7d28f', '#a01f03']}
            last_updated={last_updated}
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
        casenumber
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
        casenumber
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
        casenumber
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
    community_areas:allGeoJson {
      nodes {
        features {
          type
          properties {
            community
            population
          }
          geometry {
            coordinates
            type
          }
        }
      }
    },
    all_cases: allCases(
        filter: {
          death_date: {gte: "2020-04-10"}
        },
        sort: {
          fields: death_date,
          order: DESC
        }
      ) {
      nodes {
        death_date
      }
    }
  }
`
