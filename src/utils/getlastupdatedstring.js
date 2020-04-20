const getLastUpdatedString = (buildTime) => {
  const buildTimeParsed = new Date(Date.parse(buildTime))
  return buildTimeParsed.toLocaleString(
    'default',
    { month: 'long', day: 'numeric', year: 'numeric' }
  )
}

export default getLastUpdatedString
