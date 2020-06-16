import React from "react"
import { graphql } from "gatsby"

import ActivePieChart from "../components/activepiechart"
import getRaceData from "../utils/getracedata"
import "../css/custom.css"


const MapPage = ({data}) => {
  const dataCVRace = getRaceData(data.race_data.nodes)

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
    race_data:allCasesJson {
      nodes {
        race
        latino
      }
    }
  }
`
