require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const router = require("./src/modules");
const localText = require('./src/text/text.json')
const model = require('./model');
const { bot } = require('./src/lib/bot')
const {
   formatBalanceWithSpaces,
   formatDateAdvanced,
   calculateExpiredDate,
   formatDatePremium,
} = require('./src/lib/functions');
const { months } = require('./data')
const {
   CronJob
} = require('cron');
const {
   sendMessageBefore,
   sendMessageMorning,
   sendMessageAfternoon,
   sendMessageNight,
   sendMessageAdvice,
   paySubcribe
} = require('./src/lib/cron/cron');
const axios = require('axios');
const {
   analyzeText,
   analyzeVoice,
   newCategoryData
} = require('./src/lib/ai');

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

   if (foundUser) {
      if (foundUser?.bot_lang == 'uz') {
         bot.sendMessage(chatId, localText.menuTextUz, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser?.bot_lang == 'ru') {
         bot.sendMessage(chatId, localText.menuTextRu, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser?.bot_lang == 'eng') {
         bot.sendMessage(chatId, localText.menuTextEng, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnEng
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      }
   } else {
      bot.sendMessage(chatId, localText.startText, {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: '🇺🇿 Uz',
                  },
                  {
                     text: '🇷🇺 Ру',
                  },
                  {
                     text: '🇬🇧 Eng',
                  },
               ],
            ],
            resize_keyboard: true
         },
      }).then(async () => {
         if (param) {
            const [partnerName, source] = param?.split('/');
            const partner = await model.foundPartnerName(partnerName)
            await model.createUser(chatId, 'language', partner.id, partnerName, source);
         } else {
            await model.createUser(chatId, 'language', null, 'organic', 'organic');
         }
      })
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      if (foundUser.bot_step == 'change_lang') {
         if (text == '🇺🇿 Uz') {
            bot.sendMessage(chatId, localText.menuTextUz, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnUz
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
               await model.changeLang(chatId, 'uz')
            })
         } else if (text == '🇷🇺 Ру') {
            bot.sendMessage(chatId, localText.menuTextRu, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnRu
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
               await model.changeLang(chatId, 'ru')
            })
         } else if (text == '🇬🇧 Eng') {
            bot.sendMessage(chatId, localText.menuTextEng, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnEng
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
               await model.changeLang(chatId, 'eng')

            })
         }
      } else if (text == '🇺🇿 Uz') {
         bot.sendVideo(chatId, 'https://xisobchiai2.admob.uz/public/videos/IMG_4833.MP4', {
            parse_mode: "HTML",
            caption: localText.startTextUz,
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.sendContactBtnUz,
                        request_contact: true
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            const editStep = await model.editStep(chatId, 'register')
            await model.addLang(chatId, 'uz')
            await model.createBalance(editStep.id, "So'm", "UZS")
            await model.createBalance(editStep.id, "Dollar", "USD")
         })
      } else if (text == '🇷🇺 Ру') {
         bot.sendVideo(chatId, 'https://xisobchiai2.admob.uz/public/videos/IMG_4833.MP4', {
            parse_mode: "HTML",
            caption: localText.startTextRu,
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.sendContactBtnRu,
                        request_contact: true
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            const editStep = await model.editStep(chatId, 'register')
            await model.addLang(chatId, 'ru')
            await model.createBalance(editStep.id, "Сум", "UZS")
            await model.createBalance(editStep.id, "Доллар", "USD")
         })
      } else if (text == '🇬🇧 Eng') {
         bot.sendVideo(chatId, 'https://xisobchiai2.admob.uz/public/videos/IMG_4833.MP4', {
            parse_mode: "HTML",
            caption: localText.startTextEng,
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.sendContactBtnEng,
                        request_contact: true
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            const editStep = await model.editStep(chatId, 'register')
            await model.addLang(chatId, 'eng')
            await model.createBalance(editStep.id, "Sum", "UZS")
            await model.createBalance(editStep.id, "Dollar", "USD")
         })
      } else if (foundUser?.bot_step == 'ask_name' && text) {
         const addName = await model.addName(chatId, text)

         if (addName) {
            if (addName.bot_lang == 'uz') {
               bot.sendMessage(chatId, localText.successfullyRegisterUz, {
                  parse_mode: "HTML"
               }).then(async () => {
                  bot.sendMessage(chatId, localText.test1TextUz).then(async () => {
                     await model.editStep(chatId, 'test_1')
                  })
               })
            } else if (addName.bot_lang == 'ru') {
               bot.sendMessage(chatId, localText.successfullyRegisterRu, {
                  parse_mode: "HTML"
               }).then(async () => {
                  bot.sendMessage(chatId, localText.test1TextRu).then(async () => {
                     await model.editStep(chatId, 'test_1')
                  })
               })
            } else if (addName.bot_lang == 'eng') {
               bot.sendMessage(chatId, localText.successfullyRegisterEng, {
                  parse_mode: "HTML"
               }).then(async () => {
                  bot.sendMessage(chatId, localText.test1TextEng, {
                     parse_mode: "HTML"
                  }).then(async () => {
                     await model.editStep(chatId, 'test_1')
                  })
               })
            }
         }
      } else if (foundUser?.bot_step == 'test_1' || foundUser?.bot_step == 'test_2' || foundUser?.bot_step == 'test_3') {
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
                  const categories = await model.categories()
                  const jsonData = await analyzeVoice(`../../public/audios/temp_${fileId}.ogg`, categories)

                  if (jsonData == 'wrong') {
                     if (foundUser.bot_lang == 'uz') {
                        bot.sendMessage(chatId, localText.wrongTextUz)
                     } else if (foundUser.bot_lang == 'ru') {
                        bot.sendMessage(chatId, localText.wrongTextRU)
                     } else if (foundUser.bot_lang == 'eng') {
                        bot.sendMessage(chatId, localText.wrongTextEng)
                     }
                  } else if (jsonData.length > 0) {
                     jsonData?.forEach(async (item) => {
                        const foundCategory = await model.foundCategory(item.category, foundUser?.bot_lang)

                        if (item.isDebtPayment) {
                           if (foundUser?.bot_lang == 'uz') {
                              const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(item.deadline)}\n${localText.debtWhoTextUz} ${item.forWhom}\n${localText.debtAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(item.deadline)}`;
                              bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                           } else if (foundUser?.bot_lang == 'ru') {
                              const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(item.deadline)}\n${localText.debtWhoTextRu} ${item.forWhom}\n${localText.debtAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(item.deadline)}`;
                              bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                           } else if (foundUser?.bot_lang == 'eng') {
                              const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(item.deadline)}\n${localText.debtWhoTexEng} ${item.forWhom}\n${localText.debtAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(item.deadline)}`;
                              bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                           }
                        }

                        if (foundUser?.bot_lang == 'uz') {
                           const reportText = `${localText.addReportTextUz}\n\n${item.type == 'income' ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(item.date)}</b>\n\n${localText.addReportAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${item.user_input}`
                           bot.sendMessage(chatId, reportText, {
                              parse_mode: 'HTML'
                           }).then(async () => {
                              if (foundUser?.bot_step == 'test_1') {
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.test2TextUz).then(async () => {
                                       await model.editStep(chatId, 'test_2')
                                    })
                                 }, 3000)
                              } else if (foundUser?.bot_step == 'test_2') {
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.test3TextUz, { parse_mode: "HTML" }).then(async () => {
                                       await model.editStep(chatId, 'test_3')
                                    })
                                 }, 3000)
                              } else if (foundUser?.bot_step == 'test_3') {
                                 const priceList = await model.priceList(foundUser?.bot_lang)
                                 const priceKeyboard = priceList
                                    .filter(item => !(foundUser?.used_free && item.price == 0))
                                    .map(item => {
                                       const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                       if (item.period == 30) {
                                          return [{
                                             text,
                                             web_app: {
                                                url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                             }
                                          }];
                                       } else {
                                          return [{
                                             text,
                                             callback_data: `tarif_${item.id}`
                                          }];
                                       }
                                    });
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.firstTextPaymentUz, {
                                       parse_mode: 'HTML',
                                       reply_markup: {
                                          inline_keyboard: priceKeyboard
                                       }
                                    })
                                 }, 5000)
                              }
                           })
                        } else if (foundUser?.bot_lang == 'ru') {
                           const reportText = `${localText.addReportTextRu}\n\n${item.type == 'income' ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(item.date)}</b>\n\n${localText.addReportAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${item.user_input}`
                           bot.sendMessage(chatId, reportText, {
                              parse_mode: 'HTML'
                           }).then(async () => {
                              if (foundUser?.bot_step == 'test_1') {
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.test2TextRu).then(async () => {
                                       await model.editStep(chatId, 'test_2')
                                    })
                                 }, 3000)
                              } else if (foundUser?.bot_step == 'test_2') {
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.test3TextRu, { parse_mode: "HTML" }).then(async () => {
                                       await model.editStep(chatId, 'test_3')
                                    })
                                 }, 3000)
                              } else if (foundUser?.bot_step == 'test_3') {
                                 const priceList = await model.priceList(foundUser?.bot_lang)
                                 const priceKeyboard = priceList
                                    .filter(item => !(foundUser?.used_free && item.price == 0))
                                    .map(item => {
                                       const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                       if (item.period == 30) {
                                          return [{
                                             text,
                                             web_app: {
                                                url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                             }
                                          }];
                                       } else {
                                          return [{
                                             text,
                                             callback_data: `tarif_${item.id}`
                                          }];
                                       }
                                    });
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.firstTextPaymentRu, {
                                       parse_mode: 'HTML',
                                       reply_markup: {
                                          inline_keyboard: priceKeyboard
                                       }
                                    })
                                 }, 5000)
                              }
                           })
                        } else if (foundUser?.bot_lang == 'eng') {
                           const reportText = `${localText.addReportTextEng}\n\n${item.type == 'income' ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(item.date)}</b>\n\n${localText.addReportAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${item.user_input}`
                           bot.sendMessage(chatId, reportText, {
                              parse_mode: 'HTML'
                           }).then(async () => {
                              if (foundUser?.bot_step == 'test_1') {
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.test2TextEng).then(async () => {
                                       await model.editStep(chatId, 'test_2')
                                    })
                                 }, 3000)
                              } else if (foundUser?.bot_step == 'test_2') {
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.test3TextEng, { parse_mode: "HTML" }).then(async () => {
                                       await model.editStep(chatId, 'test_3')
                                    })
                                 }, 3000)
                              } else if (foundUser?.bot_step == 'test_3') {
                                 const priceList = await model.priceList(foundUser?.bot_lang)
                                 const priceKeyboard = priceList
                                    .filter(item => !(foundUser?.used_free && item.price == 0))
                                    .map(item => {
                                       const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                       if (item.period == 30) {
                                          return [{
                                             text,
                                             web_app: {
                                                url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                             }
                                          }];
                                       } else {
                                          return [{
                                             text,
                                             callback_data: `tarif_${item.id}`
                                          }];
                                       }
                                    });
                                 setTimeout(async () => {
                                    bot.sendMessage(chatId, localText.firstTextPaymentEng, {
                                       parse_mode: 'HTML',
                                       reply_markup: {
                                          inline_keyboard: priceKeyboard
                                       }
                                    })
                                 }, 5000)
                              }
                           })
                        }
                     })
                  } else {
                     const foundCategory = await model.foundCategory(jsonData.category, foundUser?.bot_lang)

                     if (jsonData.isDebtPayment) {
                        if (foundUser?.bot_lang == 'uz') {
                           const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(jsonData.deadline)}\n${localText.debtWhoTextUz} ${jsonData.forWhom}\n${localText.debtAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(jsonData.deadline)}`;
                           bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                        } else if (foundUser?.bot_lang == 'ru') {
                           const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(jsonData.deadline)}\n${localText.debtWhoTextRu} ${jsonData.forWhom}\n${localText.debtAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(jsonData.deadline)}`;
                           bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                        } else if (foundUser?.bot_lang == 'eng') {
                           const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(jsonData.deadline)}\n${localText.debtWhoTexEng} ${jsonData.forWhom}\n${localText.debtAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(jsonData.deadline)}`;
                           bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                        }
                     }

                     
                     if (foundUser?.bot_lang == 'uz') {
                        const reportText = `${localText.addReportTextUz}\n\n${jsonData.type == 'income' ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(jsonData.date)}</b>\n\n${localText.addReportAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${item.user_input}`
                        bot.sendMessage(chatId, reportText, {
                           parse_mode: 'HTML'
                        }).then(async () => {
                           if (foundUser?.bot_step == 'test_1') {
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.test2TextUz).then(async () => {
                                    await model.editStep(chatId, 'test_2')
                                 })
                              }, 3000)
                           } else if (foundUser?.bot_step == 'test_2') {
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.test3TextUz, { parse_mode: "HTML" }).then(async () => {
                                    await model.editStep(chatId, 'test_3')
                                 })
                              }, 3000)
                           } else if (foundUser?.bot_step == 'test_3') {
                              const priceList = await model.priceList(foundUser?.bot_lang)
                              const priceKeyboard = priceList
                                 .filter(item => !(foundUser?.used_free && item.price == 0))
                                 .map(item => {
                                    const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                    if (item.period == 30) {
                                       return [{
                                          text,
                                          web_app: {
                                             url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                          }
                                       }];
                                    } else {
                                       return [{
                                          text,
                                          callback_data: `tarif_${item.id}`
                                       }];
                                    }
                                 });
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.firstTextPaymentUz, {
                                    parse_mode: 'HTML',
                                    reply_markup: {
                                       inline_keyboard: priceKeyboard
                                    }
                                 })
                              }, 5000)
                           }
                        })
                     } else if (foundUser?.bot_lang == 'ru') {
                        const reportText = `${localText.addReportTextRu}\n\n${jsonData.type == 'income' ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(jsonData.date)}</b>\n\n${localText.addReportAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${item.user_input}`
                        bot.sendMessage(chatId, reportText, {
                           parse_mode: 'HTML'
                        }).then(async () => {
                           if (foundUser?.bot_step == 'test_1') {
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.test2TextRu).then(async () => {
                                    await model.editStep(chatId, 'test_2')
                                 })
                              }, 3000)
                           } else if (foundUser?.bot_step == 'test_2') {
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.test3TextRu, { parse_mode: "HTML" }).then(async () => {
                                    await model.editStep(chatId, 'test_3')
                                 })
                              }, 3000)
                           } else if (foundUser?.bot_step == 'test_3') {
                              const priceList = await model.priceList(foundUser?.bot_lang)
                              const priceKeyboard = priceList
                                 .filter(item => !(foundUser?.used_free && item.price == 0))
                                 .map(item => {
                                    const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                    if (item.period == 30) {
                                       return [{
                                          text,
                                          web_app: {
                                             url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                          }
                                       }];
                                    } else {
                                       return [{
                                          text,
                                          callback_data: `tarif_${item.id}`
                                       }];
                                    }
                                 });
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.firstTextPaymentRu, {
                                    parse_mode: 'HTML',
                                    reply_markup: {
                                       inline_keyboard: priceKeyboard
                                    }
                                 })
                              }, 5000)
                           }
                        })
                     } else if (foundUser?.bot_lang == 'eng') {
                        const reportText = `${localText.addReportTextEng}\n\n${jsonData.type == 'income' ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(jsonData.date)}</b>\n\n${localText.addReportAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${item.user_input}`
                        bot.sendMessage(chatId, reportText, {
                           parse_mode: 'HTML'
                        }).then(async () => {
                           if (foundUser?.bot_step == 'test_1') {
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.test2TextEng).then(async () => {
                                    await model.editStep(chatId, 'test_2')
                                 })
                              }, 3000)
                           } else if (foundUser?.bot_step == 'test_2') {
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.test3TextEng, { parse_mode: "HTML" }).then(async () => {
                                    await model.editStep(chatId, 'test_3')
                                 })
                              }, 3000)
                           } else if (foundUser?.bot_step == 'test_3') {
                              const priceList = await model.priceList(foundUser?.bot_lang)
                              const priceKeyboard = priceList
                                 .filter(item => !(foundUser?.used_free && item.price == 0))
                                 .map(item => {
                                    const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                    if (item.period == 30) {
                                       return [{
                                          text,
                                          web_app: {
                                             url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                          }
                                       }];
                                    } else {
                                       return [{
                                          text,
                                          callback_data: `tarif_${item.id}`
                                       }];
                                    }
                                 });
                              setTimeout(async () => {
                                 bot.sendMessage(chatId, localText.firstTextPaymentEng, {
                                    parse_mode: 'HTML',
                                    reply_markup: {
                                       inline_keyboard: priceKeyboard
                                    }
                                 })
                              }, 5000)
                           }
                        })
                     }
                  }

               })
            } catch (uploadError) {
               console.error('Error during upload or analysis:', uploadError);
            }
         } else if (text && text != '/start') {
            const categories = await model.categories()
            const jsonData = await analyzeText(text, categories)

            console.log(jsonData)

            if (jsonData == 'wrong') {
               if (foundUser.bot_lang == 'uz') {
                  bot.sendMessage(chatId, localText.wrongTextUz)
               } else if (foundUser.bot_lang == 'ru') {
                  bot.sendMessage(chatId, localText.wrongTextRU)
               } else if (foundUser.bot_lang == 'eng') {
                  bot.sendMessage(chatId, localText.wrongTextEng)
               }
            } else if (jsonData?.length > 0) {
               jsonData?.forEach(async (item) => {
                  const foundCategory = await model.foundCategory(item.category, foundUser?.bot_lang)

                  if (item.isDebtPayment) {
                     if (foundUser?.bot_lang == 'uz') {
                        const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(item.deadline)}\n${localText.debtWhoTextUz} ${item.forWhom}\n${localText.debtAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(item.deadline)}`;
                        bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                     } else if (foundUser?.bot_lang == 'ru') {
                        const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(item.deadline)}\n${localText.debtWhoTextRu} ${item.forWhom}\n${localText.debtAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(item.deadline)}`;
                        bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                     } else if (foundUser?.bot_lang == 'eng') {
                        const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(item.deadline)}\n${localText.debtWhoTexEng} ${item.forWhom}\n${localText.debtAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(item.deadline)}`;
                        bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                     }
                  }

                  if (foundUser?.bot_lang == 'uz') {
                     const reportText = `${localText.addReportTextUz}\n\n${item.type == 'income' ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(item.date)}</b>\n\n${localText.addReportAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${item.user_input}`
                     bot.sendMessage(chatId, reportText, {
                        parse_mode: 'HTML'
                     }).then(async () => {
                        if (foundUser?.bot_step == 'test_1') {
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.test2TextUz).then(async () => {
                                 await model.editStep(chatId, 'test_2')
                              })
                           }, 3000)
                        } else if (foundUser?.bot_step == 'test_2') {
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.test3TextUz, { parse_mode: "HTML" }).then(async () => {
                                 await model.editStep(chatId, 'test_3')
                              })
                           }, 3000)
                        } else if (foundUser?.bot_step == 'test_3') {
                           const priceList = await model.priceList(foundUser?.bot_lang)
                           const priceKeyboard = priceList
                              .filter(item => !(foundUser?.used_free && item.price == 0))
                              .map(item => {
                                 const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                 if (item.period == 30) {
                                    return [{
                                       text,
                                       web_app: {
                                          url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                       }
                                    }];
                                 } else {
                                    return [{
                                       text,
                                       callback_data: `tarif_${item.id}`
                                    }];
                                 }
                              });
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.firstTextPaymentUz, {
                                 parse_mode: 'HTML',
                                 reply_markup: {
                                    inline_keyboard: priceKeyboard
                                 }
                              })
                           }, 5000)
                        }
                     })
                  } else if (foundUser?.bot_lang == 'ru') {
                     const reportText = `${localText.addReportTextRu}\n\n${item.type == 'income' ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(item.date)}</b>\n\n${localText.addReportAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${item.user_input}`
                     bot.sendMessage(chatId, reportText, {
                        parse_mode: 'HTML'
                     }).then(async () => {
                        if (foundUser?.bot_step == 'test_1') {
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.test2TextRu).then(async () => {
                                 await model.editStep(chatId, 'test_2')
                              })
                           }, 3000)
                        } else if (foundUser?.bot_step == 'test_2') {
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.test3TextRu, { parse_mode: "HTML" }).then(async () => {
                                 await model.editStep(chatId, 'test_3')
                              })
                           }, 3000)
                        } else if (foundUser?.bot_step == 'test_3') {
                           const priceList = await model.priceList(foundUser?.bot_lang)
                           const priceKeyboard = priceList
                              .filter(item => !(foundUser?.used_free && item.price == 0))
                              .map(item => {
                                 const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                 if (item.period == 30) {
                                    return [{
                                       text,
                                       web_app: {
                                          url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                       }
                                    }];
                                 } else {
                                    return [{
                                       text,
                                       callback_data: `tarif_${item.id}`
                                    }];
                                 }
                              });
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.firstTextPaymentRu, {
                                 parse_mode: 'HTML',
                                 reply_markup: {
                                    inline_keyboard: priceKeyboard
                                 }
                              })
                           }, 5000)
                        }
                     })
                  } else if (foundUser?.bot_lang == 'eng') {
                     const reportText = `${localText.addReportTextEng}\n\n${item.type == 'income' ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(item.date)}</b>\n\n${localText.addReportAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${item.user_input}`
                     bot.sendMessage(chatId, reportText, {
                        parse_mode: 'HTML'
                     }).then(async () => {
                        if (foundUser?.bot_step == 'test_1') {
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.test2TextEng).then(async () => {
                                 await model.editStep(chatId, 'test_2')
                              })
                           }, 3000)
                        } else if (foundUser?.bot_step == 'test_2') {
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.test3TextEng, { parse_mode: "HTML" }).then(async () => {
                                 await model.editStep(chatId, 'test_3')
                              })
                           }, 3000)
                        } else if (foundUser?.bot_step == 'test_3') {
                           const priceList = await model.priceList(foundUser?.bot_lang)
                           const priceKeyboard = priceList
                              .filter(item => !(foundUser?.used_free && item.price == 0))
                              .map(item => {
                                 const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                                 if (item.period == 30) {
                                    return [{
                                       text,
                                       web_app: {
                                          url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                       }
                                    }];
                                 } else {
                                    return [{
                                       text,
                                       callback_data: `tarif_${item.id}`
                                    }];
                                 }
                              });
                           setTimeout(async () => {
                              bot.sendMessage(chatId, localText.firstTextPaymentEng, {
                                 parse_mode: 'HTML',
                                 reply_markup: {
                                    inline_keyboard: priceKeyboard
                                 }
                              })
                           }, 5000)
                        }
                     })
                  }
               })
            } else {
               const foundCategory = await model.foundCategory(jsonData.category, foundUser?.bot_lang)

               if (jsonData.isDebtPayment) {
                  if (foundUser?.bot_lang == 'uz') {
                     const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(jsonData.deadline)}\n${localText.debtWhoTextUz} ${jsonData.forWhom}\n${localText.debtAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(jsonData.deadline)}`;
                     bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                  } else if (foundUser?.bot_lang == 'ru') {
                     const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(jsonData.deadline)}\n${localText.debtWhoTextRu} ${jsonData.forWhom}\n${localText.debtAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(jsonData.deadline)}`;
                     bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                  } else if (foundUser?.bot_lang == 'eng') {
                     const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(jsonData.deadline)}\n${localText.debtWhoTexEng} ${jsonData.forWhom}\n${localText.debtAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(jsonData.deadline)}`;
                     bot.sendMessage(chatId, debtText, { parse_mode: "HTML" })
                  }
               }

               if (foundUser?.bot_lang == 'uz') {
                  const reportText = `${localText.addReportTextUz}\n\n${jsonData.type == 'income' ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(jsonData.date)}</b>\n\n${localText.addReportAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${item.user_input}`
                  bot.sendMessage(chatId, reportText, {
                     parse_mode: 'HTML'
                  }).then(async () => {

                     if (foundUser?.bot_step == 'test_1') {
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.test2TextUz).then(async () => {
                              await model.editStep(chatId, 'test_2')
                           })
                        }, 3000)
                     } else if (foundUser?.bot_step == 'test_2') {
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.test3TextUz, { parse_mode: "HTML" }).then(async () => {
                              await model.editStep(chatId, 'test_3')
                           })
                        }, 3000)
                     } else if (foundUser?.bot_step == 'test_3') {
                        const priceList = await model.priceList(foundUser?.bot_lang)
                        const priceKeyboard = priceList
                           .filter(item => !(foundUser?.used_free && item.price == 0))
                           .map(item => {
                              const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                              if (item.period == 30) {
                                 return [{
                                    text,
                                    web_app: {
                                       url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                    }
                                 }];
                              } else {
                                 return [{
                                    text,
                                    callback_data: `tarif_${item.id}`
                                 }];
                              }
                           });
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.firstTextPaymentUz, {
                              parse_mode: 'HTML',
                              reply_markup: {
                                 inline_keyboard: priceKeyboard
                              }
                           })
                        }, 5000)
                     }
                  })
               } else if (foundUser?.bot_lang == 'ru') {
                  const reportText = `${localText.addReportTextRu}\n\n${jsonData.type == 'income' ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(jsonData.date)}</b>\n\n${localText.addReportAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${item.user_input}`
                  bot.sendMessage(chatId, reportText, {
                     parse_mode: 'HTML'
                  }).then(async () => {
                     if (foundUser?.bot_step == 'test_1') {
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.test2TextRu).then(async () => {
                              await model.editStep(chatId, 'test_2')
                           })
                        }, 3000)
                     } else if (foundUser?.bot_step == 'test_2') {
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.test3TextRu, { parse_mode: "HTML" }).then(async () => {
                              await model.editStep(chatId, 'test_3')
                           })
                        }, 3000)
                     } else if (foundUser?.bot_step == 'test_3') {
                        const priceList = await model.priceList(foundUser?.bot_lang)
                        const priceKeyboard = priceList
                           .filter(item => !(foundUser?.used_free && item.price == 0))
                           .map(item => {
                              const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                              if (item.period == 30) {
                                 return [{
                                    text,
                                    web_app: {
                                       url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                    }
                                 }];
                              } else {
                                 return [{
                                    text,
                                    callback_data: `tarif_${item.id}`
                                 }];
                              }
                           });
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.firstTextPaymentRu, {
                              parse_mode: 'HTML',
                              reply_markup: {
                                 inline_keyboard: priceKeyboard
                              }
                           })
                        }, 5000)
                     }
                  })
               } else if (foundUser?.bot_lang == 'eng') {
                  const reportText = `${localText.addReportTextEng}\n\n${jsonData.type == 'income' ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(jsonData.date)}</b>\n\n${localText.addReportAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(jsonData.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${item.user_input}`
                  bot.sendMessage(chatId, reportText, {
                     parse_mode: 'HTML'
                  }).then(async () => {
                     if (foundUser?.bot_step == 'test_1') {
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.test2TextEng).then(async () => {
                              await model.editStep(chatId, 'test_2')
                           })
                        }, 3000)
                     } else if (foundUser?.bot_step == 'test_2') {
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.test3TextEng, { parse_mode: "HTML" }).then(async () => {
                              await model.editStep(chatId, 'test_3')
                           })
                        }, 3000)
                     } else if (foundUser?.bot_step == 'test_3') {
                        const priceList = await model.priceList(foundUser?.bot_lang)
                        const priceKeyboard = priceList
                           .filter(item => !(foundUser?.used_free && item.price == 0))
                           .map(item => {
                              const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                              if (item.period == 30) {
                                 return [{
                                    text,
                                    web_app: {
                                       url: `https://payment.hisobchiai.admob.uz/${chatId}`
                                    }
                                 }];
                              } else {
                                 return [{
                                    text,
                                    callback_data: `tarif_${item.id}`
                                 }];
                              }
                           });
                        setTimeout(async () => {
                           bot.sendMessage(chatId, localText.firstTextPaymentEng, {
                              parse_mode: 'HTML',
                              reply_markup: {
                                 inline_keyboard: priceKeyboard
                              }
                           })
                        }, 5000)
                     }
                  })
               }
            }
         }
      } else if (foundUser && text === localText.reportsBtnUz) {
         const currentMonth = new Date().getMonth() + 1;
         const monthlyInput = await model.monthlyInput(foundUser.id, currentMonth)
         const monthlyOutput = await model.monthlyOutput(foundUser.id, currentMonth)
         const monthlyByCategories = await model.monthlyByCategories(foundUser.id, currentMonth, 'uz')

         const replacedText = localText.reportMonthlyTextUz
            .replace(/%monthName%/g, months.find(m => m.number == currentMonth).name_uz)

         const reportMonthly = `${replacedText}\n\n${localText.reportInputTextUz} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputTextUz} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesTextUz}\n${monthlyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

         bot.sendMessage(chatId, reportMonthly, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.otherMonthsBtnUz
                     },
                  ],
                  [
                     {
                        text: localText.seeMoreBtnUz
                     }
                  ],
                  [
                     {
                        text: localText.backBtnUz
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'report')
         })
      } else if (foundUser && text === localText.reportsBtnRu) {
         const currentMonth = new Date().getMonth() + 1;
         const monthlyInput = await model.monthlyInput(foundUser.id, currentMonth)
         const monthlyOutput = await model.monthlyOutput(foundUser.id, currentMonth)
         const monthlyByCategories = await model.monthlyByCategories(foundUser.id, currentMonth, 'ru')

         const replacedText = localText.reportMonthlyTextRu
            .replace(/%monthName%/g, months.find(m => m.number == currentMonth).name_ru)

         const reportMonthly = `${replacedText}\n\n${localText.reportInputTextRu} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputTextRu} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesTextRu}\n${monthlyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

         bot.sendMessage(chatId, reportMonthly, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.otherMonthsBtnRu
                     },
                  ],
                  [
                     {
                        text: localText.seeMoreBtnRu
                     }
                  ],
                  [
                     {
                        text: localText.backBtnRu
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'report')
         })
      } else if (foundUser && text === localText.reportsBtnEng) {
         const currentMonth = new Date().getMonth() + 1;
         const monthlyInput = await model.monthlyInput(foundUser.id, currentMonth)
         const monthlyOutput = await model.monthlyOutput(foundUser.id, currentMonth)
         const monthlyByCategories = await model.monthlyByCategories(foundUser.id, currentMonth, 'en')

         const replacedText = localText.reportMonthlyTextEng
            .replace(/%monthName%/g, months.find(m => m.number == currentMonth).name_eng)

         const reportMonthly = `${replacedText}\n\n${localText.reportInputTextEng} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputTextEng} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesTextEng}\n${monthlyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

         bot.sendMessage(chatId, reportMonthly, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.otherMonthsBtnEng
                     },
                  ],
                  [
                     {
                        text: localText.seeMoreBtnEng
                     }
                  ],
                  [
                     {
                        text: localText.backBtnEng
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'report')
         })
      } else if (foundUser && text == localText.balancesBtnUz) {
         const userBalances = await model.userBalances(foundUser.id)
         const balancesText = `${localText.balancesTextUz}\n\n${userBalances.map(item => `${item.currency}: ${formatBalanceWithSpaces(item.total_balance)}\n`).join('')}`

         bot.sendMessage(chatId, balancesText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.backBtnUz
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'balances')
         })
      } else if (foundUser && text == localText.balancesBtnRu) {
         const userBalances = await model.userBalances(foundUser.id)
         const balancesText = `${localText.balancesTextRu}\n\n${userBalances.map(item => `${item.currency}: ${formatBalanceWithSpaces(item.total_balance)}\n`).join('')}`

         bot.sendMessage(chatId, balancesText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.backBtnRu
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'balances')
         })
      } else if (foundUser && text == localText.balancesBtnEng) {
         const userBalances = await model.userBalances(foundUser.id)
         const balancesText = `${localText.balancesTextEng}\n\n${userBalances.map(item => `${item.currency}: ${formatBalanceWithSpaces(item.total_balance)}\n`).join('')}`

         bot.sendMessage(chatId, balancesText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.backBtnEng
                     }
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'balances')
         })
      } else if (foundUser && text == localText.debtBtnUz) {
         const debtsList = await model.debtsList(foundUser.id)
         const debtText = `${localText.debtTextUz}\n\n${debtsList.map(item => `${localText.debtGivenTextUz} ${formatDateAdvanced(item.given_date)}\n${localText.debtWhoTextUz} ${item.name}\n${localText.debtAmountTextUz} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(item.deadline)}\n\n`).join('')}`

         bot.sendMessage(chatId, debtText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.backBtnUz
                     }
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'debt')
         })
      } else if (foundUser && text == localText.debtBtnRu) {
         const debtsList = await model.debtsList(foundUser.id)
         const debtText = `${localText.debtTextRu}\n\n${debtsList.map(item => `${localText.debtGivenTextRu} ${formatDateAdvanced(item.given_date)}\n${localText.debtWhoTextRu} ${item.name}\n${localText.debtAmountTextRu} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(item.deadline)}\n\n`).join('')}`

         bot.sendMessage(chatId, debtText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.backBtnRu
                     }
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'debt')
         })
      } else if (foundUser && text == localText.debtBtnEng) {
         const debtsList = await model.debtsList(foundUser.id)
         const debtText = `${localText.debtTextEng}\n\n${debtsList.map(item => `${localText.debtGivenTextEng} ${formatDateAdvanced(item.given_date)}\n${localText.debtWhoTextEng} ${item.name}\n${localText.debtAmountTextEng} ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(item.deadline)}\n\n`).join('')}`

         bot.sendMessage(chatId, debtText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.backBtnRu
                     }
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'debt')
         })
      } else if (foundUser && text == localText.premiumBtnUz) {
         if (foundUser.premium) {
            if (foundUser.duration) {
               const userCard = await model.userCard(chatId)
               const cardsKeyboard = userCard.map(card => {
                  return [{
                     text: card.card_number_hash,
                     callback_data: `card_${card?.id}`
                  }];
               });
               cardsKeyboard.push(
                  [{
                     text: localText.addCardBtnUz,
                     web_app: {
                        url: `https://payment.hisobchiai.admob.uz/${chatId}`
                     }
                  }],
                  [{
                     text: localText.unsubscribeBtnUz,
                     callback_data: "stoped_subscribe"
                  }],
                  [{
                     text: localText.backBtnUz,
                     callback_data: "back_menu"
                  }],
               )
               const text = localText.premiumDurationTextUz.replace(/%expiredDate%/g, formatDatePremium(foundUser?.expired_date));
               bot.sendMessage(chatId, text, {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: cardsKeyboard,
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'premium')
               })
            } else {
               const text = localText.premiumText2Uz.replace(/%expiredDate%/g, formatDatePremium(foundUser?.expired_date));
               bot.sendMessage(chatId, text, {
                  parse_mode: "HTML",
                  reply_markup: {
                     keyboard: [
                        [
                           {
                              text: localText.backBtnUz
                           }
                        ]
                     ],
                     resize_keyboard: true
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'premium')
               })
            }
         } else {
            const priceList = await model.priceList(foundUser?.bot_lang)
            const priceKeyboard = priceList
               .filter(item => !(foundUser?.used_free && item.price == 0))
               .map(item => {
                  const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                  if (item.period == 30) {
                     return [{
                        text,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }];
                  } else {
                     return [{
                        text,
                        callback_data: `tarif_${item.id}`
                     }];
                  }
               });

            bot.sendMessage(chatId, localText.premiumTextUz, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: priceKeyboard
               }
            }).then(async () => {
               await model.editStep(chatId, 'payment')
            })
         }
      } else if (foundUser && text == localText.premiumBtnRu) {
         if (foundUser.premium) {
            if (foundUser.duration) {
               const userCard = await model.userCard(chatId)
               const cardsKeyboard = userCard.map(card => {
                  return [{
                     text: card.card_number_hash,
                     callback_data: `card_${card?.id}`
                  }];
               });
               cardsKeyboard.push(
                  [{
                     text: localText.addCardBtnRu,
                     web_app: {
                        url: `https://payment.hisobchiai.admob.uz/${chatId}`
                     }
                  }],
                  [{
                     text: localText.unsubscribeBtnRu,
                     callback_data: "stoped_subscribe"
                  }],
                  [{
                     text: localText.backBtnRu,
                     callback_data: "back_menu"
                  }],
               )
               const text = localText.premiumDurationTextRu.replace(/%expiredDate%/g, formatDatePremium(foundUser?.expired_date));
               bot.sendMessage(chatId, text, {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: cardsKeyboard,
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'premium')
               })
            } else {
               const text = localText.premiumText2Ru.replace(/%expiredDate%/g, formatDatePremium(foundUser?.expired_date));
               bot.sendMessage(chatId, text, {
                  parse_mode: "HTML",
                  reply_markup: {
                     keyboard: [
                        [
                           {
                              text: localText.backBtnRu
                           }
                        ]
                     ],
                     resize_keyboard: true
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'premium')
               })
            }
         } else {
            const priceList = await model.priceList(foundUser?.bot_lang)
            const priceKeyboard = priceList
               .filter(item => !(foundUser?.used_free && item.price == 0))
               .map(item => {
                  const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                  if (item.period == 30) {
                     return [{
                        text,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }];
                  } else {
                     return [{
                        text,
                        callback_data: `tarif_${item.id}`
                     }];
                  }
               });

            bot.sendMessage(chatId, localText.premiumTextRu, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: priceKeyboard
               }
            }).then(async () => {
               await model.editStep(chatId, 'payment')
            })
         }
      } else if (foundUser && text == localText.premiumBtnEng) {
         if (foundUser.premium) {
            if (foundUser.duration) {
               const userCard = await model.userCard(chatId)
               const cardsKeyboard = userCard.map(card => {
                  return [{
                     text: card.card_number_hash,
                     callback_data: `card_${card?.id}`
                  }];
               });
               cardsKeyboard.push(
                  [{
                     text: localText.addCardBtnEng,
                     web_app: {
                        url: `https://payment.hisobchiai.admob.uz/${chatId}`
                     }
                  }],
                  [{
                     text: localText.unsubscribeBtnEng,
                     callback_data: "stoped_subscribe"
                  }],
                  [{
                     text: localText.backBtnEng,
                     callback_data: "back_menu"
                  }],
               )
               const text = localText.premiumDurationTextEng.replace(/%expiredDate%/g, formatDatePremium(foundUser?.expired_date));
               bot.sendMessage(chatId, text, {
                  parse_mode: "HTML",
                  reply_markup: {
                     inline_keyboard: cardsKeyboard,
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'premium')
               })
            } else {
               const text = localText.premiumText2Eng.replace(/%expiredDate%/g, formatDatePremium(foundUser?.expired_date));
               bot.sendMessage(chatId, text, {
                  parse_mode: "HTML",
                  reply_markup: {
                     keyboard: [
                        [
                           {
                              text: localText.backBtnEng
                           }
                        ]
                     ],
                     resize_keyboard: true
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'premium')
               })
            }
         } else {
            const priceList = await model.priceList(foundUser?.bot_lang)
            const priceKeyboard = priceList
               .filter(item => !(foundUser?.used_free && item.price == 0))
               .map(item => {
                  const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                  if (item.period == 30) {
                     return [{
                        text,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }];
                  } else {
                     return [{
                        text,
                        callback_data: `tarif_${item.id}`
                     }];
                  }
               });

            bot.sendMessage(chatId, localText.premiumTextEng, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: priceKeyboard
               }
            }).then(async () => {
               await model.editStep(chatId, 'payment')
            })
         }
      } else if (text == localText.otherMonthsBtnUz) {
         const monthsKeyboard = [];
         for (let i = 0; i < months.length; i += 2) {
            const row = [];
            row.push({ text: months[i].name_uz });
            if (months[i + 1]) {
               row.push({ text: months[i + 1].name_uz });
            }
            monthsKeyboard.push(row);
         }

         monthsKeyboard.push([
            {
               text: localText.backBtnUz
            }
         ])

         bot.sendMessage(chatId, localText.chooseMonthTextUz, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: monthsKeyboard,
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'choose_month')
         })

      } else if (text == localText.otherMonthsBtnRu) {
         const monthsKeyboard = [];
         for (let i = 0; i < months.length; i += 2) {
            const row = [];
            row.push({ text: months[i].name_ru });
            if (months[i + 1]) {
               row.push({ text: months[i + 1].name_ru });
            }
            monthsKeyboard.push(row);
         }

         monthsKeyboard.push([
            {
               text: localText.backBtnRu
            }
         ])

         bot.sendMessage(chatId, localText.chooseMonthTextRu, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: monthsKeyboard,
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'choose_month')
         })

      } else if (text == localText.otherMonthsBtnEng) {
         const monthsKeyboard = [];
         for (let i = 0; i < months.length; i += 2) {
            const row = [];
            row.push({ text: months[i].name_eng });
            if (months[i + 1]) {
               row.push({ text: months[i + 1].name_eng });
            }
            monthsKeyboard.push(row);
         }

         monthsKeyboard.push([
            {
               text: localText.backBtnEng
            }
         ])

         bot.sendMessage(chatId, localText.chooseMonthTextEng, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: monthsKeyboard,
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'choose_month')
         })

      } else if (foundUser && text == localText.seeMoreBtnUz) {
         const currentMonth = new Date().getMonth() + 1;
         const historiesBalanceCurrentMonthOutcome = await model.historiesBalanceCurrentMonthOutcome(foundUser.id, currentMonth, 'uz')
         const historiesBalanceCurrentMonthIncome = await model.historiesBalanceCurrentMonthIncome(foundUser.id, currentMonth, 'uz')
         const foundMonth = months.find(item => item.number == currentMonth)
         const replacedSeeMoreText = localText.seeMoreTextUz.replace(/%monthName%/g, foundMonth.name_uz)
         const seeMoreText = `${replacedSeeMoreText}\n\n<b>${localText.reportOutputTextUz}</b>\n${historiesBalanceCurrentMonthOutcome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentTextUz} ${item.comment}\n\n`).join('')}\n<b>${localText.reportInputTextUz}</b>\n${historiesBalanceCurrentMonthIncome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentTextUz} ${item.comment}\n\n`).join('')}`

         bot.sendMessage(chatId, seeMoreText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.otherMonthsBtnUz
                     }
                  ],
                  [
                     {
                        text: localText.backBtnUz
                     }
                  ],
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'see_more_histories')
         })

      } else if (foundUser && text == localText.seeMoreBtnRu) {
         const currentMonth = new Date().getMonth() + 1;
         const historiesBalanceCurrentMonthOutcome = await model.historiesBalanceCurrentMonthOutcome(foundUser.id, currentMonth, 'ru')
         const historiesBalanceCurrentMonthIncome = await model.historiesBalanceCurrentMonthIncome(foundUser.id, currentMonth, 'ru')
         const foundMonth = months.find(item => item.number == currentMonth)
         const replacedSeeMoreText = localText.seeMoreTextRu.replace(/%monthName%/g, foundMonth.name_uz)
         const seeMoreText = `${replacedSeeMoreText}\n\n<b>${localText.reportOutputTextRu}</b>\n${historiesBalanceCurrentMonthOutcome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentTextRu} ${item.comment}\n\n`).join('')}\n<b>${localText.reportInputTextRu}</b>\n${historiesBalanceCurrentMonthIncome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentTextRu} ${item.comment}\n\n`).join('')}`

         bot.sendMessage(chatId, seeMoreText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.otherMonthsBtnRu
                     }
                  ],
                  [
                     {
                        text: localText.backBtnRu
                     }
                  ],
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'see_more_histories')
         })

      } else if (foundUser && text == localText.seeMoreBtnEng) {
         const currentMonth = new Date().getMonth() + 1;
         const historiesBalanceCurrentMonthOutcome = await model.historiesBalanceCurrentMonthOutcome(foundUser.id, currentMonth, 'en')
         const historiesBalanceCurrentMonthIncome = await model.historiesBalanceCurrentMonthIncome(foundUser.id, currentMonth, 'en')
         const foundMonth = months.find(item => item.number == currentMonth)
         const replacedSeeMoreText = localText.seeMoreTextEng.replace(/%monthName%/g, foundMonth.name_uz)
         const seeMoreText = `${replacedSeeMoreText}\n\n<b>${localText.reportOutputTextEng}</b>\n${historiesBalanceCurrentMonthOutcome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentTextEng} ${item.comment}\n\n`).join('')}\n<b>${localText.reportInputTextEng}</b>\n${historiesBalanceCurrentMonthIncome.map(item => `${formatDateAdvanced(item.date)} | ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n${item.name}\n${localText.addReportCommentTextEng} ${item.comment}\n\n`).join('')}`

         bot.sendMessage(chatId, seeMoreText, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.otherMonthsBtnEng
                     }
                  ],
                  [
                     {
                        text: localText.backBtnEng
                     }
                  ],
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'see_more_histories')
         })

      } else if (text == localText.limitBtnUz) {
         if (foundUser.limit_amount > 0) {
            bot.sendMessage(
               chatId,
               localText.limitText2Uz.replace(/%limit%/g, formatBalanceWithSpaces(foundUser.limit_amount)), {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.backBtnUz
                        }
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'add_limit')
            })
         } else {
            bot.sendMessage(
               chatId,
               localText.limitTextUz, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.backBtnUz
                        }
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'add_limit')
            })
         }
      } else if (text == localText.limitBtnRu) {
         if (foundUser.limit_amount > 0) {
            bot.sendMessage(
               chatId,
               localText.limitText2Ru.replace(/%limit%/g, formatBalanceWithSpaces(foundUser.limit_amount)), {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.backBtnRu
                        }
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'add_limit')
            })
         } else {
            bot.sendMessage(
               chatId,
               localText.limitTextRu, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.backBtnRu
                        }
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'add_limit')
            })
         }
      } else if (text == localText.limitBtnEng) {
         if (foundUser.limit_amount > 0) {
            bot.sendMessage(
               chatId,
               localText.limitText2Eng.replace(/%limit%/g, formatBalanceWithSpaces(foundUser.limit_amount)), {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.backBtnEng
                        }
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'add_limit')
            })
         } else {
            bot.sendMessage(
               chatId,
               localText.limitTextEng, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.backBtnEng
                        }
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'add_limit')
            })
         }
      } else if (text == localText.changeLangBtnUz) {
         bot.sendMessage(chatId, localText.changeLangTextUz, {
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: '🇺🇿 Uz',
                     },
                     {
                        text: '🇷🇺 Ру',
                     },
                     {
                        text: '🇬🇧 Eng',
                     },
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'change_lang')
         })
      } else if (text == localText.changeLangBtnRu) {
         bot.sendMessage(chatId, localText.changeLangTextRu, {
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: '🇺🇿 Uz',
                     },
                     {
                        text: '🇷🇺 Ру',
                     },
                     {
                        text: '🇬🇧 Eng',
                     },
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'change_lang')
         })
      } else if (text == localText.changeLangBtnEng) {
         bot.sendMessage(chatId, localText.changeLangTextEng, {
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: '🇺🇿 Uz',
                     },
                     {
                        text: '🇷🇺 Ру',
                     },
                     {
                        text: '🇬🇧 Eng',
                     },
                  ],
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'change_lang')
         })
      } else if (text == localText.backBtnUz) {
         bot.sendMessage(chatId, localText.menuTextUz, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (text == localText.backBtnRu) {
         bot.sendMessage(chatId, localText.menuTextRu, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (text == localText.backBtnEng) {
         bot.sendMessage(chatId, localText.menuTextEng, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnEng
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
         const monthlyByCategories = await model.monthlyByCategories(foundUser.id, foundMonth.number)

         if (foundUser?.bot_lang == 'uz') {
            const replacedText = localText.reportMonthlyTextUz
               .replace(/%monthName%/g, foundMonth.name_uz)

            const reportMonthly = `${replacedText}\n\n${localText.reportInputTextUz} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputTextUz} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesTextUz}\n${monthlyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

            bot.sendMessage(chatId, reportMonthly, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.otherMonthsBtnUz
                        },
                     ],
                     [
                        {
                           text: localText.seeMoreBtnUz
                        }
                     ],
                     [
                        {
                           text: localText.backBtnUz
                        }
                     ],
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'report')
            })
         } else if (foundUser?.bot_lang == 'ru') {
            const replacedText = localText.reportMonthlyTextRu
               .replace(/%monthName%/g, foundMonth.name_ru)

            const reportMonthly = `${replacedText}\n\n${localText.reportInputTextRu} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputTextRu} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesTextRu}\n${monthlyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

            bot.sendMessage(chatId, reportMonthly, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.otherMonthsBtnRu
                        },
                     ],
                     [
                        {
                           text: localText.seeMoreBtnRu
                        }
                     ],
                     [
                        {
                           text: localText.backBtnRu
                        }
                     ],
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'report')
            })
         } else if (foundUser?.bot_lang == 'eng') {
            const replacedText = localText.reportMonthlyTextEng
               .replace(/%monthName%/g, foundMonth.name_ru)

            const reportMonthly = `${replacedText}\n\n${localText.reportInputTextEng} ${monthlyInput.length > 0 ? monthlyInput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}${localText.reportOutputTextEng} ${monthlyOutput?.length > 0 ? monthlyOutput.map(item => `${item.currency} ${formatBalanceWithSpaces(item.sum)}\n`).join('') : "0\n"}\n\n${localText.reportCatgoriesTextEng}\n${monthlyByCategories.map(item => `${item.income ? '🟢' : '🔴'} ${item.name}: ${item.currency} ${formatBalanceWithSpaces(item.amount)}\n`).join('')}`;

            bot.sendMessage(chatId, reportMonthly, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.otherMonthsBtnEng
                        },
                     ],
                     [
                        {
                           text: localText.seeMoreBtnEng
                        }
                     ],
                     [
                        {
                           text: localText.backBtnEng
                        }
                     ],
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'report')
            })
         }
      } else if (foundUser && foundUser?.bot_step == 'add_limit' && text) {
         const limit = Number(text.split(' ').join(''));

         if (typeof limit === 'number' && !isNaN(limit)) {
            const addLimitAmount = await model.addLimitAmount(chatId, limit)

            if (addLimitAmount) {
               if (foundUser?.bot_lang == 'uz') {
                  bot.sendMessage(chatId, localText.limitText3Uz, {
                     parse_mode: "HTML",
                     reply_markup: {
                        keyboard: [
                           [
                              {
                                 text: localText.backBtnUz
                              }
                           ]
                        ],
                        resize_keyboard: true
                     }
                  })
               } else if (foundUser?.bot_lang == 'ru') {
                  bot.sendMessage(chatId, localText.limitText3Ru, {
                     parse_mode: "HTML",
                     reply_markup: {
                        keyboard: [
                           [
                              {
                                 text: localText.backBtnRu
                              }
                           ]
                        ],
                        resize_keyboard: true
                     }
                  })
               } else if (foundUser?.bot_lang == 'eng') {
                  bot.sendMessage(chatId, localText.limitText3Eng, {
                     parse_mode: "HTML",
                     reply_markup: {
                        keyboard: [
                           [
                              {
                                 text: localText.backBtnRu
                              }
                           ]
                        ],
                        resize_keyboard: true
                     }
                  })
               }
            }
         } else {
            if (foundUser?.bot_lang == 'uz') {
               bot.sendMessage(chatId, localText.limitErrorTextUz, {
                  parse_mode: "HTML"
               }).then(async () => {
                  await model.editStep(chatId, 'add_limit')
               })
            } else if (foundUser?.bot_lang == 'ru') {
               bot.sendMessage(chatId, localText.limitErrorTextRu, {
                  parse_mode: "HTML"
               }).then(async () => {
                  await model.editStep(chatId, 'add_limit')
               })
            } else if (foundUser?.bot_lang == 'eng') {
               bot.sendMessage(chatId, localText.limitErrorTextEng, {
                  parse_mode: "HTML"
               }).then(async () => {
                  await model.editStep(chatId, 'add_limit')
               })
            }
         }
      } else if (foundUser?.premium) {
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
                  const categories = await model.categories()
                  const jsonData = await analyzeVoice(`../../public/audios/temp_${fileId}.ogg`, categories)

                  if (jsonData == 'wrong') {
                     if (foundUser.bot_lang == 'uz') {
                        bot.sendMessage(chatId, localText.wrongTextUz)
                     } else if (foundUser.bot_lang == 'ru') {
                        bot.sendMessage(chatId, localText.wrongTextRU)
                     } else if (foundUser.bot_lang == 'eng') {
                        bot.sendMessage(chatId, localText.wrongTextEng)
                     }
                  } else if (jsonData?.length > 0) {
                     jsonData?.forEach(async (item) => {
                        console.log(item)
                        const foundBalance = await model.foundBalance(foundUser.id, item.currency,)
                        let foundCategory;
                        foundCategory = await model.foundCategory(item.category, foundUser?.bot_lang)

                        if (!foundCategory) {
                           const categoryData = await newCategoryData(item.category)
                           foundCategory = await model.addCategory(categoryData, foundUser?.bot_lang)
                        }

                        const addReport = await model.addReport(
                           foundUser?.id,
                           foundBalance?.id,
                           foundCategory?.id,
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

                           if (foundUser?.bot_lang == 'uz') {
                              const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextUz} ${addDebt.name}\n${localText.debtAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(addDebt.deadline)}`;
                              bot.sendMessage(chatId, debtText, {
                                 parse_mode: "HTML",
                                 reply_markup: {
                                    inline_keyboard: [
                                       [
                                          {
                                             text: localText.cancelBtnUz,
                                             callback_data: `cancel_debt_${addDebt.id}`
                                          }
                                       ]
                                    ]
                                 }
                              })
                           } else if (foundUser?.bot_lang == 'ru') {
                              const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextRu} ${addDebt.name}\n${localText.debtAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(addDebt.deadline)}`;
                              bot.sendMessage(chatId, debtText, {
                                 parse_mode: "HTML",
                                 reply_markup: {
                                    inline_keyboard: [
                                       [
                                          {
                                             text: localText.cancelBtnRu,
                                             callback_data: `cancel_debt_${addDebt.id}`
                                          }
                                       ]
                                    ]
                                 }
                              })
                           } else if (foundUser?.bot_lang == 'eng') {
                              const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTexEng} ${addDebt.name}\n${localText.debtAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(addDebt.deadline)}`;
                              bot.sendMessage(chatId, debtText, {
                                 parse_mode: "HTML",
                                 reply_markup: {
                                    inline_keyboard: [
                                       [
                                          {
                                             text: localText.cancelBtnEng,
                                             callback_data: `cancel_debt_${addDebt.id}`
                                          }
                                       ]
                                    ]
                                 }
                              })
                           }
                        }

                        if (foundUser?.bot_lang == 'uz') {
                           const reportText = `${localText.addReportTextUz}\n\n${addReport.income ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${addReport.comment}`
                           bot.sendMessage(chatId, reportText, {
                              parse_mode: 'HTML',
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtnUz,
                                          callback_data: `cancel_report_${addReport.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        } else if (foundUser?.bot_lang == 'ru') {
                           const reportText = `${localText.addReportTextRu}\n\n${addReport.income ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${addReport.comment}`
                           bot.sendMessage(chatId, reportText, {
                              parse_mode: 'HTML',
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtnRu,
                                          callback_data: `cancel_report_${addReport.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        } else if (foundUser?.bot_lang == 'eng') {
                           const reportText = `${localText.addReportTextEng}\n\n${addReport.income ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${addReport.comment}`
                           bot.sendMessage(chatId, reportText, {
                              parse_mode: 'HTML',
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtnEng,
                                          callback_data: `cancel_report_${addReport.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        }

                     })
                  } else if (typeof jsonData === 'object' && value !== null && !Array.isArray(value)) {
                     const foundBalance = await model.foundBalance(foundUser.id, jsonData.currency,)
                     let foundCategory;
                     foundCategory = await model.foundCategory(jsonData.category, foundUser?.bot_lang)

                     if (!foundCategory) {
                        const categoryData = await newCategoryData(jsonData.category)
                        foundCategory = await model.addCategory(categoryData, foundUser?.bot_lang)
                     }
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

                        if (foundUser?.bot_lang == 'uz') {
                           const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextUz} ${addDebt.name}\n${localText.debtAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(addDebt.deadline)}`;
                           bot.sendMessage(chatId, debtText, {
                              parse_mode: "HTML",
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtnUz,
                                          callback_data: `cancel_debt_${addDebt.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        } else if (foundUser?.bot_lang == 'ru') {
                           const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextRu} ${addDebt.name}\n${localText.debtAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(addDebt.deadline)}`;
                           bot.sendMessage(chatId, debtText, {
                              parse_mode: "HTML",
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtnRu,
                                          callback_data: `cancel_debt_${addDebt.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        } else if (foundUser?.bot_lang == 'eng') {
                           const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTexEng} ${addDebt.name}\n${localText.debtAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(addDebt.deadline)}`;
                           bot.sendMessage(chatId, debtText, {
                              parse_mode: "HTML",
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText.cancelBtnEng,
                                          callback_data: `cancel_debt_${addDebt.id}`
                                       }
                                    ]
                                 ]
                              }
                           })
                        }
                     }

                     if (foundUser?.bot_lang == 'uz') {
                        const reportText = `${localText.addReportTextUz}\n\n${addReport.income ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${addReport.comment}`
                        bot.sendMessage(chatId, reportText, {
                           parse_mode: 'HTML',
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtnUz,
                                       callback_data: `cancel_report_${addReport.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     } else if (foundUser?.bot_lang == 'ru') {
                        const reportText = `${localText.addReportTextRu}\n\n${addReport.income ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${addReport.comment}`
                        bot.sendMessage(chatId, reportText, {
                           parse_mode: 'HTML',
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtnRu,
                                       callback_data: `cancel_report_${addReport.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     } else if (foundUser?.bot_lang == 'eng') {
                        const reportText = `${localText.addReportTextEng}\n\n${addReport.income ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${addReport.comment}`
                        bot.sendMessage(chatId, reportText, {
                           parse_mode: 'HTML',
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtnEng,
                                       callback_data: `cancel_report_${addReport.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     }

                  }
               })
            } catch (error) {
               console.error('Error during upload or analysis:', error);
            }

         } else if (text && text != '/start') {
            const categories = await model.categories()
            const jsonData = await analyzeText(text, categories)

            if (jsonData == 'wrong') {
               if (foundUser.bot_lang == 'uz') {
                  bot.sendMessage(chatId, localText.wrongTextUz)
               } else if (foundUser.bot_lang == 'ru') {
                  bot.sendMessage(chatId, localText.wrongTextRU)
               } else if (foundUser.bot_lang == 'eng') {
                  bot.sendMessage(chatId, localText.wrongTextEng)
               }
            } else if (jsonData?.length > 0) {
               jsonData?.forEach(async (item) => {
                  const foundBalance = await model.foundBalance(foundUser.id, item.currency,)
                  let foundCategory;
                  foundCategory = await model.foundCategory(item.category, foundUser?.bot_lang)

                  if (!foundCategory) {
                     const categoryData = await newCategoryData(item.category)
                     foundCategory = await model.addCategory(categoryData, foundUser?.bot_lang)
                  }

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

                     if (foundUser?.bot_lang == 'uz') {
                        const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextUz} ${addDebt.name}\n${localText.debtAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(addDebt.deadline)}`;
                        bot.sendMessage(chatId, debtText, {
                           parse_mode: "HTML",
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtnUz,
                                       callback_data: `cancel_debt_${addDebt.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     } else if (foundUser?.bot_lang == 'ru') {
                        const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextRu} ${addDebt.name}\n${localText.debtAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(addDebt.deadline)}`;
                        bot.sendMessage(chatId, debtText, {
                           parse_mode: "HTML",
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtnRu,
                                       callback_data: `cancel_debt_${addDebt.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     } else if (foundUser?.bot_lang == 'eng') {
                        const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTexEng} ${addDebt.name}\n${localText.debtAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(addDebt.deadline)}`;
                        bot.sendMessage(chatId, debtText, {
                           parse_mode: "HTML",
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText.cancelBtnEng,
                                       callback_data: `cancel_debt_${addDebt.id}`
                                    }
                                 ]
                              ]
                           }
                        })
                     }
                  }

                  if (foundUser?.bot_lang == 'uz') {
                     const reportText = `${localText.addReportTextUz}\n\n${addReport.income ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${addReport.comment}`
                     bot.sendMessage(chatId, reportText, {
                        parse_mode: 'HTML',
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtnUz,
                                    callback_data: `cancel_report_${addReport.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  } else if (foundUser?.bot_lang == 'ru') {
                     const reportText = `${localText.addReportTextRu}\n\n${addReport.income ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${addReport.comment}`
                     bot.sendMessage(chatId, reportText, {
                        parse_mode: 'HTML',
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtnRu,
                                    callback_data: `cancel_report_${addReport.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  } else if (foundUser?.bot_lang == 'eng') {
                     const reportText = `${localText.addReportTextEng}\n\n${addReport.income ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${addReport.comment}`
                     bot.sendMessage(chatId, reportText, {
                        parse_mode: 'HTML',
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtnEng,
                                    callback_data: `cancel_report_${addReport.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  }

               })
            } else if (typeof jsonData === 'object' && value !== null && !Array.isArray(value)) {
               const foundBalance = await model.foundBalance(foundUser.id, jsonData.currency,)
               let foundCategory;
               foundCategory = await model.foundCategory(jsonData.category, foundUser?.bot_lang)

               if (!foundCategory) {
                  const categoryData = await newCategoryData(jsonData.category)
                  foundCategory = await model.addCategory(categoryData, foundUser?.bot_lang)
               }
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

                  if (foundUser?.bot_lang == 'uz') {
                     const debtText = `${localText.addDebtTextUz}\n\n${localText.debtGivenTextUz} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextUz} ${addDebt.name}\n${localText.debtAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextUz} ${formatDateAdvanced(addDebt.deadline)}`;
                     bot.sendMessage(chatId, debtText, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtnUz,
                                    callback_data: `cancel_debt_${addDebt.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  } else if (foundUser?.bot_lang == 'ru') {
                     const debtText = `${localText.addDebtTextRu}\n\n${localText.debtGivenTextRu} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTextRu} ${addDebt.name}\n${localText.debtAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextRu} ${formatDateAdvanced(addDebt.deadline)}`;
                     bot.sendMessage(chatId, debtText, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtnRu,
                                    callback_data: `cancel_debt_${addDebt.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  } else if (foundUser?.bot_lang == 'eng') {
                     const debtText = `${localText.daddDebtTextEng}\n\n${localText.debtGivenTextEng} ${formatDateAdvanced(addDebt.given_date)}\n${localText.debtWhoTexEng} ${addDebt.name}\n${localText.debtAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addDebt.amount)}\n${localText.debtDeadlineTextEng} ${formatDateAdvanced(addDebt.deadline)}`;
                     bot.sendMessage(chatId, debtText, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText.cancelBtnEng,
                                    callback_data: `cancel_debt_${addDebt.id}`
                                 }
                              ]
                           ]
                        }
                     })
                  }
               }

               if (foundUser?.bot_lang == 'uz') {
                  const reportText = `${localText.addReportTextUz}\n\n${addReport.income ? "<b>Kirim:</b>" : "<b>Chiqim:</b>"}\n${localText.addReportDateTextUz} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextUz} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextUz} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextUz} ${addReport.comment}`
                  bot.sendMessage(chatId, reportText, {
                     parse_mode: 'HTML',
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText.cancelBtnUz,
                                 callback_data: `cancel_report_${addReport.id}`
                              }
                           ]
                        ]
                     }
                  })
               } else if (foundUser?.bot_lang == 'ru') {
                  const reportText = `${localText.addReportTextRu}\n\n${addReport.income ? "<b>Доходы:</b>" : "<b>Расходы:</b>"}\n${localText.addReportDateTextRu} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextRu} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextRu} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextRu} ${addReport.comment}`
                  bot.sendMessage(chatId, reportText, {
                     parse_mode: 'HTML',
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText.cancelBtnRu,
                                 callback_data: `cancel_report_${addReport.id}`
                              }
                           ]
                        ]
                     }
                  })
               } else if (foundUser?.bot_lang == 'eng') {
                  const reportText = `${localText.addReportTextEng}\n\n${addReport.income ? "<b>Income:</b>" : "<b>Outcome:</b>"}\n${localText.addReportDateTextEng} <b>${formatDateAdvanced(addReport.date)}</b>\n\n${localText.addReportAmountTextEng} ${foundBalance.currency} ${formatBalanceWithSpaces(addReport.amount)}\n${localText.addReportCategoryTextEng} <b>${foundCategory.name}</b>\n${localText.addReportCommentTextEng} ${addReport.comment}`
                  bot.sendMessage(chatId, reportText, {
                     parse_mode: 'HTML',
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText.cancelBtnEng,
                                 callback_data: `cancel_report_${addReport.id}`
                              }
                           ]
                        ]
                     }
                  })
               }
            }
         }
      } else if (text && text != '/start' && !foundUser.premium && foundUser.bot_step != "register") {
         if (foundUser?.bot_lang == 'uz') {
            const priceList = await model.priceList(foundUser?.bot_lang)
            const priceKeyboard = priceList
               .filter(item => !(foundUser?.used_free && item.price == 0))
               .map(item => {
                  const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                  if (item.period == 30) {
                     return [{
                        text,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }];
                  } else {
                     return [{
                        text,
                        callback_data: `tarif_${item.id}`
                     }];
                  }
               });
            const premiumText = foundUser.premium ? `${localText.premiumTextUz}\n\n${localText.premiumExpiredTextUz} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumTextUz

            bot.sendMessage(chatId, premiumText, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: priceKeyboard
               }
            }).then(async () => {
               await model.editStep(chatId, 'payment')
            })
         } else if (foundUser?.bot_lang == 'ru') {
            const priceList = await model.priceList(foundUser?.bot_lang)
            const priceKeyboard = priceList
               ?.filter(item => !(foundUser?.used_free && item.price == 0))
               ?.map(item => {
                  const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                  if (item.period == 30) {
                     return [{
                        text,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }];
                  } else {
                     return [{
                        text,
                        callback_data: `tarif_${item.id}`
                     }];
                  }
               });
            const premiumText = foundUser.premium ? `${localText.premiumTextRu}\n\n${localText.premiumExpiredTextRu} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumTextRu

            bot.sendMessage(chatId, premiumText, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: priceKeyboard
               }
            }).then(async () => {
               await model.editStep(chatId, 'payment')
            })
         } else if (foundUser?.bot_lang == 'eng') {
            const priceList = await model.priceList(foundUser?.bot_lang)
            const priceKeyboard = priceList
               .filter(item => !(foundUser?.used_free && item.price == 0))
               .map(item => {
                  const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

                  if (item.period == 30) {
                     return [{
                        text,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }];
                  } else {
                     return [{
                        text,
                        callback_data: `tarif_${item.id}`
                     }];
                  }
               });
            const premiumText = foundUser.premium ? `${localText.premiumTextEng}\n\n${localText.premiumExpiredTextEng} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumTextEng

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
   }
})

bot.on('callback_query', async (msg) => {
   const chatId = msg.message.chat.id;
   const data = msg.data;
   const foundUser = await model.foundUser(chatId)

   if (data.startsWith('tarif_')) {
      const tarifId = data?.split('tarif_')[1]
      const tarif = await model.foundTarif(tarifId, foundUser?.bot_lang)
      console.log(tarif)
      const foundPartner = await model.foundPartner(foundUser?.partner_id)
      const price =
         foundPartner?.discount > 0
            ? Math.max(tarif.price - foundPartner.discount, 0)
            : foundPartner?.additional > 0
               ? Math.max(tarif.price + foundPartner.additional, 0)
               : tarif.price;

      if (tarif && tarif.period == 30) {
         await model.addMonthlyAmount(chatId, price)

         if (foundUser?.bot_lang == 'uz') {
            const replacedText = localText.priceTextUz
               .replace(/%price%/g, formatBalanceWithSpaces(price))
               .replace(/%title%/g, tarif?.title);
            bot.sendMessage(chatId, replacedText, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [{
                        text: localText.addCardBtnUz,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }],
                     [{
                        text: localText.backBtnUz
                     }]
                  ],
                  resize_keyboard: true
               }
            })
         } else if (foundUser?.bot_lang == 'ru') {
            const replacedText = localText.priceTextRu
               .replace(/%price%/g, formatBalanceWithSpaces(price))
               .replace(/%title%/g, tarif?.title);
            bot.sendMessage(chatId, replacedText, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [{
                        text: localText.addCardBtnRu,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }],
                     [{
                        text: localText.backBtnRu
                     }]
                  ],
                  resize_keyboard: true
               }
            })
         } else if (foundUser?.bot_lang == 'eng') {
            const replacedText = localText.priceTextEng
               .replace(/%price%/g, formatBalanceWithSpaces(price))
               .replace(/%title%/g, tarif?.title);
            bot.sendMessage(chatId, replacedText, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [{
                        text: localText.addCardBtnEng,
                        web_app: {
                           url: `https://payment.hisobchiai.admob.uz/${chatId}`
                        }
                     }],
                     [{
                        text: localText.backBtnEng
                     }]
                  ],
                  resize_keyboard: true
               }
            })
         }
      } else if (tarif && price > 0) {
         const text = `m=6697d19280d270b331826481;ac.user_id=${chatId};ac.tarif=${tarif.title};ac.ilova=Hisobchi_AI;a=${price}00`;
         const base64Encoded = btoa(text);

         if (foundUser?.bot_lang == 'uz') {
            const replacedText = localText.priceTextUz
               .replace(/%price%/g, formatBalanceWithSpaces(price))
               .replace(/%title%/g, tarif?.title);

            bot.sendMessage(chatId, replacedText, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText.clickText,
                           url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Hisobchi_AI&additional_param3=${chatId}&amount=${price}&additional_param4=${tarif.title}`
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
                     //       url: `https://www.uzumbank.uz/open-service?serviceId=498617211&ilova=Hisobchi_AI&tarif=${price.title}&id=${chatId}&amount=${price.price}00`
                     //    }
                     // ],
                  ]
               }
            })
         } else if (foundUser?.bot_lang == 'ru') {
            const replacedText = localText.priceTextRu
               .replace(/%price%/g, formatBalanceWithSpaces(price))
               .replace(/%title%/g, tarif?.title);

            bot.sendMessage(chatId, replacedText, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText.clickText,
                           url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Hisobchi_AI&additional_param3=${chatId}&amount=${price}&additional_param4=${tarif.title}`
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
                     //       url: `https://www.uzumbank.uz/open-service?serviceId=498617211&ilova=Hisobchi_AI&tarif=${price.title}&id=${chatId}&amount=${price.price}00`
                     //    }
                     // ],
                  ]
               }
            })
         } else if (foundUser?.bot_lang == 'eng') {
            const replacedText = localText.priceTextEng
               .replace(/%price%/g, formatBalanceWithSpaces(price))
               .replace(/%title%/g, tarif?.title);

            bot.sendMessage(chatId, replacedText, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText.clickText,
                           url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Hisobchi_AI&additional_param3=${chatId}&amount=${price}&additional_param4=${tarif.title}`
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
                     //       url: `https://www.uzumbank.uz/open-service?serviceId=498617211&ilova=Hisobchi_AI&tarif=${price.title}&id=${chatId}&amount=${price.price}00`
                     //    }
                     // ],
                  ]
               }
            })
         }
      } else if (price == 0 && tarif.price > 0) {
         const expiredDate = calculateExpiredDate(Number(tarif.period))
         await model.editPremium(chatId, expiredDate)

         if (foundUser?.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.menuTextUz, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnUz
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
            })
         } else if (foundUser?.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.menuTextRu, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnRu
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
            })
         } else if (foundUser?.bot_lang == 'eng') {
            bot.sendMessage(chatId, localText.menuTextEng, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnEng
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
            })
         }
      } else if (tarif && !foundUser?.used_free && tarif.price == 0) {
         const expiredDate = calculateExpiredDate(Number(tarif.period))
         await model.editPremium(chatId, expiredDate)

         if (foundUser?.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.menuTextUz, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnUz
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
               await model.editUsedFree(chatId)
            })
         } else if (foundUser?.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.menuTextRu, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnRu
                        }
                     ]
                  ],
                  resize_keyboard: true,
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
               await model.editUsedFree(chatId)
            })
         } else if (foundUser?.bot_lang == 'eng') {
            bot.sendMessage(chatId, localText.menuTextEng, {
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
                     ],
                     [
                        {
                           text: localText.changeLangBtnEng
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
      }
   } else if (data.startsWith('cancel_report_')) {
      const reportid = data?.split('cancel_report_')[1]
      const deleteReport = await model.deleteReport(reportid, foundUser.id)

      if (deleteReport) {
         if (foundUser.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.cancelTextUz, { parse_mode: "HTML", })
         } else if (foundUser.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.cancelTextRu, { parse_mode: "HTML", })
         } else if (foundUser.bot_lang == 'eng') {
            bot.sendMessage(chatId, localText.cancelTextEng, { parse_mode: "HTML", })
         }
      }
   } else if (data.startsWith('cancel_debt_')) {
      const debtid = data?.split('cancel_debt_')[1]
      const deleteDebt = await model.deleteDebt(debtid, foundUser.id)

      if (deleteDebt) {
         if (foundUser.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.cancelTextUz, { parse_mode: "HTML", })
         } else if (foundUser.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.cancelTextRu, { parse_mode: "HTML", })
         } else if (foundUser.bot_lang == 'eng') {
            bot.sendMessage(chatId, localText.cancelTextEng, { parse_mode: "HTML", })
         }
      }
   } else if (data == "stoped_subscribe") {

      if (foundUser?.bot_lang == 'uz') {
         bot.sendMessage(chatId, localText.askStopSubscribeUz, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: localText.askStopSubscribeYesUz,
                        callback_data: "yes_stop"
                     }
                  ],
                  [
                     {
                        text: localText.askStopSubscribeNoUz,
                        callback_data: "no_continue"
                     }
                  ]
               ]
            }
         })
      } else if (foundUser.bot_lang == 'ru') {
         bot.sendMessage(chatId, localText.askStopSubscribeRu, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: localText.askStopSubscribeYesRu,
                        callback_data: "yes_stop"
                     }
                  ],
                  [
                     {
                        text: localText.askStopSubscribeNoRu,
                        callback_data: "no_continue"
                     }
                  ]
               ]
            }
         })
      } else if (foundUser.bot_lang == 'eng') {
         bot.sendMessage(chatId, localText.askStopSubscribeEng, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: localText.askStopSubscribeYesEng,
                        callback_data: "yes_stop"
                     }
                  ],
                  [
                     {
                        text: localText.askStopSubscribeNosEng,
                        callback_data: "no_continue"
                     }
                  ]
               ]
            }
         })
      }
   } else if (data == 'yes_stop') {
      const editDuration = await model.editDuration(chatId, false)

      if (editDuration?.bot_lang == 'uz') {
         bot.sendMessage(chatId, localText.stopedSubscribeTextUz, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (editDuration?.bot_lang == 'ru') {
         bot.sendMessage(chatId, localText.stopedSubscribeTextRu, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (editDuration?.bot_lang == 'eng') {
         bot.sendMessage(chatId, localText.stopedSubscribeTextEng, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnEng
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      }
   } else if (data == 'no_continue') {
      if (foundUser?.bot_lang == 'uz') {
         bot.sendMessage(chatId, localText.menuTextUz, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser?.bot_lang == 'ru') {
         bot.sendMessage(chatId, localText.menuTextRu, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser?.bot_lang == 'eng') {
         bot.sendMessage(chatId, localText.menuTextEng, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnEng
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      }
   } else if (data == 'back_menu') {
      if (foundUser?.bot_lang == 'uz') {
         bot.sendMessage(chatId, localText.menuTextUz, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser?.bot_lang == 'ru') {
         bot.sendMessage(chatId, localText.menuTextRu, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser?.bot_lang == 'eng') {
         bot.sendMessage(chatId, localText.menuTextEng, {
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
                  ],
                  [
                     {
                        text: localText.changeLangBtnEng
                     }
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      }
   } else if (data == 'to_buy') {
      if (foundUser?.bot_lang == 'uz') {
         const priceList = await model.priceList(foundUser?.bot_lang)
         const priceKeyboard = priceList
            .filter(item => !(foundUser?.used_free && item.price == 0))
            .map(item => {
               const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

               if (item.period == 30) {
                  return [{
                     text,
                     web_app: {
                        url: `https://payment.hisobchiai.admob.uz/${chatId}`
                     }
                  }];
               } else {
                  return [{
                     text,
                     callback_data: `tarif_${item.id}`
                  }];
               }
            });
         const premiumText = foundUser.premium ? `${localText.premiumTextUz}\n\n${localText.premiumExpiredTextUz} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumTextUz

         bot.sendMessage(chatId, premiumText, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: priceKeyboard
            }
         }).then(async () => {
            await model.editStep(chatId, 'payment')
         })
      } else if (foundUser?.bot_lang == 'ru') {
         const priceList = await model.priceList(foundUser?.bot_lang)
         const priceKeyboard = priceList
            ?.filter(item => !(foundUser?.used_free && item.price == 0))
            ?.map(item => {
               const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

               if (item.period == 30) {
                  return [{
                     text,
                     web_app: {
                        url: `https://payment.hisobchiai.admob.uz/${chatId}`
                     }
                  }];
               } else {
                  return [{
                     text,
                     callback_data: `tarif_${item.id}`
                  }];
               }
            });
         const premiumText = foundUser.premium ? `${localText.premiumTextRu}\n\n${localText.premiumExpiredTextRu} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumTextRu

         bot.sendMessage(chatId, premiumText, {
            parse_mode: "HTML",
            reply_markup: {
               inline_keyboard: priceKeyboard
            }
         }).then(async () => {
            await model.editStep(chatId, 'payment')
         })
      } else if (foundUser?.bot_lang == 'eng') {
         const priceList = await model.priceList(foundUser?.bot_lang)
         const priceKeyboard = priceList
            .filter(item => !(foundUser?.used_free && item.price == 0))
            .map(item => {
               const text = `${item.title} ( ${formatBalanceWithSpaces(item.price)} so'm )`;

               if (item.period == 30) {
                  return [{
                     text,
                     web_app: {
                        url: `https://payment.hisobchiai.admob.uz/${chatId}`
                     }
                  }];
               } else {
                  return [{
                     text,
                     callback_data: `tarif_${item.id}`
                  }];
               }
            });
         const premiumText = foundUser.premium ? `${localText.premiumTextEng}\n\n${localText.premiumExpiredTextEng} <b>${formatDatePremium(foundUser?.expired_date)}</b>` : localText.premiumTextEng

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

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (msg.contact && foundUser?.bot_step == "register") {
      let phoneNumber = msg.contact.phone_number;

      if (!phoneNumber.startsWith('+')) {
         phoneNumber = `+${phoneNumber}`;
      }

      if (msg.contact.user_id == msg.from.id) {
         const addPhoneUser = await model.addPhoneUser(chatId, phoneNumber)

         if (addPhoneUser.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.askNameTextUz, {
               parse_mode: "HTML",
               reply_markup: {
                  remove_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'ask_name')
            })
         } else if (addPhoneUser.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.askNameTextRu, {
               parse_mode: "HTML",
               reply_markup: {
                  remove_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'ask_name')
            })
         } else if (addPhoneUser.bot_lang == 'eng') {
            bot.sendMessage(chatId, localText.askNameTextEng, {
               parse_mode: "HTML",
               reply_markup: {
                  remove_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'ask_name')
            })
         }
      } else {
         if (foundUser?.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.contactRegisterErrorUz, {
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.sendContactBtnUz,
                           request_contact: true,
                        },
                     ],
                  ],
                  resize_keyboard: true,

               },
            });
         } else if (foundUser?.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.contactRegisterErrorRu, {
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.sendContactBtnRu,
                           request_contact: true,
                        },
                     ],
                  ],
                  resize_keyboard: true,

               },
            });
         } else if (foundUser?.bot_lang == 'eng') {
            bot.sendMessage(chatId, localText.contactRegisterErrorEng, {
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.sendContactBtnEng,
                           request_contact: true,
                        },
                     ],
                  ],
                  resize_keyboard: true,

               },
            });
         }
      }
   }
})

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Xisobchi AI API documentation",
         version: "1.0.0",
         description: "by Diyor Jaxongirov",
      },
      servers: [
         {
            url: "https://xisobchiai2.admob.uz/api/v1"
         }
      ]
   },
   apis: ["./src/modules/index.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.use("/api/v1", router);

const job1 = new CronJob('0 10 * * *', async () => {
   await sendMessageBefore();
   await paySubcribe()
   console.log('payment');
});

const job2 = new CronJob('0 9 * * *', async () => {
   await sendMessageMorning();
   console.log('morning');
});

const job3 = new CronJob('0 15 * * *', async () => {
   await sendMessageAfternoon();
   console.log('afternoon');
});

const job4 = new CronJob('0 21 * * *', async () => {
   await sendMessageNight();
   console.log('night');
   await sendMessageAdvice()
   console.log('advice');
});

// Start the job
job1.start();
job2.start();
job3.start();
job4.start();

app.get('/errortext', async (req, res) => {
   const users = await model.foundUserLang()

   for (const user of users) {
      bot.sendMessage(user.chat_id, "Kichik nozoslik tuzatildi!\n\n/start ustiga bosing va <b>Hisobchi AI</b> ni ishga tushuring", {
         parse_mode: "HTML"
      }).catch(e => console.log("SendMessage Error:", e.message));
   }

   res.send("ok")
})

app.listen(4044, console.log(4044))