require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `COVID-19 Deaths in Chicago’s Neighborhoods`,
    description: `South Side Weekly | A live tracker by Bea Malsky`,
    twitterUsername: `@beamalsky`,
    url: "https://covid19neighborhoods.southsideweekly.com", // No trailing slash allowed!
    image: "/card.png"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-react-leaflet',
      options: {
        linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojson`,
        path: `${__dirname}/src/data/chicago_community_areas.geojson`,
        ignore: [`**/\cases*`], // ignore CCME cases data
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `allCases`,
        path: `${__dirname}/src/data/cases.geojson`
      },
    },
    'gatsby-transformer-geojson',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-30162627-3",
      },
    },
  ],
}
