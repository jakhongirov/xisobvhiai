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

module.exports = {
   cardsList,
   atmosToken
}