// from https://github.com/LiveBy/react-leaflet-choropleth
import { GeoJSON, FeatureGroup } from 'react-leaflet'
import chroma from 'chroma-js'
import React, { Component, cloneElement, Children } from 'react'
import assign from './assign'

export default class Choropleth extends Component {

  isFunction (prop) {
    return typeof prop === 'function'
  }

  max(data) {
    return Math.max(...Object.values(data.filter(isFinite)))
  }

  getColors() {
    const { data, valueProperty, mode, steps, scale, colors: cl } = this.props
    const colors = {}
    const features = Array.isArray(data) ? data : data.features

    const values = features.map(item => this.isFunction(valueProperty)
      ? valueProperty(item)
      : item.properties[valueProperty])

    const max = this.max(values)
    const increment = max / steps
    var limits = []
    for (var i = 1; i <= steps; i++ ) {
      limits.push(i * increment)
    }

    colors.limits = limits
    colors.colors = cl || chroma.scale(scale).colors(steps)
    return colors
  }

  getStyle ({ limits, colors }, feature) {
    const { valueProperty, visible = (() => true), style: userStyle } = this.props

    if( !(( this.isFunction(visible) && visible(feature) ) || feature.properties[visible]) ) return userStyle

    const featureValue = this.isFunction(valueProperty)
      ? valueProperty(feature)
      : feature.properties[valueProperty]

    const idx = (!isNaN(featureValue))
      ? limits.findIndex(lim => featureValue <= lim)
      : -1

    if(colors[idx]){
      const style = {
        fillColor: colors[idx]
      }

      switch (typeof userStyle) {
        case 'function':
          return assign(userStyle(feature), style)
        case 'object':
          return assign({}, userStyle, style)
        default:
          return style
      }

    } else {
      return userStyle
    }

  }

  cloneChildrenWithFeature(props, feature){
    const newProps = assign({}, props, { feature })
    return Children.map(props.children, child => {
      return child ? cloneElement(child, newProps) : null
    })
  }

  render(){
    const features = Array.isArray(this.props.data) ? this.props.data : this.props.data.features
    const chroms = this.getColors()
    const { layerContainer, identity, ...options } = this.props //remove
    return (
      <FeatureGroup map={this.props.map} layerContainer={layerContainer} ref={ (layer) => layer ? this.leafletElement = layer.leafletElement : null } >
        {features.map( (feature, idx) =>
          (<GeoJSON
            key={(identity) ? identity(feature) : idx}
            {...options}
            style={this.getStyle(chroms, feature)}
            {...this.getStyle(chroms, feature)}
            data={feature}
            children={this.props.children ? this.cloneChildrenWithFeature(this.props, feature) : this.props.children}
          />)
        ) }
        </FeatureGroup>
    )
  }
}
