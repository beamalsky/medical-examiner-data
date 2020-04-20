import countKeys from "../utils/countkeys"

const getCVDataByDate = (data) => {
  var dataCV = countKeys(data, 'death_date', false)

  dataCV = Object.entries(dataCV).map(
    obj => {
      var date = new Date(Date.parse(obj[0]))
      // date parsing is off by one. correct is here
      date.setDate(date.getDate() + 1)
      var date_processed = (date).toLocaleString('default', { month: 'long', day: 'numeric' })
      return {
        'day': date_processed,
        'Reported deaths': obj[1]
      }
    }
  )

  return dataCV
}

export default getCVDataByDate
