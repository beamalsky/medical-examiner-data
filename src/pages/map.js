import React from "react"
import { graphql } from "gatsby"

import CommunityAreaMap from "../components/communityareamap"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import "../css/custom.css"


const MapPage = ({data}) => {
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)

  return (
    <>
      <CommunityAreaMap
        title={`Per capita COVID-19 deaths by Chicago neighborhood`}
        geojson={data.community_areas}
        no_location={data.no_location}
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
