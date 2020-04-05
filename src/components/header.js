import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#f6ecea`,
      marginBottom: `3rem`,
      textAlign: "center"
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 1160,
        padding: `1.45rem 0.5rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `black`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <p style= {{
        'font-family': 'sans-serif',
        'font-size': '0.8rem',
        'margin-bottom': 0,
        'margin-top': '0.7rem'
      }}
      >
        A work in progress by <a href="https://twitter.com/beamalsky">Bea Malsky</a>. Updates hourly with data from the <a href="https://datacatalog.cookcountyil.gov/Public-Safety/Medical-Examiner-Case-Archive/cjeq-bs86">Cook County Medical Examiner</a>.
      </p>
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
