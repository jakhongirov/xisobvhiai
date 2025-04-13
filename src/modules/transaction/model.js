const {
   fetchALL,
   fetch
} = require('../../lib/postgres')

const transaction = (limit, page, method) => {
   const QUERY = `
      SELECT
         *
      FROM
         checks
      ${method ? (
         `
               WHERE
                  method = '${method.toUpperCase()}'
            `
      ) : ""
      }
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const totalAmount = () => {
   const QUERY = `
      SELECT
         sum(amount)
      FROM
         checks;
   `;

   return fetch(QUERY)
}
const transactionsFilter = (limit, page, month, year) => {
   const QUERY = `
      SELECT
         *
      FROM
         checks
      WHERE
         EXTRACT(MONTH FROM create_at) = $1 
         AND EXTRACT(YEAR FROM create_at) = $2
      ORDER BY
         id DESC
      LIMIT $3
      OFFSET $4;
   `;
   return fetchALL(QUERY, month, year, limit, (page - 1) * limit);
}
const transactionsAmount = (month, year) => {
   const QUERY = `
      SELECT
         sum(amount)
      FROM
         checks
      WHERE
         EXTRACT(MONTH FROM create_at) = $1 
         AND EXTRACT(YEAR FROM create_at) = $2;
   `;

   return fetch(QUERY, month, year)
}
const transactionsUserId = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         checks
      WHERE 
         user_id = $1
      ORDER BY
         id DESC;
   `;

   return fetchALL(QUERY, user_id)
}
const foundTransaction = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         checks
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const foundUser = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1
   `;

   return fetch(QUERY, user_id)
}

const statisticsMonths = () => {
   const QUERY = `
      SELECT
         TO_CHAR(month, 'Month') AS month,
         COALESCE(SUM(c.amount), 0) AS total_amount
      FROM
         GENERATE_SERIES(
            DATE_TRUNC('year', CURRENT_DATE),
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
            '1 month'
         ) AS month
      LEFT JOIN
         checks c ON DATE_TRUNC('month', c.create_at) = month
      WHERE
         EXTRACT(YEAR FROM month) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY
         month
      ORDER BY
         EXTRACT(MONTH FROM month);
   `;

   return fetchALL(QUERY)
}
const statisticsIncrease = () => {
   const QUERY = `
      WITH monthly_totals AS (
         SELECT
            DATE_TRUNC('month', create_at) AS month,
            SUM(amount) AS total_amount,
            COUNT(DISTINCT user_id) AS user_count  -- Count unique user IDs per month
         FROM
            checks
         GROUP BY
            DATE_TRUNC('month', create_at)
      ),
      all_months AS (
         SELECT
            DATE_TRUNC('month', generate_series) AS month
         FROM
            GENERATE_SERIES(
                  DATE_TRUNC('year', CURRENT_DATE),
                  DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
                  '1 month'
            ) AS generate_series
      ),
      monthly_growth AS (
         SELECT
            all_months.month,
            COALESCE(mt.total_amount, 0) AS total_amount,
            COALESCE(mt.user_count, 0) AS user_count,  -- Use COALESCE to set missing counts to 0
            LAG(COALESCE(mt.total_amount, 0)) OVER (ORDER BY all_months.month) AS previous_total
         FROM
            all_months
         LEFT JOIN
            monthly_totals mt ON all_months.month = mt.month
      )
      SELECT
         TO_CHAR(month, 'Month') AS month,
         total_amount,
         user_count,  -- Display the count of unique users
         CASE
            WHEN previous_total = 0 OR total_amount = 0 THEN NULL
            ELSE ROUND(((total_amount - previous_total) * 100.0 / previous_total), 2)
         END AS percentage_increase
      FROM
         monthly_growth
      ORDER BY
         EXTRACT(MONTH FROM month);
   `;

   return fetchALL(QUERY)
}

module.exports = {
   transaction,
   totalAmount,
   transactionsFilter,
   transactionsAmount,
   transactionsUserId,
   foundTransaction,
   foundUser,
   statisticsMonths,
   statisticsIncrease
}