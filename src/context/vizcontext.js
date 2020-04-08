import React from "react"

const defaultState = {
  location: "cook county",
  setLocation: () => {},
}

const VizContext = React.createContext(defaultState)

class VizProvider extends React.Component {
  state = {
    location: "cook county"
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
