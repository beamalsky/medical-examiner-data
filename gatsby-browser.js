import React from "react"
import { VizProvider } from "./src/context/vizcontext"

export const wrapRootElement = ({ element }) => (
  <VizProvider>{element}</VizProvider>
)
