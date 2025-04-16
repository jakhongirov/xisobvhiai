const model = require('./model')
const atmos = require('../../lib/atmos/atmos')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const cardsList = await model.cardsList(limit, page)

            if (cardsList.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Sucess",
                  data: cardsList
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

   DELETE_CARD: async (req, res) => {
      try {
         const { id } = req.body
         const foundCard = await model.foundCard(id)
         const atmosToken = await model.atmosToken()

         if (foundCard) {
            const removeCard = await atmos.removeCard(
               foundCard?.card_id,
               foundCard?.card_token,
               atmosToken?.token,
               atmosToken?.expires
            )

            if (removeCard?.result?.code == "OK") {
               const deleteCard = await model.deleteCard(foundCard?.card_id)

               if (deleteCard) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success"
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }

            }

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
   }
}