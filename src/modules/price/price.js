const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const priceList = await model.priceList()

         if (priceList.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: priceList
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

   ADD_PRICE: async (req, res) => {
      try {
         const {
            title_uz,
            title_ru,
            title_eng,
            period,
            price,
            sort_order
         } = req.body
         const addPrice = await model.addPrice(
            title_uz,
            title_ru,
            title_eng,
            period,
            price,
            sort_order
         )

         if (addPrice) {
            return res.status(201).json({
               status: 201,
               message: "Success",
               data: addPrice
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

   EDIT_PRICE: async (req, res) => {
      try {
         const {
            id,
            title_uz,
            title_ru,
            title_eng,
            period,
            price,
            sort_order
         } = req.body
         const editPrice = await model.editPrice(
            id,
            title_uz,
            title_ru,
            title_eng,
            period,
            price,
            sort_order
         )

         if (editPrice) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editPrice
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

   DELETE_PRICE: async (req, res) => {
      try {
         const { id } = req.body
         const deletePrice = await model.deletePrice(id)

         if (deletePrice) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deletePrice
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
   }
}