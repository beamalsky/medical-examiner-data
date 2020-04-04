import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ZoomLineChart from "../components/zoomlinechart"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <ZoomLineChart />
  </Layout>
)

export default IndexPage
