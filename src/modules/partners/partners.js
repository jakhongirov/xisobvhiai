const model = require('./model')

module.exports = {
   GET_LIST: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const partnersList = await model.partnersList(limit, page)

            if (partnersList?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: partnersList
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
         const { id } = req.params
         const foundPartner = await model.foundPartner(id)

         if (foundPartner) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundPartner
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

   ADD_PARTNER: async (req, res) => {
      try {
         const {
            name,
            phone_number,
            discount,
            additional,
            profit,
            duration
         } = req.body

         const addPartner = await model.addPartner(
            name,
            phone_number,
            discount,
            additional,
            profit,
            duration
         )

         if (addPartner) {
            return res.status(201).json({
               status: 201,
               message: "Success",
               data: addPartner
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

   EDIT_PARTNER: async (req, res) => {
      try {
         const {
            id,
            name,
            phone_number,
            discount,
            additional,
            profit,
            duration
         } = req.body

         const editPartner = await model.editPartner(
            id,
            name,
            phone_number,
            discount,
            additional,
            profit,
            duration
         )

         if (editPartner) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editPartner
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

   DELETE_PARTNER: async (req, res) => {
      try {
         const { id } = req.body
         const deletePartner = await model.deletePartner(id)

         if (deletePartner) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deletePartner
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