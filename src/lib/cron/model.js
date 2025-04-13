const {
   fetch,
   fetchALL
} = require('../postgres')

const getUsersBefore2day = () => {
   const QUERY = `
      SELECT 
         id
         chat_id,
         bot_lang
      FROM 
         users
      WHERE 
         TO_TIMESTAMP(expired_date)::DATE = (CURRENT_DATE + INTERVAL '2 day');
   `;

   return fetchALL(QUERY)
}
const getUsersBefore1day = () => {
   const QUERY = `
      SELECT 
         id,
         chat_id,
         bot_lang
      FROM 
         users
      WHERE 
         TO_TIMESTAMP(expired_date)::DATE = (CURRENT_DATE + INTERVAL '1 day');
   `;

   return fetchALL(QUERY)
}
const getUsers = () => {
   const QUERY = `
      SELECT 
         id,
         chat_id,
         bot_lang
      FROM 
         users
      WHERE 
         TO_TIMESTAMP(expired_date)::DATE = CURRENT_DATE 
         AND duratio = false
   `;

   return fetchALL(QUERY)
}
const getUsersPremium = () => {
   const QUERY = `
      SELECT 
         id,
         chat_id,
         bot_lang
      FROM 
         users
      WHERE 
         premium = true
   `;

   return fetchALL(QUERY)
}
const getUsersWithDuration = () => {
   const QUERY = `
      SELECT 
         id,
         chat_id,
         bot_lang
      FROM 
         users
      WHERE 
         TO_TIMESTAMP(expired_date)::DATE = CURRENT_DATE
         AND duration = true;
   `;

   return fetchALL(QUERY)
}
const editUserPremium = (id) => {
   const QUERY = `
      UPDATE
         users
      SET
         premium = false,
         duration = false
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}
const markUserAsBlocked = (id) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_blocked = true
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}
const usersRegistered = (day) => {
   const QUERY = `
      SELECT
         id,
         chat_id,
         bot_lang
      FROM
         users
      WHERE
         create_at::date = (CURRENT_DATE - INTERVAL '${day} days');
   `;

   return fetchALL(QUERY)
}
const incomeSum = (id) => {
   const QUERY = `
      SELECT 
         b.id AS balance_id,
         b.user_id,
         b.title,
         b.currency,
         SUM(h.amount)
      FROM 
         balances b
      LEFT JOIN 
         histories_balance h 
      ON 
         b.id = h.balance_id
      WHERE 
         b.user_id = $1 
         AND h.income = true
         AND b.currency = 'UZS'
         AND DATE_TRUNC('month', h.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY 
         b.id, b.user_id, b.title, b.currency
      ORDER BY 
         b.id;
   `;

   return fetch(QUERY, id)
}
const outputSum = (id) => {
   const QUERY = `
      SELECT 
         b.id AS balance_id,
         b.user_id,
         b.title,
         b.currency,
         SUM(h.amount)
      FROM 
         balances b
      LEFT JOIN 
         histories_balance h 
      ON 
         b.id = h.balance_id
      WHERE 
         b.user_id = $1 
         AND h.income = false
         AND b.currency = 'UZS'
         AND DATE_TRUNC('month', h.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY 
         b.id, b.user_id, b.title, b.currency
      ORDER BY 
         b.id;
   `;

   return fetch(QUERY, id)
}
const atmosToken = () => {
   const QUERY = `
      SELECT
         *
      FROM
         atmos_token
      ORDER BY
         id DESC;
   `;

   return fetch(QUERY)
}
const userCards = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         cards
      WHERE
         user_id = $1
      ORDER BY
         main;
   `;

   return fetchALL(QUERY, chat_id)
}
const editUserPremiumPaid = (chat_id, expirationTimestamp) => {
   const QUERY = `
      UPDATE
         users
      SET
         expired_date = $2,
         duration = true,
         premium = true
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chat_id, expirationTimestamp)
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
   getUsersBefore2day,
   getUsersBefore1day,
   getUsers,
   getUsersPremium,
   getUsersWithDuration,
   editUserPremium,
   markUserAsBlocked,
   usersRegistered,
   incomeSum,
   outputSum,
   atmosToken,
   userCards,
   editUserPremiumPaid,
   foundPartner,
   editPartnerProfit
}