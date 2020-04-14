import PropTypes from "prop-types"
import React from "react"

import SSWNameplate from "../components/sswnameplate"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `white`,
      marginBottom: `2rem`,
      textAlign: "center",
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 700,
        padding: `1.45rem 0.5rem`,
      }}
    >
      <SSWNameplate />
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
