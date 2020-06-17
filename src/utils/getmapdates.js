import moment from 'moment'

const getMapDates = (last_updated) => {
  const endDate = moment(new Date(last_updated))
  const startDate = endDate.clone().subtract(21, 'day')

  return {
    'startDate': startDate,
    'endDate': endDate,
    'startDateFormatted': startDate.format('MMM Do'),
    'endDateFormatted': endDate.format('MMM Do')
  }
}

export default getMapDates
