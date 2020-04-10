import React from "react"
import { graphql } from "gatsby"

import ZipMap from "../components/communityareamap"
import getCVData from "../utils/getcvdata"
import "../components/layout.css"


const MapPage = ({data}) => {
  const dataCV = getCVData(data)

  return (
    <ZipMap
      title={`Deaths attributed to COVID-19 by community area`}
      data={dataCV}
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
  }
`
