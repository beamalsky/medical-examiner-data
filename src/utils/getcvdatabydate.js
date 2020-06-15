import moment from 'moment'
import countKeys from "../utils/countkeys"

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
}

function getDates(startDate, stopDate) {
    var dateArray = []
    var currentDate = startDate
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate))
        currentDate = currentDate.addDays(1)
    }
    return dateArray
}

const getCVDataByDate = (data, last_updated, community) => {
  if (community) {
    data = data.filter(d => d.community === community)
  }
  const dateCounts = countKeys(data, 'death_date', false)
  const startDate = new Date(2020, 2, 16)
  const endDate = new Date(last_updated)
  const dates = getDates(startDate, endDate)

  var dateArray = []
  dates.forEach(date => {
    const m = moment(date)
    const formattedDate = m.format('YYYY-MM-DD')
    const bar = {
      'day': m.format('MMM Do'),
      'Reported deaths': dateCounts[formattedDate]
    }
    dateArray.push(bar)
  })

  return dateArray
}

export default getCVDataByDate
