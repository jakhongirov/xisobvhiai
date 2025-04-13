const model = require('./model')
const atmos = require('../../lib/atmos/atmos')
const { bot } = require('../../lib/bot')
const localText = require('../../text/text.json')
const { calculateExpiredDate } = require('../../lib/functions')

module.exports = {
   GET_TOKEN: async (_, res) => {
      try {
         const atmosGetToken = await atmos.getToken()

         return res.status(200).json(atmosGetToken)

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   ADD_CARD: async (req, res) => {
      try {
         const { chat_id } = req.params
         const { card_number, expiry } = req.body
         const checkUser = await model.checkUser(chat_id)

         if (checkUser) {
            const changeExpiry = expiry?.split('/').reverse().join('')
            const atmosToken = await model.atmosToken()
            const atmosAddCard = await atmos.bindInit(card_number, changeExpiry, atmosToken?.token, atmosToken?.expires)

            console.log(atmosAddCard)

            if (atmosAddCard?.result?.code == "OK") {
               if (atmosAddCard?.phone) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     transaction_id: atmosAddCard?.transaction_id,
                     phone: atmosAddCard?.phone
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Phone number is not exist"
                  })
               }
            } else {
               return res.status(400).json(atmosAddCard?.result)
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
   },

   OTP: async (req, res) => {
      try {
         const { chat_id } = req.params
         const { code, transaction_id } = req.body
         const checkUser = await model.checkUser(chat_id)

         if (checkUser) {
            const atmosToken = await model.atmosToken()
            const atmosOtp = await atmos.bindConfirm(
               code,
               transaction_id,
               atmosToken?.token,
               atmosToken?.expires
            )

            console.log(atmosOtp)

            if (atmosOtp?.result?.code == "OK") {
               const checkUserCards = await model.checkUserCards(chat_id)
               const addCard = await model.addCard(
                  atmosOtp?.data.pan,
                  atmosOtp?.data.expiry,
                  atmosOtp?.data.card_holder,
                  atmosOtp?.data.phone,
                  atmosOtp?.data.card_token,
                  code,
                  transaction_id,
                  chat_id,
                  checkUserCards?.length > 0 ? false : true,
                  atmosOtp?.data.card_id
               )

               if (addCard) {

                  if (checkUser.premium) {
                     return res.status(200).json({
                        status: 200,
                        message: "Add card"
                     })
                  } else {
                     const foundPartner = await model.foundPartner(checkUser?.partner_id);
                     let price;

                     if (foundPartner?.duration) {
                        price = checkUser.monthly_amount;
                     } else {
                        const foundTarif = await model.foundTarif(30);
                        price = foundTarif.price;
                     }

                     await model.editMonthlyAmount(checkUser.id, price)

                     if (price === 0) {
                        const expiredDate = await calculateExpiredDate(30)
                        const editUserPremium = await model.editUserPremium(chat_id, expiredDate)
                        const profitAmount = (price * foundPartner.profit) / 100;
                        await model.editPartnerProfit(foundPartner.id, profitAmount)

                        if (editUserPremium?.bot_lang == 'uz') {
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
                        } else if (editUserPremium?.bot_lang == "ru") {
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
                        } else if (editUserPremium?.bot_lang == "eng") {
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
                           message: "Add card"
                        })

                     } else {
                        const atmosCreatePay = await atmos.createPay(
                           price,
                           chat_id,
                           atmosToken?.token,
                           atmosToken?.expires
                        )

                        console.log(atmosCreatePay)

                        if (atmosCreatePay?.result?.code == "OK") {
                           const atmosPreApply = await atmos.preApply(
                              addCard?.card_token,
                              atmosCreatePay?.transaction_id,
                              atmosToken?.token,
                              atmosToken?.expires
                           )

                           console.log(atmosPreApply)

                           if (atmosPreApply?.result?.code == "OK") {
                              const atmosApply = await atmos.apply(
                                 atmosCreatePay?.transaction_id,
                                 atmosToken?.token,
                                 atmosToken?.expires
                              )

                              console.log(atmosApply)

                              if (atmosApply?.result?.code == "OK") {
                                 const addCheck = await model.addCheck(
                                    chat_id,
                                    atmosApply?.store_transaction?.success_trans_id,
                                    "CARD",
                                    atmosApply?.store_transaction?.amount,
                                    atmosCreatePay?.transaction_id,
                                    atmosApply?.ofd_url,
                                 )

                                 const expiredDate = await calculateExpiredDate(30)
                                 const editUserPremium = await model.editUserPremium(checkUser.id, expiredDate)
                                 const profitAmount = (price * foundPartner.profit) / 100;
                                 await model.editPartnerProfit(foundPartner.id, profitAmount)

                                 if (addCheck && editUserPremium) {
                                    if (editUserPremium?.bot_lang == 'uz') {
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
                                    } else if (editUserPremium?.bot_lang == "ru") {
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
                                    } else if (editUserPremium?.bot_lang == "eng") {
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
                                 return res.status(400).json(atmosApply.result)
                              }
                           } else {
                              return res.status(400).json(atmosPreApply.result)
                           }
                        } else {
                           return res.status(400).json(atmosCreatePay.result)
                        }
                     }
                  }

               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Card cannot add"
                  })
               }
            } else if (atmosOtp?.result?.code == "STPIMS-ERR-133") {
               let card = {}
               const foundCard = await model.foundCard(atmosOtp.data.card_id, chat_id)

               if (foundCard) {
                  card = foundCard
               } else {
                  const addCard = await model.addCard(
                     atmosOtp?.data.pan,
                     atmosOtp?.data.expiry,
                     atmosOtp?.data.card_holder,
                     atmosOtp?.data.phone,
                     atmosOtp?.data.card_token,
                     code,
                     transaction_id,
                     chat_id,
                     checkUserCards?.length > 0 ? false : true,
                     atmosOtp?.data.card_id
                  )

                  card = addCard
               }

               const foundPartner = await model.foundPartner(checkUser?.partner_id);
               let price;

               if (foundPartner?.duration) {
                  price = checkUser.monthly_amount;
               } else {
                  const foundTarif = await model.foundTarif(30);
                  price = foundTarif.price;
               }


               await model.editMonthlyAmount(checkUser.id, price)

               if (card) {
                  if (checkUser.premium) {
                     return res.status(200).json({
                        status: 200,
                        message: "Add card"
                     })
                  } else if (price === 0) {
                     const expiredDate = await calculateExpiredDate(30)
                     const editUserPremium = await model.editUserPremium(checkUser.id, expiredDate)
                     const profitAmount = (price * foundPartner.profit) / 100;
                     await model.editPartnerProfit(foundPartner.id, profitAmount)

                     if (editUserPremium?.bot_lang == 'uz') {
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
                     } else if (editUserPremium?.bot_lang == "ru") {
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
                     } else if (editUserPremium?.bot_lang == "eng") {
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
                        message: "Add card"
                     })
                  } else {
                     const atmosCreatePay = await atmos.createPay(
                        price,
                        chat_id,
                        atmosToken?.token,
                        atmosToken?.expires
                     )

                     console.log(atmosCreatePay)

                     if (atmosCreatePay?.result?.code == "OK") {
                        const atmosPreApply = await atmos.preApply(
                           card?.card_token,
                           atmosCreatePay?.transaction_id,
                           atmosToken?.token,
                           atmosToken?.expires
                        )

                        console.log(atmosPreApply)

                        if (atmosPreApply?.result?.code == "OK") {
                           const atmosApply = await atmos.apply(
                              atmosCreatePay?.transaction_id,
                              atmosToken?.token,
                              atmosToken?.expires
                           )

                           console.log(atmosApply)

                           if (atmosApply?.result?.code == "OK") {
                              const addCheck = await model.addCheck(
                                 chat_id,
                                 atmosApply?.store_transaction?.success_trans_id,
                                 "CARD",
                                 atmosApply?.store_transaction?.amount,
                                 atmosCreatePay?.transaction_id,
                                 atmosApply?.ofd_url,
                              )

                              const expiredDate = await calculateExpiredDate(30)
                              const editUserPremium = await model.editUserPremium(checkUser.id, expiredDate)
                              const profitAmount = (price * foundPartner.profit) / 100;
                              await model.editPartnerProfit(foundPartner.id, profitAmount)

                              if (addCheck && editUserPremium) {
                                 if (editUserPremium?.bot_lang == 'uz') {
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
                                 } else if (editUserPremium?.bot_lang == "ru") {
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
                                 } else if (editUserPremium?.bot_lang == "eng") {
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
                              return res.status(400).json(atmosApply.result)
                           }
                        } else {
                           return res.status(400).json(atmosPreApply.result)
                        }
                     } else {
                        return res.status(400).json(atmosCreatePay.result)
                     }
                  }
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
   },

   REMOVE_CARD: async (req, res) => {
      try {
         const {
            card_id,
            card_token
         } = req.body
         const foundCardByCard_id = await model.foundCardByCard_id(card_id)
         const atmosToken = await model.atmosToken()

         if (foundCardByCard_id) {
            const removeCard = await atmos.removeCard(
               foundCardByCard_id?.card_id,
               foundCardByCard_id?.card_token,
               atmosToken?.token,
               atmosToken?.expires
            )

            console.log(removeCard)

            if (removeCard?.result?.code == "OK") {
               await model.deleteCard(foundCardByCard_id?.card_id)

               return res.json(removeCard)
            }

         } else {
            const removeCard = await atmos.removeCard(
               card_id,
               card_token,
               atmosToken?.token,
               atmosToken?.expires
            )

            console.log(removeCard)

            if (removeCard?.result?.code == "OK") {

               return res.json(removeCard)
            }
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