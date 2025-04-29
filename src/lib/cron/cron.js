const model = require('./model')
const {
   bot
} = require('../bot')
const localText = require('../../text/text.json')
const { formatBalanceWithSpaces, calculateExpiredDate } = require('../functions')
const atmos = require('../atmos/atmos')

const sendMessageBefore = async () => {
   try {
      const getUsersBefore2day = await model.getUsersBefore2day()
      const getUsersBefore1day = await model.getUsersBefore1day()
      const getUsers = await model.getUsers()

      if (getUsersBefore2day?.length > 0) {
         for (const user of getUsersBefore2day) {
            if (user?.bot_lang == 'uz') {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore2dayUz)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            } else if (user?.bot_lang == 'ru') {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore2dayRu)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            } else if (user?.bot_lang == 'eng') {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore2dayEng)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            } else {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore2dayUz)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            }
         }
      }

      if (getUsersBefore1day?.length > 0) {
         for (const user of getUsersBefore1day) {
            if (user?.bot_lang == 'uz') {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore1dayUz)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            } else if (user?.bot_lang == 'ru') {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore1dayRu)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            } else if (user?.bot_lang == 'eng') {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore1dayEng)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            } else {
               bot.sendMessage(user?.chat_id, localText.cronTextBefore1dayUz)
                  .catch(async err => {
                     console.error('Error sending message:', err)
                     if (err.response && err.response.statusCode === 403) {
                        // User blocked the bot
                        await model.markUserAsBlocked(user?.id)
                     }
                  })
            }
         }
      }

      if (getUsers?.length > 0) {
         for (const user of getUsers) {
            if (user?.bot_lang == 'uz') {
               bot.sendMessage(user?.chat_id, localText.cronTextStopedUz).then(async () => {
                  await model.editUserPremium(user?.id)
               }).catch(async err => {
                  console.error('Error sending message:', err)
                  if (err.response && err.response.statusCode === 403) {
                     // User blocked the bot
                     await model.markUserAsBlocked(user?.id)
                  }
               })
            } else if (user?.bot_lang == 'ru') {
               bot.sendMessage(user?.chat_id, localText.cronTextStopedRu).then(async () => {
                  await model.editUserPremium(user?.id)
               }).catch(async err => {
                  console.error('Error sending message:', err)
                  if (err.response && err.response.statusCode === 403) {
                     // User blocked the bot
                     await model.markUserAsBlocked(user?.id)
                  }
               })
            } else if (user?.bot_lang == 'eng') {
               bot.sendMessage(user?.chat_id, localText.cronTextStopedEng).then(async () => {
                  await model.editUserPremium(user?.id)
               }).catch(async err => {
                  console.error('Error sending message:', err)
                  if (err.response && err.response.statusCode === 403) {
                     // User blocked the bot
                     await model.markUserAsBlocked(user?.id)
                  }
               })
            } else {
               bot.sendMessage(user?.chat_id, localText.cronTextStopedUz).then(async () => {
                  await model.editUserPremium(user?.id)
               }).catch(async err => {
                  console.error('Error sending message:', err)
                  if (err.response && err.response.statusCode === 403) {
                     // User blocked the bot
                     await model.markUserAsBlocked(user?.id)
                  }
               })
            }
         }
      }
   } catch (error) {
      console.log(error)
   }
}

const sendMessageMorning = async () => {
   try {
      const getUsersPremium = await model.getUsersPremium()

      if (getUsersPremium?.length > 0) {
         for (const user of getUsersPremium) {
            if (user?.bot_lang == 'uz') {
               bot.sendMessage(user?.chat_id, localText.cronTextMorningPremiumUz)
            } else if (user?.lang == 'ru') {
               bot.sendMessage(user?.chat_id, localText.cronTextMorningPremiumRu)
            } else if (user?.lang == 'eng') {
               bot.sendMessage(user?.chat_id, localText.cronTextMorningPremiumEng)
            } else {
               bot.sendMessage(user?.chat_id, localText.cronTextMorningPremiumUz)
            }
         }
      }

   } catch (error) {
      console.log(error)
   }
}

const sendMessageAfternoon = async () => {
   try {
      const getUsersPremium = await model.getUsersPremium()

      if (getUsersPremium?.length > 0) {
         for (const user of getUsersPremium) {
            if (user?.bot_lang == 'uz') {
               bot.sendMessage(user?.chat_id, localText.cronTextAfternoonPremiumUz)
            } else if (user?.lang == 'ru') {
               bot.sendMessage(user?.chat_id, localText.cronTextAfternoonPremiumRu)
            } else if (user?.lang == 'eng') {
               bot.sendMessage(user?.chat_id, localText.cronTextAfternoonPremiumEng)
            } else {
               bot.sendMessage(user?.chat_id, localText.cronTextAfternoonPremiumUz)
            }
         }
      }

   } catch (error) {
      console.log(error)
   }
}

