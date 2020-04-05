import React from "react"
import styled from 'styled-components'

const Foot = styled.section`
  background: #333333;
`

const Contain = styled.div`
  color: #fff;
  margin: 0 auto;
  width: 80%;
  p {
    text-align: center;
    padding: 10px 0;
  }
`

const Footer = () => {
  return (
    <Foot>
      <Contain>
        <p>Put some footer text here</p>
      </Contain>
    </Foot>
  )
}

export default Footer
