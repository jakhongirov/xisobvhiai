const {
   fetch,
   fetchALL
} = require('../postgres')

const getUsersBefore2day = () => {
   const QUERY = `
      SELECT 
         id
         chat_id
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
         chat_id
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
         chat_id
      FROM 
         users
      WHERE 
         TO_TIMESTAMP(expired_date)::DATE = CURRENT_DATE
   `;

   return fetchALL(QUERY)
}
const editUserPremium = (id) => {
   const QUERY = `
      UPDATE
         users
      SET
         premium = false
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   getUsersBefore2day,
   getUsersBefore1day,
   getUsers,
   editUserPremium
}