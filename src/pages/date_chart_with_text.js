import React from "react"
import { graphql } from "gatsby"
import { Bar } from 'recharts'

import MixedBarChart from "../components/mixedbarchart"
import EmbedCredit from "../components/embedcredit"
import CVTooltip from "../components/cvtooltip"
import getCVDataByDate from "../utils/getcvdatabydate"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import "../css/custom.css"


const MapPage = ({data}) => {
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
  const CVDataByDate = getCVDataByDate(data.date_data.nodes, last_updated)

  return (
    <>
      <h4 style={{textAlign: "center"}}>
        COVID-19 deaths in Chicago by day
      </h4>
      <MixedBarChart
        data={CVDataByDate}
        title={`COVID-19 deaths in Chicago by day`}
        tooltip=<CVTooltip/>
        hide_title={true}
      >
        <Bar dataKey="Reported deaths" fill="#cd4624" type="natural" />
      </MixedBarChart>
      <EmbedCredit
        last_updated={last_updated}
      />
    </>
  )
}

export default MapPage

export const query = graphql`
  query DateWithTextQuery {
    date_data:allCasesJson {
      nodes {
        death_date(formatString: "YYYY-MM-DD")
        community
      }
    },
    build_time:allSiteBuildMetadata {
      nodes {
        buildTime
      }
    }
  }
`
