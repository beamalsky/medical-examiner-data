import React, { PureComponent } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet'
import Choropleth from 'react-leaflet-choropleth'

import zipGeoJSON from '../data/crimes_by_district.js'


const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

export default class ZipMap extends PureComponent {
  state = {
    lat: 40.0318664292562,
    lng: -75.179077373256,
    zoom: 13,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Choropleth
          data={zipGeoJSON}
          valueProperty={(feature) => feature.properties.incidents}
          // visible={(feature) => feature.id !== active.id}
          scale={['#b3cde0', '#011f4b']}
          steps={7}
          mode='e'
          style={style}
          onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.location)}
          ref={(el) => this.choropleth = el.leafletElement}
        />
      </Map>
    )
  }
}
