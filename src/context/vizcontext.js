import React from "react"

const defaultState = {
  location: "Chicago",
  setLocation: () => {},
}

const VizContext = React.createContext(defaultState)

class VizProvider extends React.Component {
  state = {
    location: "Chicago"
  }

  render () {
    const { children } = this.props
    const { location } = this.state

    return (
      <VizContext.Provider
        value={{
          location,
          setLocation: (location) => this.setState({location}),
        }}
      >
        {children}
      </VizContext.Provider>
    )
  }
}

export default VizContext

export { VizProvider }
