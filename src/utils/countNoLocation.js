import moment from 'moment'

const countNoLocation = (data, startDate) => {
  if (startDate) {
    data = data.filter(record => moment(record.death_date) > startDate)
  }
  return data.filter(record => record.community === null).length
}

export default countNoLocation
