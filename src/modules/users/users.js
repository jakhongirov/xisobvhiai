const model = require('./model')
const {
   bot
} = require('../../lib/bot')

module.exports = {
   GET: async (req, res) => {
      try {
         const {
            limit,
            page,
            phone
         } = req.query

         if (limit && page) {
            const users = await model.users(limit, page, phone)

            if (users?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: users
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

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

   GET_ID: async (req, res) => {
      try {
         const {
            chat_id
         } = req.params
         const foundUser = await model.foundUser(chat_id)

         if (foundUser) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundUser
            })
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
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

   USER_STATIS: async (req, res) => {
      try {
         const allUser = await model.allUser();
         const payedUsers = await model.payedUsers();

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
               all_user: Number(allUser?.count),
               payed_user: Number(payedUsers?.count)
            }
         });

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   STATISTICS_SOURCE: async (req, res) => {
      try {
         const statisticsSource = await model.statisticsSource()

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: statisticsSource
         });

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   STATISTICS_INCREASE: async (req, res) => {
      try {
         const statisticsIncrease = await model.statisticsIncrease()

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: statisticsIncrease
         });

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   GET_SOURCE: async (req, res) => {
      try {
         const source = await model.source()

         if (source?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: source
            });
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            });
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   }
}