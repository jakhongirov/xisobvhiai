require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const router = require("./src/modules");
const localText = require('./src/text/text.json')
const model = require('./model');
const { bot } = require('./src/lib/bot')
const { formatBalanceWithSpaces, formatDateAdvanced, calculateExpiredDate, formatDatePremium } = require('./src/lib/functions');
const { months } = require('./data')
const {
   CronJob
} = require('cron');
const {
   sendMessageBefore
} = require('./src/lib/cron/cron');
const axios = require('axios');
const { analyzeText, analyzeVoice } = require('./src/lib/ai');

const publicFolderPath = path.join(__dirname, 'public');
const imagesFolderPath = path.join(publicFolderPath, 'images');
const audiosFolderPath = path.join(publicFolderPath, 'audios');

if (!fs.existsSync(publicFolderPath)) {
   fs.mkdirSync(publicFolderPath);
   console.log('Public folder created successfully.');
} else {
   console.log('Public folder already exists.');
}

if (!fs.existsSync(imagesFolderPath)) {
   fs.mkdirSync(imagesFolderPath);
   console.log('Images folder created successfully.');
} else {
   console.log('Images folder already exists within the public folder.');
}

if (!fs.existsSync(audiosFolderPath)) {
   fs.mkdirSync(audiosFolderPath);
   console.log('Images folder created successfully.');
} else {
   console.log('Images folder already exists within the public folder.');
}

