const getCVData = (
  data_source_1,
  data_source_2,
  data_source_3,
  data_source_4,
  data_source_5
) => {
  const dataCVCombined = data_source_1.concat(
    data_source_2
  ).concat(
    data_source_3
  ).concat(
    data_source_4
  ).concat(
    data_source_5
  )

  dataCVCombined.sort((a, b) => (a.death_date > b.death_date) ? 1 : -1)

  return arrayUnique(dataCVCombined)
}

function arrayUnique(array) {
    var a = array.concat()
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1)
        }
    }

    return a
}

export default getCVData
