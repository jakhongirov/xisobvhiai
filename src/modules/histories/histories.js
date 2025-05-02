const model = require('./model')

module.exports = {
   GET_REPORTS: async (req, res) => {
      try {
         const { limit, page, user_id } = req.query

         if (limit && page) {
            const reportList = await model.reportList(limit, page, user_id)

            return res.status(200).json({
               status: 200,
               message: "Success",
               data: reportList
            })

         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_DEBTS: async (req, res) => {
      try {
         const { limit, page, user_id } = req.query

         if (limit && page) {
            const debtsList = await model.debtsList(limit, page, user_id)

            return res.status(200).json({
               status: 200,
               message: "Success",
               data: debtsList
            })

         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_REPORT_ID: async (req, res) => {
      try {
         const { id } = req.params

         const foundReport = await model.foundReport(id)

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: foundReport
         })

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_DEBT_ID: async (req, res) => {
      try {
         const { id } = req.params

         const foundDebt = await model.foundDebt(id)

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: foundDebt
         })

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}