bot.onText(/\/start ?(.*)?/, async (msg, match) => {
   const chatId = msg.chat.id;
   const param = match[1]?.trim();
   const foundUser = await model.foundUser(chatId)

   if (foundUser && foundUser.premium) {
      bot.sendMessage(chatId, localText.menuText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.reportsBtn
                  },
                  {
                     text: localText.debtBtn
                  },
               ],
               [
                  {
                     text: localText.balancesBtn
                  },
                  {
                     text: localText.shareBtn
                  }
               ],
               [
                  {
                     text: localText.usageInformationBtn
                  },
                  {
                     text: localText.premiumBtn
                  }
               ]
            ],
            resize_keyboard: true,

         }
      }).then(async () => {
         await model.editStep(chatId, 'menu')
      })
   } else if (foundUser) {
      const priceList = await model.priceList()
      const priceKeyboard = priceList
         .filter(item => !(foundUser.used_free && item.price == 0))
         .map(item => [{
            text: `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`,
            callback_data: `price_${item.id}`
         }]);
      const premiumText = foundUser.premium ? `${localText.premiumText}\n\n${localText.premiumExpiredText} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumText

      bot.sendMessage(chatId, premiumText, {
         parse_mode: "HTML",
         reply_markup: {
            inline_keyboard: priceKeyboard
         }
      }).then(async () => {
         await model.editStep(chatId, 'payment')
      })
   } else {
      bot.sendVideo(chatId, "BAACAgIAAyEFAASNDiJIAAMGZ9myzM6xvazDGaELaNVHcA6TAAHrAAKbaAACE_DRSiOSIIh-u4FwNgQ", {
         parse_mode: "HTML",
         caption: localText.startText,
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.sendContactBtn,
                     request_contact: true
                  }
               ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         const createUser = await model.createUser(chatId, 'register')
         await model.createBalance(createUser.id, "So'm", "UZS")
         await model.createBalance(createUser.id, "Dollar", "USD")
      })
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (msg.contact && foundUser?.bot_step == "register") {
      let phoneNumber = msg.contact.phone_number;

      if (msg.contact.user_id !== msg.from.id) {

         return bot.sendMessage(chatId, localText.contactRegisterError, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [{
                     text: localText.sendContactBtn,
                     request_contact: true
                  }]
               ],
               resize_keyboard: true,
               one_time_keyboard: true
            }
         })
      }

      if (!phoneNumber.startsWith('+')) {
         phoneNumber = `+${phoneNumber}`;
      }

      const addPhoneUser = await model.addPhoneUser(chatId, phoneNumber)

      if (addPhoneUser) {
         bot.sendMessage(chatId, localText.askNameText, {
            parse_mode: "HTML",
            reply_markup: {
               remove_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'ask_name')
         })
      }
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const foundUser = await model.foundUser(chatId)

   if (foundUser?.bot_step == 'ask_name' && text) {
      const addName = await model.addName(chatId, text)

      if (addName) {
         const priceList = await model.priceList()
         const priceKeyboard = priceList
            .filter(item => !(foundUser.used_free && item.price == 0))
            .map(item => [{
               text: `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`,
               callback_data: `price_${item.id}`
            }]);

         bot.sendMessage(chatId, localText.successfullyRegister, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: priceKeyboard
            }
         }).then(async () => {
            await model.editStep(chatId, 'payment')
         })
      }
   } else if (foundUser && text === localText.reportsBtn) {
      const currentMonth = new Date().getMonth() + 1;
      const monthlyInput = await model.monthlyInput(foundUser.id, currentMonth)
      const monthlyOutput = await model.monthlyOutput(foundUser.id, currentMonth)
      const monthltyByCategories = await model.monthltyByCategories(foundUser.id, currentMonth)

      const replacedText = localText.reportMonthlyText
         .replace(/%monthName%/g, months.find(m => m.number == currentMonth).name)

      const reportMonthly = `${replacedText}\n\n${localText.reportInputText} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputText} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesText}\n${monthltyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

      bot.sendMessage(chatId, reportMonthly, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.otherMonthsBtn
                  },
               ],
               [
                  {
                     text: localText.seeMoreBtn
                  }
               ],
               [
                  {
                     text: localText.backBtn
                  }
               ],
            ],
            resize_keyboard: true,
         }
      }).then(async () => {
         await model.editStep(chatId, 'report')
      })
   } else if (foundUser && text == localText.balancesBtn) {
      const userBalances = await model.userBalances(foundUser.id)
      const balancesText = `${localText.balancesText}\n\n${userBalances.map(item => `${item.currency}: ${formatBalanceWithSpaces(item.total_balance)}\n`).join('')}`

      bot.sendMessage(chatId, balancesText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.backBtn
                  }
               ],
            ],
            resize_keyboard: true,
         }
      }).then(async () => {
         await model.editStep(chatId, 'balances')
      })
   } else if (text == localText.usageInformationBtn) {

   } else if (foundUser && text == localText.debtBtn) {
      const debtsList = await model.debtsList(foundUser.id)
      const debtText = `${localText.debtText}\n\n${debtsList.map(item => `${localText.debtGivenText} ${formatDateAdvanced(item.given_date)}\n${localText.debtWhoText} ${item.name}\n${localText.debtAmountText} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineText} ${formatDateAdvanced(item.deadline)}\n`).join('')}`

      bot.sendMessage(chatId, debtText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.backBtn
                  }
               ]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'debt')
      })

   } else if (text == localText.shareBtn) {
      bot.sendMessage(chatId, localText.shareBtnText)
   } else if (text == localText.premiumBtn) {
      const priceList = await model.priceList()
      const priceKeyboard = priceList
         .filter(item => !(foundUser.used_free && item.price == 0))
         .map(item => [{
            text: `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`,
            callback_data: `price_${item.id}`
         }]);
      const premiumText = foundUser.premium ? `${localText.premiumText}\n\n${localText.premiumExpiredText} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumText

      bot.sendMessage(chatId, premiumText, {
         parse_mode: "HTML",
         reply_markup: {
            inline_keyboard: priceKeyboard
         }
      }).then(async () => {
         await model.editStep(chatId, 'payment')
      })
   } else if (text == localText.otherMonthsBtn) {
      const monthsKeyboard = [];
      for (let i = 0; i < months.length; i += 2) {
         const row = [];
         row.push({ text: months[i].name });
         if (months[i + 1]) {
            row.push({ text: months[i + 1].name });
         }
         monthsKeyboard.push(row);
      }

      monthsKeyboard.push([
         {
            text: localText.backBtn
         }
      ])

      bot.sendMessage(chatId, localText.chooseMonthText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: monthsKeyboard,
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'choose_month')
      })

   } else if (foundUser && text == localText.seeMoreBtn) {
      const currentMonth = new Date().getMonth() + 1;
      const historiesBalanceCurrentMonthOutcome = await model.historiesBalanceCurrentMonthOutcome(foundUser.id, currentMonth)
      const historiesBalanceCurrentMonthIncome = await model.historiesBalanceCurrentMonthIncome(foundUser.id, currentMonth)
      const foundMonth = months.find(item => item.number == currentMonth)
      const replacedSeeMoreText = localText.seeMoreText.replace(/%monthName%/g, foundMonth.name)
      const seeMoreText = `${replacedSeeMoreText}\n\n<b>${localText.reportOutputText}</b>\n${historiesBalanceCurrentMonthOutcome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentText} ${item.comment}\n\n`).join('')}\n<b>${localText.reportInputText}</b>\n${historiesBalanceCurrentMonthIncome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentText} ${item.comment}\n\n`).join('')}`

      bot.sendMessage(chatId, seeMoreText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.otherMonthsBtn
                  }
               ],
               [
                  {
                     text: localText.backBtn
                  }
               ],
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'see_more_histories')
      })

   } else if (text == localText.backBtn) {
      bot.sendMessage(chatId, localText.menuText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.reportsBtn
                  },
                  {
                     text: localText.debtBtn
                  },
               ],
               [
                  {
                     text: localText.balancesBtn
                  },
                  {
                     text: localText.shareBtn
                  }
               ],
               [
                  {
                     text: localText.usageInformationBtn
                  },
                  {
                     text: localText.premiumBtn
                  }
               ]
            ],
            resize_keyboard: true,
         }
      }).then(async () => {
         await model.editStep(chatId, 'menu')
      })
   } else if (foundUser?.bot_step === 'choose_month' && text) {
      const foundMonth = months.find(item => item.name == text)
      const monthlyInput = await model.monthlyInput(foundUser.id, foundMonth.number)
      const monthlyOutput = await model.monthlyOutput(foundUser.id, foundMonth.number)
      const monthltyByCategories = await model.monthltyByCategories(foundUser.id, foundMonth.number)

      const replacedText = localText.reportMonthlyText
         .replace(/%monthName%/g, foundMonth.name)

      const reportMonthly = `${replacedText}\n\n${localText.reportInputText} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputText} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesText}\n${monthltyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

      bot.sendMessage(chatId, reportMonthly, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.otherMonthsBtn
                  },
               ],
               [
                  {
                     text: localText.seeMoreBtn
                  }
               ],
               [
                  {
                     text: localText.backBtn
                  }
               ],
            ],
            resize_keyboard: true,
         }
      }).then(async () => {
         await model.editStep(chatId, 'report')
      })
   } else {
      if (foundUser?.premium) {
         if (msg.voice) {
            const fileId = msg.voice.file_id;
            const fileLink = await bot.getFileLink(fileId);
            const response = await axios({
               url: fileLink,
               responseType: 'stream',
            });
            const tempFilePath = path.join(__dirname, './public/audios', `temp_${fileId}.ogg`);

            try {
               const writer = fs.createWriteStream(tempFilePath);
               response.data.pipe(writer);

               writer.on('finish', async () => {
                  const jsonData = await analyzeVoice(`../../public/audios/temp_${fileId}.ogg`)

                  if (jsonData.length > 0) {
                     jsonData.forEach(async (item) => {
                        const foundBalance = await model.foundBalance(foundUser.id, item.currency,)
                        const foundCategory = await model.foundCategory(item.category)
                        const addReport = await model.addReport(
                           foundUser.id,
                           foundBalance.id,
                           foundCategory.id,
                           item.date,
                           item.amount,
                           item.type == 'income' ? true : false,
                           item.user_input
                        )

                        if (item.isDebtPayment) {
                           const addDebt = await model.addDebt(
                              foundUser.id,
                              foundBalance.id,
                              item.forWhom,
                              item.amount,
                              item.deadline,
                              item.date,
                           )
                           const debtText = `${localText.debtText}\n\n${localText.debtGivenText} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoText} ${addDebt.name}\n${localText.debtAmountText} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineText} ${formatDateAdvanced(addDebt.deadline)}`
                           bot.sendMessage(chatId, debtText, {
                              parse_mode: "HTML",
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtn,
                                          callback_data: `cancel_debt_${addDebt.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        }

                        const addReportText = `${localText.addReportText}\n\n${addReport.income ? "Kirim:" : "Chiqim:"}\n${localText.addReportDateText} ${formatDateAdvanced(addReport.date)}\n${localText.addReportAmountText} ${formatBalanceWithSpaces(addReport.amount)} ${foundBalance.currency}\n${localText.addReportCategoryText} ${foundCategory.name}\n${localText.addReportCommentText} ${addReport.comment}`
                        bot.sendMessage(chatId, addReportText, {
                           parse_mode: "HTML",
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtn,
                                       callback_data: `cancel_report_${addReport.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     })
                  } else {
                     const foundBalance = await model.foundBalance(foundUser.id, jsonData.currency,)
                     const foundCategory = await model.foundCategory(jsonData.category)
                     const addReport = await model.addReport(
                        foundUser.id,
                        foundBalance.id,
                        foundCategory.id,
                        jsonData.date,
                        jsonData.amount,
                        jsonData.type == 'income' ? true : false,
                        jsonData.user_input
                     )

                     if (jsonData.isDebtPayment) {
                        const addDebt = await model.addDebt(
                           foundUser.id,
                           foundBalance.id,
                           jsonData.forWhom,
                           jsonData.amount,
                           jsonData.deadline,
                           jsonData.date,
                        )
                        const debtText = `${localText.debtText}\n\n${localText.debtGivenText} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoText} ${addDebt.name}\n${localText.debtAmountText} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineText} ${formatDateAdvanced(addDebt.deadline)}`
                        bot.sendMessage(chatId, debtText, {
                           parse_mode: "HTML",
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtn,
                                       callback_data: `cancel_debt_${addDebt.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     }

                     const addReportText = `${localText.addReportText}\n\n${addReport.income ? "Kirim:" : "Chiqim:"}\n${localText.addReportDateText} ${formatDateAdvanced(addReport.date)}\n${localText.addReportAmountText} ${formatBalanceWithSpaces(addReport.amount)} ${foundBalance.currency}\n${localText.addReportCategoryText} ${foundCategory.name}\n${localText.addReportCommentText} ${addReport.comment}`
                     bot.sendMessage(chatId, addReportText, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtn,
                                    callback_data: `cancel_report_${addReport.id}`
                                 }
                              ]
                           ]
                        }
                     })

                  }
               })

               writer.on('error', (err) => {
                  console.error('Error downloading file:', err);
                  bot.sendMessage(chatId, 'Error downloading audio.');
                  fs.unlinkSync(tempFilePath);
               });

            } catch (uploadError) {
               console.error('Error during upload or analysis:', uploadError);
            }

         } else if (text && text != '/start') {
            const jsonData = await analyzeText(text)

            if (jsonData.length > 0) {
               jsonData.forEach(async (item) => {
                  const foundBalance = await model.foundBalance(foundUser.id, item.currency,)
                  const foundCategory = await model.foundCategory(item.category)
                  const addReport = await model.addReport(
                     foundUser.id,
                     foundBalance.id,
                     foundCategory.id,
                     item.date,
                     item.amount,
                     item.type == 'income' ? true : false,
                     item.user_input
                  )

                  if (item.isDebtPayment) {
                     const addDebt = await model.addDebt(
                        foundUser.id,
                        foundBalance.id,
                        item.forWhom,
                        item.amount,
                        item.deadline,
                        item.date,
                     )
                     const debtText = `${localText.debtText}\n\n${localText.debtGivenText} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoText} ${addDebt.name}\n${localText.debtAmountText} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineText} ${formatDateAdvanced(addDebt.deadline)}`
                     bot.sendMessage(chatId, debtText, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtn,
                                    callback_data: `cancel_debt_${addDebt.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  }

                  const addReportText = `${localText.addReportText}\n\n${addReport.income ? "Kirim:" : "Chiqim:"}\n${localText.addReportDateText} ${formatDateAdvanced(addReport.date)}\n${localText.addReportAmountText} ${formatBalanceWithSpaces(addReport.amount)} ${foundBalance.currency}\n${localText.addReportCategoryText} ${foundCategory.name}\n${localText.addReportCommentText} ${addReport.comment}`
                  bot.sendMessage(chatId, addReportText, {
                     parse_mode: "HTML",
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText.cancelBtn,
                                 callback_data: `cancel_report_${addReport.id}`
                              }
                           ]
                        ]
                     }
                  })
               })
            } else {
               const foundBalance = await model.foundBalance(foundUser.id, jsonData.currency,)
               const foundCategory = await model.foundCategory(jsonData.category)
               const addReport = await model.addReport(
                  foundUser.id,
                  foundBalance.id,
                  foundCategory.id,
                  jsonData.date,
                  jsonData.amount,
                  jsonData.type == 'income' ? true : false,
                  jsonData.user_input
               )

               if (jsonData.isDebtPayment) {
                  const addDebt = await model.addDebt(
                     foundUser.id,
                     foundBalance.id,
                     jsonData.forWhom,
                     jsonData.amount,
                     jsonData.deadline,
                     jsonData.date,
                  )
                  const debtText = `${localText.debtText}\n\n${localText.debtGivenText} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoText} ${addDebt.name}\n${localText.debtAmountText} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineText} ${formatDateAdvanced(addDebt.deadline)}`
                  bot.sendMessage(chatId, debtText, {
                     parse_mode: "HTML",
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText.cancelBtn,
                                 callback_data: `cancel_debt_${addDebt.id}`
                              }
                           ]
                        ]
                     }
                  })
               }

               const addReportText = `${localText.addReportText}\n\n${addReport.income ? "Kirim:" : "Chiqim:"}\n${localText.addReportDateText} ${formatDateAdvanced(addReport.date)}\n${localText.addReportAmountText} ${formatBalanceWithSpaces(addReport.amount)} ${foundBalance.currency}\n${localText.addReportCategoryText} ${foundCategory.name}\n${localText.addReportCommentText} ${addReport.comment}`
               bot.sendMessage(chatId, addReportText, {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText.cancelBtn,
                              callback_data: `cancel_report_${addReport.id}`
                           }
                        ]
                     ]
                  }
               })

            }
         }
      } else {
         const priceList = await model.priceList()
         const priceKeyboard = priceList
            .filter(item => !(foundUser.used_free && item.price == 0))
            .map(item => [{
               text: `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`,
               callback_data: `price_${item.id}`
            }]);
         const premiumText = foundUser.premium ? `${localText.premiumText}\n\n${localText.premiumExpiredText} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumText

         bot.sendMessage(chatId, premiumText, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: priceKeyboard
            }
         }).then(async () => {
            await model.editStep(chatId, 'payment')
         })
      }
   }
})

bot.on('callback_query', async (msg) => {
   const chatId = msg.message.chat.id;
   const data = msg.data;
   const foundUser = await model.foundUser(chatId)

   if (data.startsWith('price_')) {
      const priceId = data?.split('price_')[1]
      const price = await model.foundTarif(priceId)

      if (price && price.price > 0) {
         const replacedText = localText.priceText
            .replace(/%price%/g, formatBalanceWithSpaces(price?.price))
            .replace(/%title%/g, price?.title);

         const text = `m=6697d19280d270b331826481;ac.user_id=${chatId};ac.tarif=${price.title};ac.ilova=Xisobchi_AI;a=${price.price}00`;
         const base64Encoded = btoa(text);

         bot.sendMessage(chatId, replacedText, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: localText.clickText,
                        url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Xisobchi_AI&additional_param3=${chatId}&amount=${price.price}&additional_param4=${price.title}`
                     }
                  ],
                  [
                     {
                        text: localText.paymeText,
                        url: `https://checkout.paycom.uz/${base64Encoded}`
                     }
                  ],
                  // [
                  //    {
                  //       text: localText.uzumText,
                  //       url: `https://www.uzumbank.uz/open-service?serviceId=498617211&ilova=Xisobchi_AI&tarif=${price.title}&id=${chatId}&amount=${price.price}00`
                  //    }
                  // ],
               ]
            }
         })
      } else if (price && !foundUser?.used_free) {
         const expiredDate = calculateExpiredDate(Number(price.period))
         await model.editPremium(chatId, expiredDate)
         bot.sendMessage(chatId, localText.menuText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.reportsBtn
                     },
                     {
                        text: localText.debtBtn
                     },
                  ],
                  [
                     {
                        text: localText.balancesBtn
                     },
                     {
                        text: localText.shareBtn
                     }
                  ],
                  [
                     {
                        text: localText.usageInformationBtn
                     },
                     {
                        text: localText.premiumBtn
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
            await model.editUsedFree(chatId)
         })
      }
   } else if (data.startsWith('cancel_report_')) {
      const reportid = data?.split('cancel_report_')[1]
      const deleteReport = await model.deleteReport(reportid, foundUser.id)

      if (deleteReport) {
         bot.sendMessage(chatId, localText.cancelText, { parse_mode: "HTML", })
      }
   } else if (data.startsWith('cancel_debt_')) {
      const debtid = data?.split('cancel_debt_')[1]
      const deleteDebt = await model.deleteDebt(debtid, foundUser.id)

      if (deleteDebt) {
         bot.sendMessage(chatId, localText.cancelText, { parse_mode: "HTML", })
      }
   }
})

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.use("/api/v1", router);

const job = new CronJob('0 9 * * *', async () => {
   await sendMessageBefore();
   console.log('aa');
});

// Start the job
job.start();

app.listen(4040, console.log(4040))