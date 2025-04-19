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
         title_uz = $1 or title_ru = $1 or title_eng = $1;
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
const addCheck = (chat_id, method, trans_id, amount) => {
   const QUERY = `
      INSERT INTO 
         checks (
            user_id,
            method,
            success_trans_id,
            amount
         ) VALUES (
            $1,
            $2,
            $3,
            $4
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      chat_id,
      method,
      trans_id,
      amount
   )
}
const foundPartner = (partner_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         partners
      WHERE
         id = $1;
   `;

   return fetch(QUERY, partner_id)
};
const checkUserPaid = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         checks
      WHERE
         user_id = $1;
   `;

   return fetchALL(QUERY, chat_id)
}
const editPartnerProfit = (id, profitAmount) => {
   const QUERY = `
      UPDATE
         partners
      SET
         balance = balance + $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, profitAmount)
}

module.exports = {
   foundUser,
   editStep,
   foundTarif,
   editUserPremium,
   addCheck,
   foundPartner,
   checkUserPaid,
   editPartnerProfit
}