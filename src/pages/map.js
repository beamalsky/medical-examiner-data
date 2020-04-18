import React from "react"
import { graphql } from "gatsby"

import CommunityAreaMap from "../components/communityareamap"
import getCVData from "../utils/getcvdata"
import "../css/custom.css"


const MapPage = ({data}) => {
  const dataCV = getCVData(
    data.cases_cv.nodes,
    data.cases_cv_a.nodes,
    data.cases_cv_b.nodes
  )

  const build_time = data.build_time.nodes[0].buildTime
  const build_time_parsed = new Date(Date.parse(build_time))
  const last_updated = build_time_parsed.toLocaleString(
    'default',
    { month: 'long', day: 'numeric', year: 'numeric' }
  )

  return (
    <>
      <CommunityAreaMap
        title={`Per capita COVID-19 deaths by Chicago neighborhood`}
        data={dataCV}
        geojson={data.community_areas}
        colors={['#FFFFD4', '#C83302']}
        last_updated={last_updated}
        embed={true}
      />
    </>
  )
}

export default MapPage

export const query = graphql`
  query MapQuery {
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
        primarycause
        primarycause_linea
        primarycause_lineb
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
        primarycause
        primarycause_linea
        primarycause_lineb
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
        primarycause
        primarycause_linea
        primarycause_lineb
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
