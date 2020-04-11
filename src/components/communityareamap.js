import React, { PureComponent } from 'react'
import { Map, TileLayer } from 'react-leaflet'
import Choropleth from 'react-leaflet-choropleth'

import savedNeighborhoods from "../data/saved_neighborhoods"

const style = {
    fillColor: '#e4e1d8',
    weight: 0.4,
    opacity: 0.7,
    color: 'black',
    // dashArray: '3',
    fillOpacity: 0.9
}

const inside = (point, vs) => {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

export default class CommunityAreaMap extends PureComponent {
  state = {
    lat: 41.83,
    lng: -87.72,
    zoom: 10.25,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    const dataCV = this.props.data

    const communityAreasGeoJSON = this.props.geojson.nodes[0]

    // var saved_neighborhoods = {}

    communityAreasGeoJSON.features.map(
      obj => {
        obj.properties.value = 0

        dataCV.forEach(function(record, index) {
          var includesPoint = false

          if (
            savedNeighborhoods[record.casenumber] &&
            savedNeighborhoods[record.casenumber].neighborhood === obj.properties.community &&
            savedNeighborhoods[record.casenumber].latitude === record.latitude &&
            savedNeighborhoods[record.casenumber].longitude === record.longitude
          ) {
            includesPoint = true
          } else {
            obj.geometry.coordinates.forEach(function(polygon) {
              const pointInside = inside([record.longitude, record.latitude], polygon[0])
              if (pointInside) {
                includesPoint = true
              }
            })
          }

          if (includesPoint) {
            obj.properties.value = obj.properties.value + 1

            // Use this to update saved_neighborhoods.json
            // and improve performance of this function
            // saved_neighborhoods[record.casenumber] = {
            //   'latitude': record.latitude,
            //   'longitude': record.longitude,
            //   'neighborhood': obj.properties.community
            // }
          }

        })

        if (obj.properties.value === 0) {
          obj.properties.value = undefined
        }

        return obj
      }
    )

    // console.log(saved_neighborhoods)

    return (
      <div style={{ width: '100%' }}>
        <h4>{this.props.title}</h4>
        <Map
          center={position}
          zoom={this.state.zoom}
          scrollWheelZoom={false}
          zoomSnap={0.25}
        >
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Choropleth
            data={communityAreasGeoJSON}
            valueProperty={(feature) => feature.properties.value}
            scale={['#d5c17e', '#a01f03']}
            steps={7}
            mode='e'
            style={style}
            onEachFeature={(feature, layer) => layer.bindPopup(`<b>${feature.properties.community}</b> <br /> Deaths: ${feature.properties.value ? feature.properties.value : 0}`)}
            ref={(el) => this.choropleth = el.leafletElement}
          />
        </Map>
      </div>
    )
  }
}
