const timeStampToDateObj = timestamp => new Date(parseInt(timestamp) * 1000)

export const formatDate = dateUTC =>
  (timeStampToDateObj(dateUTC).toLocaleString('bg-EU'))
  .replace(/г.|ч./gi, '')
  .replace(',', ' ')

