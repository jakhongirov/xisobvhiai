const { fetch, fetchALL } = require('../../lib/postgres')

const cardsList = (limit, page) => {
   const QUERY = `
      SELECT 
         *
      FROM
         cards
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
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
const foundCard = (id) => {
   const QUERY = `
      SELECT 
         *
      FROM
         cards
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const deleteCard = (card_id) => {
   const QUERY = `
      DELETE FROM
         cards
      WHERE
         card_id = $1;
   `;

   return fetch(QUERY, card_id)
}

module.exports = {
   cardsList,
   atmosToken,
   foundCard,
   deleteCard
}