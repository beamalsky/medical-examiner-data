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

  return (
    <CommunityAreaMap
      title={`Deaths by Chicago neighborhood, per capita`}
      data={dataCV}
      geojson={data.community_areas}
      colors={['#e7d28f', '#a01f03']}
    />
  )
}

export default MapPage

export const query = graphql`
  query MapQuery {
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
        primarycause
        primarycause_linea
        primarycause_lineb
        latitude
        longitude
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
        primarycause
        primarycause_linea
        primarycause_lineb
        latitude
        longitude
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
        primarycause
        primarycause_linea
        primarycause_lineb
        latitude
        longitude
      }
    }
    community_areas:allGeoJson(limit: 10) {
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
    }
  }
`
