import React, { PureComponent } from 'react';
import { Map, TileLayer } from 'react-leaflet'
import Choropleth from 'react-leaflet-choropleth'

import zipGeoJSON from '../data/chicago_zip_codes.js'


const style = {
    fillColor: '#F28F3B',
    weight: 1,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7
}

export default class ZipMap extends PureComponent {
  state = {
    lat: 41.83,
    lng: -87.72,
    zoom: 10,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    const dataCV = this.props.data

    zipGeoJSON.features.map(
      obj => {
        obj.properties.value = dataCV[obj.properties.zip] ? dataCV[obj.properties.zip] : 0
        return obj
      }
    )

    return (
      <div style={{ width: '100%' }}>
        <h4>{this.props.title}</h4>
        <Map
          center={position}
          zoom={this.state.zoom}
          scrollWheelZoom={false}
          touchZoom={false}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Choropleth
            data={zipGeoJSON}
            valueProperty={(feature) => feature.properties.value}
            scale={['#d5c17e', '#801902']}
            steps={10}
            mode='e'
            style={style}
            onEachFeature={(feature, layer) => layer.bindPopup(`<b>${feature.properties.zip}</b> <br /> Deaths: ${feature.properties.value}`)}
            ref={(el) => this.choropleth = el.leafletElement}
          />
        </Map>
      </div>
    )
  }
}
