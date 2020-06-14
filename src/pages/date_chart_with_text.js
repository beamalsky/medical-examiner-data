// import React from "react"
// import { graphql } from "gatsby"
// import { Bar } from 'recharts'
//
// import MixedBarChart from "../components/mixedbarchart"
// import EmbedCredit from "../components/embedcredit"
// import CVTooltip from "../components/cvtooltip"
// import getCVData from "../utils/getcvdata"
// import getCVDataByDate from "../utils/getcvdatabydate"
// import getLastUpdatedString from "../utils/getlastupdatedstring"
// import "../css/custom.css"
//
//
// const MapPage = ({data}) => {
//   const dataCV = getCVData(
//     data.cases_cv.nodes,
//     data.cases_cv_a.nodes,
//     data.cases_cv_b.nodes,
//     data.cases_cv_c.nodes,
//     data.cases_cv_secondary.nodes
//   )
//
//   const CVDataByDate = getCVDataByDate(dataCV)
//   const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
//
//   return (
//     <>
//       <h4 style={{textAlign: "center"}}>
//         COVID-19 deaths in Chicago by day
//       </h4>
//       <MixedBarChart
//         data={CVDataByDate}
//         title={`COVID-19 deaths in Chicago by day`}
//         tooltip=<CVTooltip/>
//         hide_title={true}
//       >
//         <Bar dataKey="Reported deaths" fill="#cd4624" type="natural" />
//       </MixedBarChart>
//       <EmbedCredit
//         last_updated={last_updated}
//       />
//     </>
//   )
// }
//
// export default MapPage
//
// export const query = graphql`
//   query DateWithTextQuery {
//     cases_cv: allCases(
//         filter: {
//           death_date: {gte: "2020-01-01"},
//           primarycause: {regex: "/.*(COVID|Covid|covid).*/"}
//           residence_city: {regex: "/^(CHICAGO|Chicago)$/"}
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         casenumber
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         race
//         latino
//         latitude
//         longitude
//         primarycause
//         primarycause_linea
//         primarycause_lineb
//         primarycause_linec
//         secondarycause
//       }
//     },
//     cases_cv_a: allCases(
//         filter: {
//           death_date: {gte: "2020-01-01"},
//           primarycause_linea: {regex: "/.*(COVID|Covid|covid).*/"}
//           residence_city: {regex: "/^(CHICAGO|Chicago)$/"}
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         casenumber
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         race
//         latino
//         latitude
//         longitude
//         primarycause
//         primarycause_linea
//         primarycause_lineb
//         primarycause_linec
//         secondarycause
//       }
//     },
//     cases_cv_b: allCases(
//         filter: {
//           death_date: {gte: "2020-01-01"},
//           primarycause_lineb: {regex: "/.*(COVID|Covid|covid).*/"}
//           residence_city: {regex: "/^(CHICAGO|Chicago)$/"}
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         casenumber
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         race
//         latino
//         latitude
//         longitude
//         primarycause
//         primarycause_linea
//         primarycause_lineb
//         primarycause_linec
//         secondarycause
//       }
//     },
//     cases_cv_c: allCases(
//         filter: {
//           death_date: {gte: "2020-01-01"},
//           primarycause_linec: {regex: "/.*(COVID|Covid|covid).*/"}
//           residence_city: {regex: "/^(CHICAGO|Chicago)$/"}
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         casenumber
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         race
//         latino
//         latitude
//         longitude
//         primarycause
//         primarycause_linea
//         primarycause_lineb
//         primarycause_linec
//         secondarycause
//       }
//     },
//     cases_cv_secondary: allCases(
//         filter: {
//           death_date: {gte: "2020-01-01"},
//           secondarycause: {regex: "/.*(COVID|Covid|covid).*/"}
//           residence_city: {regex: "/^(CHICAGO|Chicago)$/"}
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         casenumber
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         race
//         latino
//         latitude
//         longitude
//         primarycause
//         primarycause_linea
//         primarycause_lineb
//         primarycause_linec
//         secondarycause
//       }
//     },
//     build_time:allSiteBuildMetadata {
//       nodes {
//         buildTime
//       }
//     }
//   }
// `
