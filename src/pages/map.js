import React from "react"
import { graphql } from "gatsby"

import ZipMap from "../components/zipmap"

const getCVData = (data) => {
  const dataCVCombined = data.cases_cv.nodes.concat(
    data.cases_cv_a.nodes
  ).concat(
    data.cases_cv_b.nodes
  )

  return dataCVCombined
}

const countKeys = (data, groupKey) => {
  var keys

  keys = data.map(function(value, index) {return value[groupKey]})

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

const MapPage = ({data}) => {

  const dataCV = getCVData(data)
  const dataZip = countKeys(dataCV, 'residence_zip', false)

  return (
    <ZipMap
      title={`Deaths attributed to COVID-19 in Chicago by zip code`}
      data={dataZip}
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
    }
  }
`
