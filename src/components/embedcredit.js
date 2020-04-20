import React from "react"
import { Col, Row } from 'react-bootstrap'

const EmbedCredit = (props) => {
  return (
    <Row>
      <Col lg={8} style={{ lineHeight: 1 }}>
        <small>
          Bea Malsky for <a href="https://southsideweekly.com/">South Side Weekly</a>. Last updated <b>{props.last_updated}</b> with data from the Cook County Medical Examiner's office. See the full live tracker at <a href="https://covid19neighborhoods.southsideweekly.com">covid19neighborhoods.southsideweekly.com</a>
        </small>
      </Col>
    </Row>
  )
}

export default EmbedCredit
