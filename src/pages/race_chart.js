import React from "react"
import { graphql } from "gatsby"

import ActivePieChart from "../components/activepiechart"
import getCVData from "../utils/getcvdata"
import getRaceData from "../utils/getracedata"
import "../css/custom.css"


const MapPage = ({data}) => {
  const dataCV = getCVData(
    data.cases_cv.nodes,
    data.cases_cv_a.nodes,
    data.cases_cv_b.nodes,
    data.cases_cv_c.nodes,
    data.cases_cv_secondary.nodes
  )
  
  const dataCVRace = getRaceData(dataCV)

  return (
    <>
      <ActivePieChart
        data={dataCVRace}
        title={`COVID-19 deaths in Chicago by race`}
        colors={['#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f', '#f1eef6']}
        hide_title={true}
      />
    </>
  )
}

export default MapPage

export const query = graphql`
  query RaceQuery {
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
        race
        latino
        latitude
        longitude
        primarycause
        primarycause_linea
        primarycause_lineb
        primarycause_linec
        secondarycause
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
        race
        latino
        latitude
        longitude
        primarycause
        primarycause_linea
        primarycause_lineb
        primarycause_linec
        secondarycause
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
        race
        latino
        latitude
        longitude
        primarycause
        primarycause_linea
        primarycause_lineb
        primarycause_linec
        secondarycause
      }
    },
    cases_cv_c: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          primarycause_linec: {regex: "/.*COVID.*/"}
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
        race
        latino
        latitude
        longitude
        primarycause
        primarycause_linea
        primarycause_lineb
        primarycause_linec
        secondarycause
      }
    },
    cases_cv_secondary: allCases(
        filter: {
          death_date: {gte: "2020-01-01"},
          secondarycause: {regex: "/.*COVID.*/"}
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
        race
        latino
        latitude
        longitude
        primarycause
        primarycause_linea
        primarycause_lineb
        primarycause_linec
        secondarycause
      }
    }
  }
`