const sendMessageNight = async () => {
   try {
      const getUsersPremium = await model.getUsersPremium()

      if (getUsersPremium?.length > 0) {
         for (const user of getUsersPremium) {
            const incomeSum = await model.incomeSum(user.id)
            const outputSum = await model.outputSum(user.id)

            if (user?.bot_lang == 'uz') {
               if (Number(user?.limit_amount) > 0) {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronTextNightPremiumUz
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                        .replace(/%limit%/g, formatBalanceWithSpaces(Number(user?.limit_amount - outputSum.sum)))
                  )
               } else {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronText2NightPremiumUz
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                  )
               }
            } else if (user?.lang == 'ru') {
               if (Number(user?.limit_amount) > 0) {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronTextNightPremiumRu
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                        .replace(/%limit%/g, formatBalanceWithSpaces(Number(user?.limit_amount - outputSum.sum)))
                  )
               } else {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronText2NightPremiumRu
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                  )
               }
            } else if (user?.lang == 'eng') {
               if (Number(user?.limit_amount) > 0) {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronTextNightPremiumEng
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                        .replace(/%limit%/g, formatBalanceWithSpaces(Number(user?.limit_amount - outputSum.sum)))
                  )
               } else {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronText2NightPremiumEng
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                  )
               }
            } else {
               if (Number(user?.limit_amount) > 0) {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronTextNightPremiumUz
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                        .replace(/%limit%/g, formatBalanceWithSpaces(Number(user?.limit_amount - outputSum.sum)))
                  )
               } else {
                  bot.sendMessage(
                     user?.chat_id,
                     localText.cronText2NightPremiumUz
                        .replace(/%output%/g, formatBalanceWithSpaces(outputSum?.sum ?? 0))
                        .replace(/%income%/g, formatBalanceWithSpaces(incomeSum?.sum ?? 0))
                  )
               }
            }
         }
      }

   } catch (error) {
      console.log(error)
   }
}

const sendMessageAdvice = async () => {
   try {
      const usersRegisteredfor5days = await model.usersRegistered(5)
      const usersRegisteredfor4days = await model.usersRegistered(4)
      const usersRegisteredfor3days = await model.usersRegistered(3)
      const usersRegisteredfor2days = await model.usersRegistered(2)
      const usersRegisteredfor1days = await model.usersRegistered(1)
      const priceMonthly = await model.priceMonthly()

      if (usersRegisteredfor5days.length > 0) {
         for (const user of usersRegisteredfor5days) {
            if (user.bot_lang == 'uz') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister5dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'ru') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister5dayRu.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnRu,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'eng') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister5dayEng.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnEng,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister5dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            }
         }
      }

      if (usersRegisteredfor4days.length > 0) {
         for (const user of usersRegisteredfor4days) {
            if (user.bot_lang == 'uz') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister4dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'ru') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister4dayRu.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnRu,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'eng') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister4dayEng.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnEng,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister4dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            }
         }
      }

      if (usersRegisteredfor3days.length > 0) {
         for (const user of usersRegisteredfor3days) {
            if (user.bot_lang == 'uz') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister3dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'ru') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister3dayRu.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnRu,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'eng') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister3dayEng.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnEng,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister3dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            }
         }
      }

      if (usersRegisteredfor2days.length > 0) {
         for (const user of usersRegisteredfor2days) {
            if (user.bot_lang == 'uz') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister2dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'ru') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister2dayRu.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnRu,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'eng') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister2dayEng.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnEng,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister2dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            }
         }
      }

      if (usersRegisteredfor1days.length > 0) {
         for (const user of usersRegisteredfor1days) {
            if (user.bot_lang == 'uz') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister1dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'ru') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister1dayRu.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnRu,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else if (user.bot_lang == 'eng') {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister1dayEng.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnEng,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            } else {
               bot.sendMessage(user.chat_id,
                  localText.cronTextRegister1dayUz.replace(/%price%/g, formatBalanceWithSpaces(Number(priceMonthly.price))), {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cronTextRegisterBtnUz,
                              callback_data: "to_buy"
                           }
                        ]
                     ]
                  }
               })
            }
         }
      }
   } catch (error) {
      console.log(error)
   }
}

