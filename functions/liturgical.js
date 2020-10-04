const ics = require("ics")
const axios = require("axios")
const moment = require("moment")

const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

exports.handler = async (event, context, callback) => {
  const now = moment()
  const events = []

  now.subtract(1, "month")
  const { data: lastMonthData } = await axios.get(
    `https://liturgical.acupofjose.com/api/v0/en/calendars/default/${now.year()}/${now.month()}`
  )

  now.add(1, "month")
  const { data: thisMonthData } = await axios.get(
    `https://liturgical.acupofjose.com/api/v0/en/calendars/default/${now.year()}/${now.month()}`
  )

  now.add(1, "month")
  const { data: nextMonthData } = await axios.get(
    `https://liturgical.acupofjose.com/api/v0/en/calendars/default/${now.year()}/${now.month()}`
  )

  const allData = [...lastMonthData, ...thisMonthData, ...nextMonthData]

  for (const { date, season, season_week, celebrations } of allData) {
    const obj = moment(date)
    for (let { title, colour, rank } of celebrations) {
      events.push({
        start: [obj.year(), obj.month(), obj.day() + 1],
        end: [obj.year(), obj.month(), obj.day() + 1],
        title,
        description: `Week ${season_week} of ${season}\n${toTitleCase(colour)}: ${toTitleCase(rank)}`,
      })
    }
  }

  ics.createEvents(events, (err, value) => {
    callback(err, {
      statusCode: 200,
      body: value,
    })
  })
}
