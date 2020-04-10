import React from "react"
import TooltipWrapperStyle from "../components/tooltipwrapperstyle"

const CVTooltip = ({ active, payload, label }) => {
  if (active) {
    const cv_deaths = payload[0] ? payload[0]['value'] : 0

    return <TooltipWrapperStyle>
      <h3>{label}</h3>
      <p>
        <b>{cv_deaths}</b> recorded COVID-19 deaths
      </p>
    </TooltipWrapperStyle>
  }

  return null
}

export default CVTooltip
