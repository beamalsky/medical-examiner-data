// import React from "react"
// import { graphql } from "gatsby"
// import { Bar } from 'recharts'
//
// import getCVData from "../utils/getcvdata"
// import countKeys from "../utils/countkeys"
// import stripYear from "../utils/stripyear"
// import MixedBarChart from "../components/mixedbarchart"
// import TooltipWrapperStyle from "../components/tooltipwrapperstyle"
// import getLastUpdatedString from "../utils/getlastupdatedstring"
// import EmbedCredit from "../components/embedcredit"
//
//
// const countDays = (data) => {
//   var keys = Object.entries(data).map(obj => {return stripYear(obj[0])})
//   var counts = {}
//
//   keys.forEach(function(key, index) {
//       if (key in counts) {
//           counts[key] += 1;
//       } else {
//           counts[key] = 1;
//       }
//   })
//
//   return counts
// }
//
// const getHistoricalData = (data) => {
//   const dataCV = countKeys(
//     getCVData(
//       data.cases_cv.nodes,
//       data.cases_cv_a.nodes,
//       data.cases_cv_b.nodes,
//       data.cases_cv_c.nodes,
//       data.cases_cv_secondary.nodes
//     ),
//     'death_date',
//     false
//   )
//   var data2020 = countKeys(data.cases_2020.nodes, 'death_date', false)
//
//   const dataHistorical_days = countKeys(data.cases_historical.nodes, 'death_date', true)
//   const dataHistorical_dates = countKeys(data.cases_historical.nodes, 'death_date', false)
//   const dataHistorical_frequency = countDays(dataHistorical_dates)
//
//   data2020 = Object.entries(data2020).map(
//     obj => {
//       return {
//         date: obj[0],
//         day: stripYear(obj[0]),
//         cases: obj[1]
//       }
//     }
//   )
//
//   var mergedData = {}
//
//   Object.entries(data2020).forEach(function (value) {
//     var date = value[1]['date'] // YYYY-MM-DD
//     var day = value[1]['day'] // MM-DD
//
//     mergedData[value[0]] = {
//       'day': day,
//       '2020 Deaths': value[1]['cases'] - (dataCV[date] || 0),
//       'COVID-19': dataCV[date],
//       'Average Deaths': dataHistorical_days[day] / dataHistorical_frequency[day]
//     }
//
//   })
//
//   return Object.keys(mergedData).map(i => mergedData[i])
//
// }
//
//
// const HistoricalTooltip = ({ active, payload, label }) => {
//   if (active) {
//     const cv_deaths = payload[2] ? payload[2]['value'] : 0
//
//     return <TooltipWrapperStyle>
//       <h3>{label}</h3>
//       <p>
//         {payload[1]['dataKey']}: <b>{payload[1]['value'] + cv_deaths}</b> <br />
//         <i>{cv_deaths} recorded as COVID-19</i>
//       </p>
//       <p>
//         Historical average: <b>{payload[0]['value']}</b>
//       </p>
//     </TooltipWrapperStyle>
//   }
//
//   return null
// }
//
// const AllDeathsPage = ({data}) => {
//   const dataHistorical = getHistoricalData(data)
//   const last_updated = getLastUpdatedString(data.build_time.nodes[0].buildTime)
//
//   return (
//     <>
//       <h4 style={{textAlign: "center"}}>
//         All recorded deaths in Chicago by day
//       </h4>
//       <MixedBarChart
//         data={dataHistorical}
//         title={`All recorded deaths in Chicago by day`}
//         tooltip=<HistoricalTooltip/>
//       >
//         <Bar dataKey="Average Deaths" fill="#d5c17e"/>
//         <Bar dataKey="2020 Deaths" stackId="a" fill="#d5644b"/>
//         <Bar dataKey="COVID-19" stackId="a" fill="#934534"/>
//       </MixedBarChart>
//       <EmbedCredit
//         last_updated={last_updated}
//       />
//     </>
//   )
// }
//
// export default AllDeathsPage
//
// export const query = graphql`
//   query AllQuery {
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
//       cases_2020: allCases(
//         filter: {
//           death_date: {gte: "2020-03-16"},
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         id
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         age
//         race
//         primarycause
//         primarycause_linea
//         gender
//       }
//     },
//     cases_historical: allCases(
//         filter: {
//           death_date: {gte: "2015-03-16", lt: "2020-01-01"}
//         },
//         sort: {
//           fields: death_date,
//           order: ASC
//         }
//       ) {
//       nodes {
//         id
//         death_date(formatString: "YYYY-MM-DD")
//         residence_city
//         age
//         race
//         primarycause
//         primarycause_linea
//         gender
//       }
//     },
//     build_time:allSiteBuildMetadata {
//       nodes {
//         buildTime
//       }
//     }
//   }
// `
