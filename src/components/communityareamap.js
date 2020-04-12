import React, { PureComponent } from 'react'
import { Map, TileLayer } from 'react-leaflet'
import Choropleth from 'react-leaflet-choropleth'

import savedNeighborhoods from "../data/saved_neighborhoods"
import DataTable from "../components/datatable"

const style = {
    fillColor: '#e4e1d8',
    weight: 0.4,
    opacity: 0.7,
    color: 'black',
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

const round = (num) => {
  return Math.round(num * 10) / 10
}

const getPopUpText = (properties) => {
  const community = properties.community
  const deaths = properties.value ? properties.value : 0
  const per_capita = properties.per_capita
  return `<b>${community}</b><br />${per_capita} per 10,000 residents<br />Total deaths: ${deaths}`
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

    dataCV.forEach(function(record) {
      var savedRecord = savedNeighborhoods[record.casenumber]
      if (
        savedRecord &&
        savedRecord.latitude === record.latitude &&
        savedRecord.longitude === record.longitude
      ) {
        var community = savedNeighborhoods[record.casenumber].community

        communityAreasGeoJSON.features.some(function (feature) {
          if (feature.properties.community === community) {
            if (feature.properties.value) {
              feature.properties.value += 1
            } else {
              feature.properties.value = 1
            }
            return true
          }
        })
      } else {
        communityAreasGeoJSON.features.some(function (feature) {
          var includesPoint = false

          feature.geometry.coordinates.some(function(polygon) {
            const pointInside = inside([record.longitude, record.latitude], polygon[0])
            if (pointInside) {
              includesPoint = true
              return includesPoint
            }
          })

          if (includesPoint) {
            if (feature.properties.value) {
              feature.properties.value += 1
            } else {
              feature.properties.value = 1
            }

            // Use this to update saved_neighborhoods.json
            // and improve performance of this function
            // saved_neighborhoods[record.casenumber] = {
            //   'latitude': record.latitude,
            //   'longitude': record.longitude,
            //   'community': feature.properties.community
            // }
          }
        })
      }
    })

    communityAreasGeoJSON.features.map(
      feature => {
        feature.properties.per_capita =  feature.properties.value ? round(feature.properties.value * 10000 / feature.properties.population) : 0
        return feature
      }
    )

    // console.log(saved_neighborhoods)

    return (
      <div style={{ width: '100%' }}>
        <Map
          center={position}
          zoom={this.state.zoom}
          scrollWheelZoom={false}
          zoomSnap={0.25}
          tap={false}
          touchZoom={true}
        >
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Choropleth
            data={communityAreasGeoJSON}
            valueProperty={(feature) => (feature.properties.value / feature.properties.population)}
            scale={this.props.colors}
            steps={7}
            mode='e'
            style={style}
            onEachFeature={(feature, layer) => layer.bindPopup(getPopUpText(feature.properties))}
            ref={(el) => this.choropleth = el.leafletElement}
          />
        </Map>
        <br />
        <h4 style={{ textAlign: "center"}}>{this.props.title}</h4>
        <DataTable
          data={communityAreasGeoJSON}
        />
      </div>
    )
  }
}
