import React from "react"
import styled from 'styled-components'

const Foot = styled.section`
  background: #333333;
  font-family: sans-serif;
  font-size: 0.8rem;
`

const Contain = styled.div`
  color: #fff;
  margin: 0 auto;
  width: 80%;
  p {
    text-align: center;
    padding: 10px 0;
    margin-bottom: 0;
  }
`

const Footer = () => {
  return (
    <Foot>
      <Contain>
        <p className="footer">
          This is a special project for the <a href="https://southsideweekly.com/">South Side Weekly</a> by <a href="https://twitter.com/beamalsky">Bea Malsky</a> based
          on live data from the <a href="https://datacatalog.cookcountyil.gov/Public-Safety/Medical-Examiner-Case-Archive/cjeq-bs86">Cook County Medical Examiner</a>.
          Open source code can be found <a href="https://github.com/beamalsky/medical-examiner-data">here</a>.
        </p>
      </Contain>
    </Foot>
  )
}

export default Footer
