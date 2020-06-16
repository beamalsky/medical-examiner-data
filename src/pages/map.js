import React from "react"
import { graphql } from "gatsby"
import { Col, Row } from 'react-bootstrap'

import CommunityAreaMap from "../components/communityareamap"
import getLastUpdatedString from "../utils/getlastupdatedstring"
import countNoLocation from "../utils/countnolocation"
import "../css/custom.css"


const MapPage = ({data}) => {
  const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
  const no_location = countNoLocation(data.case_data.nodes)

  return (
    <Row>
      <Col>
        <CommunityAreaMap
          title={`Recent per capita COVID-19 deaths by Chicago neighborhood`}
          geojson={data.community_areas.nodes[1]}
          no_location={no_location}
          colors={['#FFFFD4', '#C83302']}
          last_updated={last_updated}
          embed={true}
        />
      </Col>
      <Col>
        <CommunityAreaMap
          title={`Total per capita COVID-19 deaths by Chicago neighborhood`}
          geojson={data.community_areas.nodes[0]}
          no_location={no_location}
          colors={['#FFFFD4', '#C83302']}
          last_updated={last_updated}
          embed={true}
        />
      </Col>
    </Row>
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
    case_data:allCasesJson {
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
