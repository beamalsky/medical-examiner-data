import React, { PureComponent } from 'react'
import { Map, TileLayer } from 'react-leaflet'
// import Choropleth from 'react-leaflet-choropleth'

import Choropleth from "../components/chloropleth"
import DataTable from "../components/datatable"

const style = {
    fillColor: '#FFFFD4',
    weight: 0.4,
    opacity: 0.7,
    color: 'black',
    fillOpacity: 0.9
}

const round = (num) => {
  return Math.round(num * 10) / 10
}

const getPopUpText = (properties) => {
  const community = properties.community
  const per_capita = properties.per_capita ? `<br />${properties.per_capita} per 10,000 residents` : ''
  const deaths = properties.value ? `Total deaths: ${properties.value}` : 'No deaths reported'
  return `<b>${community}</b><br />${deaths}${per_capita}`
}

export default class CommunityAreaMap extends PureComponent {
  state = {
    lat: 41.84,
    lng: -87.73,
    zoom: this.props.zoom ? this.props.zoom : 10.25
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    const communityAreasGeoJSON = this.props.geojson

    communityAreasGeoJSON.features.map(
      feature => {
        var per_capita = feature.properties.value ? round(feature.properties.value * 10000 / feature.properties.population) : null
        if (per_capita) {
          feature.properties.per_capita = per_capita
        }
        return feature
      }
    )

    // this dummy feature introduces an upper bound on all maps
    // and allows us to keep a constant color scale
    const scaler = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": []
      },
      "properties": {
        "per_capita": 8
      }
    }

    communityAreasGeoJSON.features.push(scaler)

    return (
      <div style={{ width: '100%' }}>
        <h4 style={{
          textAlign: "center",
          marginBottom: "-2rem",
          marginLeft: "5rem",
          zIndex: "999",
          position: "relative",
          backgroundColor: "white",
          padding: "0rem 1rem 1rem 1rem",
          lineHeight: "1.3",
          display: this.props.embed ? "none" : "inherit"
        }}>
          {this.props.title}
        </h4>
        <Map
          center={position}
          zoom={this.state.zoom}
          scrollWheelZoom={false}
          zoomSnap={0.25}
          tap={false}
          touchZoom={true}
          style={{ height: this.props.height ? this.props.height : '600px' }}
        >
          <TileLayer
            attribution='Bea Malsky for <a href="https://southsideweekly.com/" target="_parent">South Side Weekly</a><br />&copy; <a href="https://www.openstreetmap.org/copyright" target="_parent">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_parent">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <Choropleth
            data={communityAreasGeoJSON}
            valueProperty={(feature) => (feature.properties.per_capita)}
            scale={['#f3b875', '#C83302', '#992702']}
            steps={7}
            mode='e'
            style={style}
            onEachFeature={(feature, layer) => layer.bindPopup(getPopUpText(feature.properties))}
            ref={(el) => this.choropleth = el.leafletElement}
          />
        </Map>
        <br />
        <DataTable
          data={communityAreasGeoJSON}
          start_date={this.props.start_date}
          last_updated={this.props.last_updated}
          embed={this.props.embed}
          no_location_count={this.props.no_location}
        />
      </div>
    )
  }
}
