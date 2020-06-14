import stripYear from "../utils/stripyear"

const countKeys = (data, groupKey, strip) => {
  var keys

  if (strip) {
    keys = data.map(function(value, index) {return stripYear(value[groupKey])})
  } else {
    keys = data.map(function(value, index) {return value[groupKey]})
  }

  keys.sort((a, b) => (a > b) ? 1 : -1)

  var counts = {}

  keys.forEach(function(key, index) {
      if (key in counts) {
          counts[key] += 1;
      } else {
          counts[key] = 1;
      }
  })

  return counts
}

export default countKeys
