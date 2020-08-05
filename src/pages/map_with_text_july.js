import React from "react"
import { graphql } from "gatsby"

import CommunityAreaMap from "../components/communityareamap"
import EmbedCredit from "../components/embedcredit"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import noLocationCount from "../utils/nolocationcount"
import "../css/custom.css"


const MapPage = ({data}) => {
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
  const no_location = noLocationCount(data.case_data.nodes)

  return (
    <>
      <h4 style={{textAlign: "center"}}>
        July 2020 per capita COVID-19 deaths by Chicago neighborhood
      </h4>
      <CommunityAreaMap
        title={`July 2020 per capita COVID-19 deaths by Chicago neighborhood`}
        geojson={data.community_areas.nodes[0].childGeoJson}
        no_location={no_location}
        last_updated={last_updated}
        embed={true}
        zoom={10}
        height='450px'
      />
      <EmbedCredit
        last_updated={last_updated}
      />
    </>
  )
}

export default MapPage

export const query = graphql`
  query MapWithTextJulyQuery {
    community_areas:allFile(
      filter: {sourceInstanceName: {eq: "geojsonJuly"}}
    ) {
      nodes {
        childGeoJson {
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
      }
    },
    case_data:allCasesJson{
      nodes {
        death_date
      }
    },
    build_time:allSiteBuildMetadata {
      nodes {
        buildTime
      }
    }
  }
`
