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
      var date = new Date(Date.parse(obj[0]))
      // date parsing is off by one. correct is here
      date.setDate(date.getDate() + 1)
      var date_processed = (date).toLocaleString('default', { month: 'long', day: 'numeric' })
      return {
        'day': date_processed,
        'Reported deaths': obj[1]
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

  const build_time = data.build_time.nodes[0].buildTime
  const build_time_parsed = new Date(Date.parse(build_time))
  const last_updated = build_time_parsed.toLocaleString(
    'default',
    { month: 'long', day: 'numeric', year: 'numeric' }
  )

  return (
    <Layout>
      <SEO title="Home" />

      <Row style={{ marginBottom: '2rem' }}>
        <Col className="main-text-column" xs={12} md={6}>
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
              Chicago is a city of socially knit neighborhoods, not precisely boxed zip codes or uniform experience. In order to understand the public health of our city and to properly advocate for just allocation of care and resources, we must see clearly the way illness appears along lines of disparity. This live tracker of COVID-19 deaths by community area is intended for use as a tool toward those ends.
            </p>
            <hr />
            <h4 style={{ lineHeight: "1.3" }}>
              Total deaths attributed <br />to COVID-19 in Chicago:
            </h4>
            <h1 style={{color: 'white'}}>
              <span style={{backgroundColor: 'black', padding: '7px'}}>
               {dataCV.length}
              </span>
            </h1>
            <p><i>Last updated {last_updated}</i></p>
            <hr />
            <div style={{ margin: "2rem 0" }}>
              <p style={{ textAlign: "justify" }}>
                All data shown is pulled from Cook County Medical Examiner (CCME) records released through the Chicago Data Portal. We check for new death records hourly, though CCME generally releases a daily update early every morning. Neighborhood counts have been calculated from latitudes and longitudes attached to death records. These locations reflect CCME's determination of where the person fell ill. In most cases, it is their home address. CCME also reports that when a person detained at Cook County Jail dies, their location is recorded as the jail's address in Little Village.
              </p>
            </div>
            <hr />
            <div style={{ margin: "4rem 0" }}>
              <ActivePieChart
                data={dataCVRace}
                title={`COVID-19 deaths in Chicago by race`}
                colors={['#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f', '#f1eef6']}
              />
            </div>
            <hr />
            <div style={{ margin: "2rem 0" }}>
              <p style={{ textAlign: "justify" }}>
                Keeping data on race is always complicated, and the pie chart above should be taken with a grain of salt. CCME includes a value for race in most death records, and an additional flag for Latino that can be true or false. For this project, we are including any record where Latino is true exclusively in the Latinx category.
              </p>
            </div>
            <hr />
            <div style={{ margin: "4rem 0" }}>
              <MixedBarChart
                data={CVDataByDate}
                title={`COVID-19 deaths in Chicago by day`}
                tooltip=<CVTooltip/>
              >
                <Bar dataKey="Reported deaths" fill="#d5644b" type="natural" />
              </MixedBarChart>
            </div>
            <hr />
            <div style={{ margin: "2rem 0" }}>
              <p style={{ textAlign: "justify" }}>
                As part of this live tracker we are also keeping records of changes made to CCME data over time in order to create an archive of when death records are created and modified. All code running this site is open source <a href="https://github.com/beamalsky/medical-examiner-data">here</a>.
              </p>
            </div>
          </div>
        </Col>

        <Col xs={12} md={5}>
          <CommunityAreaMap
            title={`Per capita COVID-19 deaths by Chicago neighborhood`}
            data={dataCV}
            geojson={data.community_areas}
            colors={['#FFFFD4', '#C83302']}
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
    build_time:allSiteBuildMetadata {
    nodes {
      buildTime
    }
  }
  }
`
