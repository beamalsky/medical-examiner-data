import React from "react"
import { graphql } from "gatsby"

import CommunityAreaMap from "../components/communityareamap"
import EmbedCredit from "../components/embedcredit"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import countNoLocation from "../utils/countNoLocation"
import "../css/custom.css"


const MapPage = ({data}) => {
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
  const no_location = countNoLocation(data.case_data.nodes)

  return (
    <>
      <h4 style={{textAlign: "center"}}>
        Per capita COVID-19 deaths by Chicago neighborhood
      </h4>
      <CommunityAreaMap
        title={`Per capita COVID-19 deaths by Chicago neighborhood`}
        geojson={data.community_areas}
        no_location={no_location}
        colors={['#FFFFD4', '#C83302']}
        last_updated={last_updated}
        embed={true}
      />
      <EmbedCredit
        last_updated={last_updated}
      />
    </>
  )
}

export default MapPage

export const query = graphql`
  query MapWithTextQuery {
    community_areas:allGeoJson {
      nodes {
        features {
          type
          geometry {
            type
            coordinates
          }
          properties {
            community
            population
            value
          }
        }
      }
    },
    case_data:allCasesProcessedJson {
      nodes {
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
