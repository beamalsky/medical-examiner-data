import React from "react"
import { graphql } from "gatsby"

import CommunityAreaMap from "../components/communityareamap"
import EmbedCredit from "../components/embedcredit"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import "../css/custom.css"


const MapPage = ({data}) => {
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)

  return (
    <>
      <h4 style={{textAlign: "center"}}>
        Per capita COVID-19 deaths by Chicago neighborhood
      </h4>
      <CommunityAreaMap
        title={`Per capita COVID-19 deaths by Chicago neighborhood`}
        areaCounts={data.area_counts}
        geojson={data.community_areas}
        no_location={data.no_location}
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
    area_counts:allCommunityAreasCasesJson {
      nodes {
        community
        value
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
    no_location:allUnjoinedCasesJson {
      nodes {
        casenumber
      }
    },
    build_time:allSiteBuildMetadata {
      nodes {
        buildTime
      }
    }
  }
`
