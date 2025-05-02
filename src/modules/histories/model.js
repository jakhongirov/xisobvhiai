const { fetch, fetchALL } = require('../../lib/postgres')

const reportList = (limit, page, user_id) => {
   const offset = (page - 1) * limit;
   let filterClause = '';

   if (user_id) {
      filterClause = `WHERE u.chat_id = ${user_id}`;
   }

   const QUERY = `
      SELECT
         h.id,
         h.amount,
         h.date,
         h.comment,
         h.category_id,
         c.name_uz AS category_name,
         b.currency,
         h.income,
         u.chat_id AS user_id,
         h.create_at
      FROM
         histories_balance h
      JOIN users u ON u.id = h.user_id
      JOIN categories c ON c.id = h.category_id
      JOIN balances b ON b.id = h.balance_id
      ${filterClause}
      ORDER BY h.id DESC
      LIMIT $1 OFFSET $2;
   `;

   return fetchALL(QUERY, limit, offset);
};
const debtsList = (limit, page, user_id) => {
   const offset = (page - 1) * limit;
   let filterClause = '';

   if (user_id) {
      filterClause = `WHERE u.chat_id = ${user_id}`;
   }

   const QUERY = `
      SELECT
         d.id,
         u.chat_id AS user_id,
         d.deadline,
         d.amount,
         d.given_date AS date,
         d.income,
         b.currency,
         d.create_at
      FROM
         debt d
      JOIN users u ON u.id = d.user_id
      JOIN balances b ON b.id = d.balance_id
      ${filterClause}
      ORDER BY d.id DESC
      LIMIT $1 OFFSET $2;
   `;

   return fetchALL(QUERY, limit, offset);
};
const foundReport = (id) => {
   const QUERY = `
      SELECT
         h.id,
         h.amount,
         h.date,
         h.comment,
         h.category_id,
         c.name_uz AS category_name,
         b.currency,
         h.income,
         u.chat_id AS user_id,
         h.create_at
      FROM
         histories_balance h
      JOIN users u ON u.id = h.user_id
      JOIN categories c ON c.id = h.category_id
      JOIN balances b ON b.id = h.balance_id
      WHERE h.id = $1;
   `;

   return fetch(QUERY, id)
}
const foundDebt = (id) => {
   const QUERY = `
      SELECT
         d.id,
         u.chat_id AS user_id,
         d.deadline,
         d.amount,
         d.given_date AS date,
         d.income,
         b.currency,
         d.create_at
      FROM
         debt d
      JOIN users u ON u.id = d.user_id
      JOIN balances b ON b.id = d.balance_id
      WHERE d.id = $1;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   reportList,
   debtsList,
   foundReport,
   foundDebt
}