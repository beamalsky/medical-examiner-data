const THRESHOLD = 15

const getMapColors = (data) => {
  var per_capita_max = Math.max(
    ...data.features.map(
      feature => feature.properties.per_capita
    )
  )

  if (per_capita_max <= THRESHOLD / 3) {
    return ['#FFFFD4', '#eab48d']
  } else if (per_capita_max <= THRESHOLD * 2 / 3) {
    return ['#FFFFD4', '#de855a']
  } else {
    return ['#FFFFD4', '#C83302']
  }
}

export default getMapColors