const pay = async (user, userCard) => {
   const atmosToken = await model.atmosToken()


   const createPay = await atmos.createPay(
      Number(user.monthly_amount),
      user?.chat_id,
      atmosToken?.token,
      atmosToken?.expires
   )

   console.log(createPay)

   if (createPay?.result?.code == "OK") {
      const preApply = await atmos.preApply(
         userCard?.card_token,
         createPay?.transaction_id,
         atmosToken?.token,
         atmosToken?.expires
      )
      console.log(preApply)

      if (preApply?.result?.code == "OK") {
         const apply = await atmos.apply(
            createPay?.transaction_id,
            atmosToken?.token,
            atmosToken?.expires
         )
         console.log(apply)


         if (apply?.result?.code == "OK") {
            const addCheck = await model.addCheck(
               user?.chat_id,
               apply?.store_transaction?.success_trans_id,
               "ATMOS",
               Number(apply?.store_transaction?.amount / 100),
               createPay?.transaction_id,
               apply?.ofd_url
            )

            const expiredDate = await calculateExpiredDate(30)
            const editUserPremium = await model.editUserPremiumPaid(user.chat_id, expiredDate)
            const foundPartner = await model.foundPartner(user?.partner_id);
            const profitAmount = (price * foundPartner.profit) / 100;
            await model.editPartnerProfit(foundPartner.id, profitAmount)

            if (addCheck && editUserPremium) {
               return "Success"
            }
         } else {
            console.log(apply)
            return "Error"
         }
      } else {
         console.log(preApply)
         return "Error"

      }
   } else {
      console.log(createPay)
      return "Error"
   }
}

const paySubcribe = async () => {
   const getUsers = await model.getUsersWithDuration()

   if (getUsers.length < 0) {
      for (const user of getUsers) {
         if (user?.monthly_amount == 0) {
            const expiredDate = await calculateExpiredDate(30)
            const editUserPremium = await model.editUserPremiumPaid(user.chat_id, expiredDate)

            if (editUserPremium?.bot_lang == 'uz') {
               bot.sendMessage(editUserPremium.chat_id, localText.successfullyPaidUz, {
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
                  await model.editStep(editUserPremium.chat_id, 'menu')
               })
            } else if (editUserPremium?.bot_lang == "ru") {
               bot.sendMessage(editUserPremium.chat_id, localText.successfullyPaidRu, {
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
                  await model.editStep(editUserPremium.chat_id, 'menu')
               })
            } else if (editUserPremium?.bot_lang == "eng") {
               bot.sendMessage(editUserPremium.chat_id, localText.successfullyPaidEng, {
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
                  await model.editStep(editUserPremium.chat_id, 'menu')
               })
            }
         } else {
            const userCards = await model.userCards(user?.chat_id);
            let success = false;

            for (const card of userCards) {
               if (success) break;

               const payed = await pay(user, card);
               console.log(payed)

               if (payed == 'Success') {
                  console.log(`Payment successful for user ${user.chat_id} with card ${card}`);
                  success = true;
               }

               if (!success) {
                  if (user?.bot_lang == 'uz') {
                     bot.sendMessage(user.chat_id, localText.cronTextStopedUz, {
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
                        await model.editStep(user.chat_id, 'menu')
                     })
                  } else if (user?.bot_lang == "ru") {
                     bot.sendMessage(user.chat_id, localText.cronTextStopedRu, {
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
                        await model.editStep(user.chat_id, 'menu')
                     })
                  } else if (user?.bot_lang == "eng") {
                     bot.sendMessage(user.chat_id, localText.cronTextStopedEng, {
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
                        await model.editStep(user.chat_id, 'menu')
                     })
                  }
                  console.log(`No successful payment for user ${user.chat_id}`);
               } else {
                  if (user?.bot_lang == 'uz') {
                     bot.sendMessage(user.chat_id, localText.successfullyPaidUz, {
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
                        await model.editStep(user.chat_id, 'menu')
                     })
                  } else if (user?.bot_lang == "ru") {
                     bot.sendMessage(user.chat_id, localText.successfullyPaidRu, {
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
                        await model.editStep(user.chat_id, 'menu')
                     })
                  } else if (user?.bot_lang == "eng") {
                     bot.sendMessage(user.chat_id, localText.successfullyPaidEng, {
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
                        await model.editStep(user.chat_id, 'menu')
                     })
                  }
               }
            }
         }
      }
   }
}

module.exports = {
   sendMessageBefore,
   sendMessageMorning,
   sendMessageAfternoon,
   sendMessageNight,
   sendMessageAdvice,
   paySubcribe
}