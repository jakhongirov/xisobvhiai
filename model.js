const {
   fetch,
   fetchALL
} = require('./src/lib/postgres')

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
const foundPartnerName = (partnerName) => {
   const QUERY = `
      SELECT
         *
      FROM
         partners
      WHERE
         name = $1;
   `;

   return fetch(QUERY, partnerName)
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
}
const createUser = (
   chatId,
   step,
   partner_id,
   partner_name,
   source
) => {
   const QUERY = `
      INSERT INTO
         users (
            chat_id,
            bot_step,
            partner_id,
            partner_name,
            source
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      chatId,
      step,
      partner_id,
      partner_name,
      source
   )
}
const addLang = (chatId, lang) => {
   const QUERY = `
      UPDATE
         users
      SET
         bot_lang = $2
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chatId, lang)
}
const createBalance = (
   user_id,
   title,
   currency
) => {
   const QUERY = `
      INSERT INTO
         balances (
            user_id,
            title,
            currency
         ) VALUES (
            $1,
            $2,
            $3
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      title,
      currency
   )
}
const editStep = (chatId, step) => {
   const QUERY = `
      UPDATE
         users
      SET
         bot_step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, step)
}
const addPhoneUser = (chatId, phoneNumber) => {
   const QUERY = `
      UPDATE
         users
      SET
         phone_number = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, phoneNumber)
}
const addName = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         name = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const priceList = (lang) => {
   const titleColumn =
      lang === 'uz'
         ? 'title_uz'
         : lang === 'ru'
            ? 'title_ru'
            : lang === 'eng'
               ? 'title_eng'
               : 'title_uz';

   const QUERY = `
      SELECT
      *,
      ${titleColumn ? `${titleColumn} AS title` : ''} 
      FROM
      price
      ORDER BY
      sort_order;
   `;

   return fetchALL(QUERY)
}
const foundTarif = (id, lang) => {
   const titleColumn =
      lang === 'uz'
         ? 'title_uz'
         : lang === 'ru'
            ? 'title_ru'
            : lang === 'eng'
               ? 'title_eng'
               : 'title_uz';

   const QUERY = `
      SELECT
         id,
         ${titleColumn ? `${titleColumn} AS title,` : ''} 
         period,
         price
      FROM
         price
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const monthlyInput = (id, currentMonth) => {
   const QUERY = `
      SELECT 
         h.balance_id,
         SUM(h.amount),
         b.currency,
         b.title
      FROM 
         histories_balance h
      JOIN
         balances b
      ON
         h.balance_id = b.id
      WHERE 
         EXTRACT(YEAR FROM h.date::date) = 
            CASE 
               WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= $2 
               THEN EXTRACT(YEAR FROM CURRENT_DATE) 
               ELSE EXTRACT(YEAR FROM CURRENT_DATE) - 1 
            END
         AND EXTRACT(MONTH FROM h.date::date) = $2
         AND h.income = TRUE 
         AND h.user_id = $1
      GROUP BY
         h.balance_id, b.currency, b.title
      ORDER BY
         h.balance_id; 
   `;

   return fetchALL(QUERY, id, currentMonth)
}
const monthlyOutput = (id, currentMonth) => {
   const QUERY = `
      SELECT 
         h.balance_id,
         SUM(h.amount),
         b.currency,
         b.title
      FROM 
         histories_balance h
      JOIN
         balances b
      ON
         h.balance_id = b.id
      WHERE 
         EXTRACT(YEAR FROM h.date::date) = 
            CASE 
               WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= $2 
               THEN EXTRACT(YEAR FROM CURRENT_DATE) 
               ELSE EXTRACT(YEAR FROM CURRENT_DATE) - 1 
            END
         AND EXTRACT(MONTH FROM h.date::date) = $2
         AND h.income = FALSE 
         AND h.user_id = $1
      GROUP BY
         h.balance_id, b.currency, b.title
      ORDER BY
         h.balance_id; 
   `;

   return fetchALL(QUERY, id, currentMonth)
}
const monthlyByCategories = (id, currentMonth) => {
   const QUERY = `
      SELECT 
         h.balance_id,
         SUM(h.amount) AS amount,
         b.currency,
         b.title,
         c.name_uz as name,
         c.id,
         h.income
      FROM 
         histories_balance h
      JOIN 
         balances b ON h.balance_id = b.id
      JOIN 
         categories c ON c.id = h.category_id
      WHERE 
         EXTRACT(YEAR FROM h.date::date) = 
            CASE 
                  WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= $2 
                  THEN EXTRACT(YEAR FROM CURRENT_DATE) 
                  ELSE EXTRACT(YEAR FROM CURRENT_DATE) - 1 
            END
         AND EXTRACT(MONTH FROM h.date::date) = $2
         AND h.user_id = $1
      GROUP BY 
         h.balance_id, b.currency, b.title, c.id, c.name_uz, h.income
      ORDER BY 
         h.balance_id;
   `;

   return fetchALL(QUERY, id, currentMonth)
}
const userBalances = (id) => {
   const QUERY = `
      SELECT 
         b.id AS balance_id,
         b.user_id,
         b.title,
         b.currency,
         COALESCE(SUM(CASE WHEN h.income = true THEN h.amount ELSE 0 END), 0) 
         - COALESCE(SUM(CASE WHEN h.income = false THEN h.amount ELSE 0 END), 0) 
         AS total_balance
      FROM 
         balances b
      LEFT JOIN 
         histories_balance h 
      ON 
         b.id = h.balance_id
      WHERE 
         b.user_id = $1
      GROUP BY 
         b.id, b.user_id, b.title, b.currency
      ORDER BY 
         b.id;
   `;

   return fetchALL(QUERY, id)
}
const debtsList = (id) => {
   const QUERY = `
      SELECT
         d.id,
         b.currency,
         d.name,
         d.deadline,
         d.amount,
         d.estimate,
         d.given_date
      FROM
         debt d
      JOIN
         balances b
      ON
         d.balance_id = b.id
      WHERE
         d.user_id = $1
      ORDER BY
         d.id DESC;
   `;

   return fetchALL(QUERY, id)
}
const historiesBalanceCurrentMonthOutcome = (id, currentMonth) => {
   const QUERY = `
      SELECT 
         h.id,
         h.amount,
         h.date,
         h.income,
         h.comment,
         b.currency,
         b.title,
         c.name_uz as name
      FROM 
         histories_balance h
      JOIN
         balances b
      ON
         h.balance_id = b.id
      JOIN
         categories c
      ON
         c.id = h.category_id
      WHERE 
         EXTRACT(YEAR FROM h.date::date) = 
            CASE 
               WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= $2 
               THEN EXTRACT(YEAR FROM CURRENT_DATE) 
               ELSE EXTRACT(YEAR FROM CURRENT_DATE) - 1 
            END
         AND EXTRACT(MONTH FROM h.date::date) = $2
         AND h.user_id = $1 AND h.income = false
      ORDER BY
         h.id;
   `;

   return fetchALL(QUERY, id, currentMonth)
}
const historiesBalanceCurrentMonthIncome = (id, currentMonth) => {
   const QUERY = `
      SELECT 
         h.id,
         h.amount,
         h.date,
         h.income,
         h.comment,
         b.currency,
         b.title,
         c.name_uz as name
      FROM 
         histories_balance h
      JOIN
         balances b
      ON
         h.balance_id = b.id
      JOIN
         categories c
      ON
         c.id = h.category_id
      WHERE 
         EXTRACT(YEAR FROM h.date::date) = 
            CASE 
               WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= $2 
               THEN EXTRACT(YEAR FROM CURRENT_DATE) 
               ELSE EXTRACT(YEAR FROM CURRENT_DATE) - 1 
            END
         AND EXTRACT(MONTH FROM h.date::date) = $2
         AND h.user_id = $1 AND h.income = true
      ORDER BY
         h.id;
   `;

   return fetchALL(QUERY, id, currentMonth)
}
const foundBalance = (id, currency) => {
   const QUERY = `
      SELECT
         *
      FROM
         balances
      WHERE
         user_id = $1 AND currency = $2;
   `;

   return fetch(QUERY, id, currency)
}
const foundCategory = (name) => {
   const QUERY = `
      SELECT
         *,
         name_uz as name
      FROM
         categories
      WHERE
         name_uz = $1;
   `;

   return fetch(QUERY, name)
}
const addReport = (
   user_id,
   balance_id,
   category_id,
   date,
   amount,
   type,
   comment
) => {
   const QUERY = `
      INSERT INTO
         histories_balance (
            user_id,
            balance_id,
            category_id,
            date,
            amount,
            income,
            comment
         ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            $5,
            $6,
            $7
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      balance_id,
      category_id,
      date,
      amount,
      type,
      comment
   )
}
const addDebt = (
   user_id,
   balance_id,
   forWhom,
   amount,
   deadline,
   date,
) => {
   const QUERY = `
      INSERT INTO
         debt (
            user_id,
            balance_id,
            name,
            amount,
            deadline,
            given_date
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      balance_id,
      forWhom,
      amount,
      deadline,
      date
   )
}
const deleteReport = (reportid, user_id) => {
   const QUERY = `
      DELETE FROM
         histories_balance
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

   return fetch(QUERY, reportid, user_id)
}
const deleteDebt = (debtid, user_id) => {
   const QUERY = `
      DELETE FROM
         debt
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

   return fetch(QUERY, debtid, user_id)
}
const editUsedFree = (chatId) => {
   const QUERY = `
      UPDATE
         users
      SET
         used_free = true
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId)
}
const editPremium = (chatId, expiredDate) => {
   const QUERY = `
      UPDATE
         users
      SET
         expired_date = $2,
         premium = true
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, expiredDate)
}
const addLimitAmount = (chatId, limit) => {
   const QUERY = `
      UPDATE
         users
      SET
         limit_amount = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, limit)
}
const addMonthlyAmount = (chatId, price) => {
   const QUERY = `
      UPDATE
         users
      SET
         monthly_amount = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, price)
}
const editDuration = (chatId, duration) => {
   const QUERY = `
      UPDATE
         users
      SET
         duration = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, duration)
}
const userCard = (chatId) => {
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

   return fetchALL(QUERY, chatId)
}
const categories = () => {
   const QUERY = `
      SELECT
         name_uz as name
      FROM
         categories
      ORDER BY
         id;
   `;

   return fetch(QUERY)
}

module.exports = {
   foundUser,
   foundPartnerName,
   foundPartner,
   createUser,
   addLang,
   createBalance,
   editStep,
   addPhoneUser,
   addName,
   priceList,
   foundTarif,
   monthlyInput,
   monthlyOutput,
   monthlyByCategories,
   userBalances,
   debtsList,
   historiesBalanceCurrentMonthOutcome,
   historiesBalanceCurrentMonthIncome,
   foundBalance,
   foundCategory,
   addReport,
   addDebt,
   deleteReport,
   deleteDebt,
   editUsedFree,
   editPremium,
   addLimitAmount,
   addMonthlyAmount,
   editDuration,
   userCard,
   categories
}