const express = require("express")
const router = express.Router()

//Middlawares
const {
   AUTH
} = require('../middleware/auth')
const FileUpload = require('../middleware/multer')

// files
const payment = require('./payment/payment')

router
   //  PAYMENT
   .get('/payment/check/:chat_id/:tarif/:amount', payment.CHECK)
   .get('/payment/success/:chat_id/:tarif', payment.SUCCESS)

module.exports = router