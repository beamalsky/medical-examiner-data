// import React from "react"
// import { graphql } from "gatsby"
//
// import CommunityAreaMap from "../components/communityareamap"
// import EmbedCredit from "../components/embedcredit"
// import getCVData from "../utils/getcvdata"
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
//   const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
//
//   return (
//     <>
//       <h4 style={{textAlign: "center"}}>
//         Per capita COVID-19 deaths by Chicago neighborhood
//       </h4>
//       <CommunityAreaMap
//         title={`Per capita COVID-19 deaths by Chicago neighborhood`}
//         data={dataCV}
//         geojson={data.community_areas}
//         colors={['#FFFFD4', '#C83302']}
//         last_updated={last_updated}
//         embed={true}
//       />
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
//   query MapWithTextQuery {
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
//     community_areas:allGeoJson {
//       nodes {
//         features {
//           type
//           properties {
//             community
//             population
//           }
//           geometry {
//             coordinates
//             type
//           }
//         }
//       }
//     },
//     build_time:allSiteBuildMetadata {
//       nodes {
//         buildTime
//       }
//     }
//   }
// `
