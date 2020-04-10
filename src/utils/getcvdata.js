const getCVData = (data_source_1, data_source_2, data_source_3) => {
  const dataCVCombined = data_source_1.concat(
    data_source_2
  ).concat(
    data_source_3
  )

  dataCVCombined.sort((a, b) => (a.death_date > b.death_date) ? 1 : -1)

  return dataCVCombined
}

export default getCVData
