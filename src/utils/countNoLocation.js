const countNoLocation = (data) => {
  return data.filter(record => record.community === null).length
}

export default countNoLocation
