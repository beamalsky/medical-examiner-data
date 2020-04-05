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
        <p>
          A work in progress by <a href="https://twitter.com/beamalsky">Bea Malsky</a>.
          Open source code <a href="https://github.com/beamalsky/medical-examiner-data">here</a>.
        </p>
      </Contain>
    </Foot>
  )
}

export default Footer
