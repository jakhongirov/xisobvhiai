const model = require('./model')
const { calculateExpiredDate } = require('../../lib/functions')
const { bot } = require('../../lib/bot')
const localText = require('../../text/text.json')

module.exports = {
   CHECK: async (req, res) => {
      try {
         const { chat_id, tarif, amount } = req.params
         const foundUser = await model.foundUser(chat_id)
         const foundTarif = await model.foundTarif(tarif)

         console.log(req.params)
         console.log(foundUser)
         console.log(foundTarif)

         if (foundUser && foundTarif) {
            if (foundTarif.price == amount) {
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

         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

      } catch (error) {
         console.log(error)
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   SUCCESS: async (req, res) => {
      try {
         const { chat_id, tarif, method, trans_id, amount } = req.params
         const foundUser = await model.foundUser(chat_id)
         const foundTarif = await model.foundTarif(tarif)

         if (foundUser) {
            const expiredDate = await calculateExpiredDate(Number(foundTarif.period))
            const editUserPremium = await model.editUserPremium(foundUser.id, expiredDate)

            console.log('success');
            console.log(expiredDate);
            console.log(editUserPremium);


            if (editUserPremium) {
               await model.addCheck(chat_id, method, trans_id, amount)

               if (foundUser?.bot_lang == 'uz') {
                  bot.sendMessage(chat_id, localText.successfullyPaidUz, {
                     parse_mode: "HTML",
                     reply_markup: {
                        keyboard: [
                           [
                              {
                                 text: localText.reportsBtnUz
                              },
                              {
                                 text: localText.debtBtnUz
                              },
                           ],
                           [
                              {
                                 text: localText.balancesBtnUz
                              },
                              {
                                 text: localText.limitBtnUz
                              }
                           ],
                           [
                              {
                                 text: localText.usageInformationBtnUz
                              },
                              {
                                 text: localText.premiumBtnUz
                              }
                           ]
                        ],
                        resize_keyboard: true,
                     }
                  }).then(async () => {
                     await model.editStep(chat_id, 'menu')
                  })
               } else if (foundUser?.bot_lang == "ru") {
                  bot.sendMessage(chat_id, localText.successfullyPaidRu, {
                     parse_mode: "HTML",
                     reply_markup: {
                        keyboard: [
                           [
                              {
                                 text: localText.reportsBtnRu
                              },
                              {
                                 text: localText.debtBtnRu
                              },
                           ],
                           [
                              {
                                 text: localText.balancesBtnRu
                              },
                              {
                                 text: localText.limitBtnRu
                              }
                           ],
                           [
                              {
                                 text: localText.usageInformationBtnRu
                              },
                              {
                                 text: localText.premiumBtnRu
                              }
                           ]
                        ],
                        resize_keyboard: true,
                     }
                  }).then(async () => {
                     await model.editStep(chat_id, 'menu')
                  })
               } else if (foundUser?.bot_lang == "eng") {
                  bot.sendMessage(chat_id, localText.successfullyPaidEng, {
                     parse_mode: "HTML",
                     reply_markup: {
                        keyboard: [
                           [
                              {
                                 text: localText.reportsBtnEng
                              },
                              {
                                 text: localText.debtBtnEng
                              },
                           ],
                           [
                              {
                                 text: localText.balancesBtnEng
                              },
                              {
                                 text: localText.limitBtnEng
                              }
                           ],
                           [
                              {
                                 text: localText.usageInformationBtnEng
                              },
                              {
                                 text: localText.premiumBtnEng
                              }
                           ]
                        ],
                        resize_keyboard: true,
                     }
                  }).then(async () => {
                     await model.editStep(chat_id, 'menu')
                  })
               }

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

         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }


      } catch (error) {
         console.log(error)
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }

}