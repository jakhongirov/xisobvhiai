const { fetch } = require('../../lib/postgres')

const foundUser = (chatId) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chatId)
}
const editStep = (chatId, step) => {
   const QUERY = `
      UPDATE
         users
      SET
         bot_step = $2
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chatId, step)
}
const foundTarif = (title) => {
   const QUERY = `
      SELECT
         *
      FROM
         price
      WHERE
         title = $1;
   `;

   return fetch(QUERY, title)
}
const editUserPremium = (id, expiredDate) => {
   const QUERY = `
      UPDATE
         users
      SET
         expired_date = $2,
         premium = true
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, expiredDate)
}

module.exports = {
   foundUser,
   editStep,
   foundTarif,
   editUserPremium
}