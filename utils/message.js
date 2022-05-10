const moment = require('moment');

const formatMessage = (email, text) => {
  return {
    email,
    text,
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