const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const categories = await model.categories()

         if (categories.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Sucess",
               data: categories
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

   ADD_CATEGORY: async (req, res) => {
      try {
         const {
            name_uz,
            name_ru,
            name_en,
            emoji,
            primary
         } = req.body
         const addCategory = await model.addCategory(
            name_uz,
            name_ru,
            name_en,
            emoji,
            primary
         )

         if (addCategory) {
            return res.status(201).json({
               status: 201,
               message: "Success",
               data: addCategory
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

   EDIT_CATEGORY: async (req, res) => {
      try {
         const {
            id,
            name_uz,
            name_ru,
            name_en,
            emoji,
            primary
         } = req.body
         const editCategory = await model.editCategory(
            id,
            name_uz,
            name_ru,
            name_en,
            emoji,
            primary
         )

         if (editCategory) {
            return res.status(201).json({
               status: 201,
               message: "Success",
               data: editCategory
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

   DELETE_CATEGORY: async (req, res) => {
      try {
         const { id } = req.body
         const deleteCategory = await model.deleteCategory(id)

         if (deleteCategory) {
            return res.status(201).json({
               status: 201,
               message: "Success",
               data: deleteCategory
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