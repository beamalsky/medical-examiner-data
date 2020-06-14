import React from "react"
import { graphql } from "gatsby"

import ActivePieChart from "../components/activepiechart"
import EmbedCredit from "../components/embedcredit"
import getRaceData from "../utils/getracedata"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import "../css/custom.css"


const MapPage = ({data}) => {
  const dataCVRace = getRaceData(data.race_data.nodes)
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)

  return (
    <>
      <h4 style={{textAlign: "center"}}>
        COVID-19 deaths in Chicago by race
      </h4>
      <ActivePieChart
        data={dataCVRace}
        title={`COVID-19 deaths in Chicago by race`}
        colors={['#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f', '#f1eef6']}
        hide_title={true}
      />
      <EmbedCredit
        last_updated={last_updated}
      />
    </>
  )
}

export default MapPage

export const query = graphql`
  query RaceWithTextQuery {
    race_data:allCasesProcessedJson {
      nodes {
        race
        latino
      }
    },
    build_time:allSiteBuildMetadata {
      nodes {
        buildTime
      }
    }
  }
`
