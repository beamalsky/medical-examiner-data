import React from "react"
import * as pym from "pym.js"
import { VizProvider } from "./src/context/vizcontext"

export const onInitialClientRender = () => {
  const pymChild = new pym.Child({ polling: 500 })
  pymChild.sendHeight()
}

export const wrapRootElement = ({ element }) => (
  <VizProvider>{element}</VizProvider>
)
