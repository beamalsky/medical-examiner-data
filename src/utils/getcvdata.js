const getCVData = (data) => {
  const dataCVCombined = data.cases_cv.nodes.concat(
    data.cases_cv_a.nodes
  ).concat(
    data.cases_cv_b.nodes
  )

  return dataCVCombined
}

export default getCVData
