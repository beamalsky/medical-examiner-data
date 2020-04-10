const stripYear = (date) => {
  return date.substr(date.indexOf('-')+1)
}

export default stripYear
