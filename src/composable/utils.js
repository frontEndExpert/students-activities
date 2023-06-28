export function getFullMonth(miliseconds) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  var date = new Date(miliseconds * 1000)
  return monthNames[date.getMonth()]
}

export function formatDate(miliseconds) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  var date = new Date(miliseconds * 1000)

  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  var dateStr =
    monthNames[date.getMonth()] +
    ' ' +
    date.getDate() +
    ', ' +
    date.getFullYear() +
    ' \u2022 ' +
    strTime

  return dateStr
}

export function capitalizeFirstLetter(string, sign) {
  const newStringArr = string.split(sign)
  let text = ''
  newStringArr.forEach((word) => {
    return (text += word.charAt(0).toUpperCase() + word.slice(1) + ' ')
  })
  return text
}
