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
        name: `geojsonAll`,
        path: `${__dirname}/src/data/final/community_areas.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojsonRecent`,
        path: `${__dirname}/src/data/final/community_areas_recent.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojsonMarch`,
        path: `${__dirname}/src/data/final/community_areas_march.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojsonApril`,
        path: `${__dirname}/src/data/final/community_areas_april.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojsonMay`,
        path: `${__dirname}/src/data/final/community_areas_may.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojsonJune`,
        path: `${__dirname}/src/data/final/community_areas_june.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `geojsonJuly`,
        path: `${__dirname}/src/data/final/community_areas_july.geojson`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/final/cases.json`
      },
    },
    'gatsby-transformer-geojson',
    'gatsby-transformer-json',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-30162627-3",
      },
    },
  ],
}
