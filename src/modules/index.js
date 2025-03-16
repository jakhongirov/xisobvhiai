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
   .get('/payment/check', payment.CHECK)
   .get('/payment/success', payment.SUCCESS)

module.exports = router