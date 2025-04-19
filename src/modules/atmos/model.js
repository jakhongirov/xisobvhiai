const {
   fetch,
   fetchALL
} = require('../../lib/postgres')

const checkUser = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chat_id)
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

const checkUserCards = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         cards
      WHERE
         user_id = $1;
   `;

   return fetchALL(QUERY, chat_id)
}

const foundCard = (card_id, chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         cards
      WHERE
         user_id = $2 and card_id = $1;
   `;

   return fetch(QUERY, card_id, chat_id)
}

const addCard = (
   pan,
   expiry,
   card_holder,
   phone,
   card_token,
   code,
   transaction_id,
   chat_id,
   main,
   card_id
) => {
   const QUERY = `
      INSERT INTO
         cards (
            card_number_hash,
            expiry,
            card_holder,
            phone_number,
            card_token,
            otp,
            transaction_id,
            user_id,
            main,
            card_id
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      pan,
      expiry,
      card_holder,
      phone,
      card_token,
      code,
      transaction_id,
      chat_id,
      main,
      card_id
   )
}

const editUserPremium = (chat_id, expirationTimestamp) => {
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

const foundTarif = (period) => {
   const QUERY = `
      SELECT
         *
      FROM
         price
      WHERE
         period = $1;
   `;

   return fetch(QUERY, period)
};

const editMonthlyAmount = (id, price) => {
   const QUERY = `
      UPDATE
         users
      SET
         monthly_amount = $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, price)
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

const addCheck = (
   chat_id,
   success_trans_id,
   method,
   amount,
   transaction_id,
   ofd_url
) => {
   const QUERY = `
      INSERT INTO 
         checks (
            user_id,
            success_trans_id,
            method,
            amount,
            transaction_id,
            ofd_url
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
      chat_id,
      success_trans_id,
      method,
      amount,
      transaction_id,
      ofd_url
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

const foundCardByCard_id = (card_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         cards
      WHERE
        card_id = $1;
   `;

   return fetch(QUERY, card_id)
}

const deleteCard = (card_id) => {
   const QUERY = `
      DELETE FROM
         cards
      WHERE
        card_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, card_id)
}

module.exports = {
   atmosToken,
   checkUser,
   checkUserCards,
   foundCard,
   addCard,
   editUserPremium,
   foundPartner,
   foundTarif,
   editMonthlyAmount,
   checkUserPaid,
   editPartnerProfit,
   addCheck,
   editStep,
   foundCardByCard_id,
   deleteCard
}