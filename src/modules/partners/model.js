const {
   fetchALL,
   fetch
} = require('../../lib/postgres')

const partnersList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         partners
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}

const foundPartner = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         partners
      WHERE
         id = $1;
   `;

   return fetchALL(QUERY, id)
}

const addPartner = (
   name,
   phone_number,
   discount,
   additional,
   profit,
   duration
) => {
   const QUERY = `
      INSERT INTO
         partners (
            name,
            phone_number,
            discount,
            additional,
            profit,
            duration
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
      name,
      phone_number,
      discount,
      additional,
      profit,
      duration
   )
}

const editPartner = (
   id,
   name,
   phone_number,
   discount,
   additional,
   profit,
   duration
) => {
   const QUERY = `
      UPDATE
         partners
      SET
         name = $2,
         phone_number = $3,
         discount = $4,
         additional = $5,
         profit = $6,
         duration = $7
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      name,
      phone_number,
      discount,
      additional,
      profit,
      duration
   )
}

const deletePartner = (id) => {
   const QUERY = `
      DELETE FROM
         partners
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   partnersList,
   foundPartner,
   addPartner,
   editPartner,
   deletePartner
}