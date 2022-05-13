const moment = require('moment');

const formatMessage = (email, text, uniqueId) => {
  return {
    email,
    text,
    id: uniqueId,
    time: moment().format('HH:mm')
  }
}

const formatAdminMessage = (text) => {
  return {
    text,
    time: moment().format('HH:mm')
  }
}

module.exports = {
  formatMessage,
  formatAdminMessage
};