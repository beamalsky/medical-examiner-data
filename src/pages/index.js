import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'
import { Col, Row } from 'react-bootstrap'

import getCVData from "../utils/getcvdata"
import getRaceData from "../utils/getracedata"
import getCVDataByDate from "../utils/getcvdatabydate"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import Layout from "../components/layout"
import SEO from "../components/seo"
import MixedBarChart from "../components/mixedbarchart"
import CVTooltip from "../components/cvtooltip"
import ActivePieChart from "../components/activepiechart"
import CommunityAreaMap from "../components/communityareamap"


const IndexPage = ({data}) => {
  const dataCV = getCVData(
    data.cases_cv.nodes,
    data.cases_cv_a.nodes,
    data.cases_cv_b.nodes
  )

  const CVDataByDate = getCVDataByDate(dataCV)
  const dataCVRace = getRaceData(dataCV)
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)

  return (
    <Layout>
      <SEO />

      <Row style={{ marginBottom: '2rem' }}>
        <Col className="main-text-column" xs={12} md={6}>
          <div style={{ textAlign: "center" }}>
            <h1>
              COVID-19 Deaths in Chicago’s Neighborhoods
            </h1>
            <h3 className="dek">
              A Live Tracker
            </h3>
            <p className="byline">
              By Bea Malsky
            </p>
            <p style={{ textAlign: "justify" }} className="narrow">
              Chicago is a city of socially knit neighborhoods, not precisely boxed zip codes or uniform experience. In order to understand the public health of our city and to properly advocate for just allocation of care and resources, we must see clearly the way illness appears along lines of disparity. This live tracker of COVID-19 deaths by community area is intended for use as a tool toward those ends.
            </p>
            <hr className="narrow" />
            <h4 style={{ lineHeight: "1.3" }}>
              Total deaths attributed <br />to COVID-19 in Chicago:
            </h4>
            <h1 style={{color: 'white', fontFamily: 'sans-serif' }}>
              <span style={{backgroundColor: 'black', padding: '7px'}}>
               {dataCV.length}
              </span>
            </h1>
            <p><i>Last updated {last_updated}</i></p>
            <hr className="narrow" />
            <div style={{ margin: "2rem 0" }}>
              <p style={{ textAlign: "justify" }} className="narrow">
                All data shown is pulled from Cook County Medical Examiner (CCME) records released through the Cook County Data Portal. We check for new death records hourly, though CCME generally releases a daily update early every morning. Neighborhood counts have been calculated from latitudes and longitudes attached to death records. These locations reflect CCME's determination of where the person fell ill. In most cases, it is their home address. CCME also reports that when a person detained at Cook County Jail dies, their location is recorded as the jail's address in Little Village.
              </p>
            </div>
            <hr className="narrow" />
            <div style={{ margin: "4rem 0" }}>
              <ActivePieChart
                data={dataCVRace}
                title={`COVID-19 deaths in Chicago by race`}
                colors={['#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f', '#f1eef6']}
                hide_title={false}
              />
            </div>
            <hr className="narrow" />
            <div style={{ margin: "2rem 0" }}>
              <p style={{ textAlign: "justify" }} className="narrow">
                Keeping data on race is always complicated, and the pie chart above should be taken with a grain of salt. CCME includes a value for race in most death records, and an additional flag for Latino that can be true or false. For this project, we are including any record where Latino is true exclusively in the Latinx category.
              </p>
            </div>
            <hr className="narrow" />
            <div style={{ margin: "4rem 0" }}>
              <MixedBarChart
                data={CVDataByDate}
                title={`COVID-19 deaths in Chicago by day`}
                tooltip=<CVTooltip/>
                hide_title={false}
              >
                <Bar dataKey="Reported deaths" fill="#cd4624" type="natural" />
              </MixedBarChart>
            </div>
            <hr className="narrow" />
            <div style={{ margin: "2rem 0 1rem 0" }}>
              <p style={{ textAlign: "justify" }} className="narrow" >
                As part of this live tracker we are also keeping records of changes made to CCME data over time in order to create an archive of when death records are created and modified. All code running this site is open source <a href="https://github.com/beamalsky/medical-examiner-data">here</a>.
              </p>
            </div>
            <div className="break">✶ ✶ ✶ ✶</div>
          </div>
        </Col>

        <Col xs={12} md={5}>
          <CommunityAreaMap
            title={`Per capita COVID-19 deaths by Chicago neighborhood`}
            data={dataCV}
            geojson={data.community_areas}
            colors={['#FFFFD4', '#C83302']}
            last_updated={last_updated}
            embed={false}
          />
        </Col>

      </Row>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
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
