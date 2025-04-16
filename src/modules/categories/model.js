const {
   fetch,
   fetchALL
} = require('../../lib/postgres')

const categories = () => {
   const QUERY = `
      SELECT
         *
      FROM
         categories
      ORDER BY
         id DESC;
   `;

   return fetchALL(QUERY)
}
const addCategory = (
   name_uz,
   name_ru,
   name_en,
   emoji,
   primary
) => {
   const QUERY = `
      INSERT INTO
         categories (
            name_uz,
            name_ru,
            name_en,
            emoji,
            "primary"
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
      name_uz,
      name_ru,
      name_en,
      emoji,
      primary
   )
}
const editCategory = (
   id,
   name_uz,
   name_ru,
   name_en,
   emoji,
   primary
) => {
   const QUERY = `
      UPDATE
         categories
      SET
         name_uz = $2,
         name_ru = $3,
         name_en = $4,
         emoji = $5,
         "primary" = $6
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      name_uz,
      name_ru,
      name_en,
      emoji,
      primary
   )
}
const deleteCategory = (id) => {
   const QUERY = `
      DELETE FROM
         categories
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   categories,
   addCategory,
   editCategory,
   deleteCategory
}