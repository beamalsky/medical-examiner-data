require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `Cook County Medical Examiner Data`,
    description: ``,
    author: `@beamalsky`,
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
      resolve: 'gatsby-source-apiserver',
      options: {
        name: 'cases',
        url: 'https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$limit=100000',
        method: 'GET',
        auth: false,
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': ${{ secrets.API_APP_TOKEN }}
        },
        localSave: true,
        path: `${__dirname}/src/data/`,
        verboseOutput: true
      },
    },
  ],
}
