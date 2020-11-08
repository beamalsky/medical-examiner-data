module.exports = (typeof Object.assign === 'function') ?
  Object.assign :
  (function (target) {
    if (!target) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    for (var i = 1, len = arguments.length; i < len; i++) {
      var source = arguments[i]
      if (source) {
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  })
