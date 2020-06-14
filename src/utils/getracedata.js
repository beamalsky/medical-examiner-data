const getRaceData = (data) => {
  var keys

  keys = data.map(function(value, index) {
    if (value.properties.latino) {
      return 'Latinx'
    } else if (value.properties.race == null) {
      return 'Unknown'
    } else {
      return value.properties.race
    }
  })

  var counts = {}

  keys.forEach(function(key, index) {
      if (key in counts) {
          counts[key] += 1;
      } else {
          counts[key] = 1;
      }
  })

  return objectToArray(counts)
}

const objectToArray = (obj) => {
  return Object.entries(obj).map(
    obj => {
      return {
        name: obj[0],
        value: obj[1]
      }
    }
  )
}

export default getRaceData
