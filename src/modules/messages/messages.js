require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')
const { bot } = require('../../lib/bot')
const localText = require('../../text/text.json')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendInBatches = async (users, sendFn, batchSize = 30, delayMs = 1000) => {
   for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.all(batch.map(sendFn));
      await delay(delayMs); // Wait to avoid Telegram rate limit
   }
};

module.exports = {
   GET_LIST: async (req, res) => {
      try {
         const { limit, page } = req.query
         const messages = await model.messages(limit, page)
         const messagesCount = await model.messagesCount()

         if (messages?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: messages,
               count: messagesCount.count
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

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params

         const foundMessage = await model.foundMessage(id)

         if (foundMessage) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundMessage
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

   ADD_MESSAGE: async (req, res) => {
      try {
         const uploadFile = req.file;
         const { text, premium, bot_lang } = req.body;

         const foundUsers = await model.foundUsers(premium, bot_lang);

         const fileUrl = uploadFile ? `${process.env.BACKEND_URL}/${uploadFile.filename}` : null;
         const fileName = uploadFile?.filename || null;
         const mimeType = uploadFile?.mimetype || null;

         // Save message to DB
         await model.addMessage(text, premium, bot_lang, fileUrl, fileName, mimeType);

         if (!foundUsers.length) {
            return res.json({ message: "No users found in the specified balance range." });
         }

         // Respond early so the client doesn't wait
         res.json({ message: "Message dispatching started." });

         // Determine message sending method
         const sendFn = async (user) => {
            const chatId = user?.chat_id;
            if (!chatId) return;

            const formattedText = text
               .replace(/<p>/g, '')
               .replace(/<\/p>/g, '\n')
               .replace(/<br\s*\/?>/g, '\n')
               .replace(/&nbsp;/g, ' ');

            try {
               if (!uploadFile) {
                  if (premium === false) {
                     await bot.sendMessage(chatId, formattedText, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: user?.bot_lang == 'uz' ? localText.cronTextRegisterBtnUz : user?.bot_lang == 'ru' ? localText.cronTextRegisterBtnRu : user?.bot_lang == 'eng' ? localText.cronTextRegisterBtnEng : localText.cronTextRegisterBtnUz,
                                    callback_data: "to_buy"
                                 }
                              ]
                           ]
                        }
                     });
                  } else {
                     await bot.sendMessage(chatId, formattedText, { parse_mode: "HTML" });
                  }
               } else if (mimeType.startsWith("image/")) {
                  if (premium === false) {
                     await bot.sendPhoto(chatId, fileUrl, {
                        caption: formattedText,
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: user?.bot_lang == 'uz' ? localText.cronTextRegisterBtnUz : user?.bot_lang == 'ru' ? localText.cronTextRegisterBtnRu : user?.bot_lang == 'eng' ? localText.cronTextRegisterBtnEng : localText.cronTextRegisterBtnUz,
                                    callback_data: "to_buy"
                                 }
                              ]
                           ]
                        }
                     });
                  } else {
                     await bot.sendPhoto(chatId, fileUrl, { caption: formattedText, parse_mode: "HTML" });
                  }
               } else if (mimeType.startsWith("video/")) {
                  if (premium === false) {
                     await bot.sendVideo(chatId, fileUrl, {
                        caption: formattedText,
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: user?.bot_lang == 'uz' ? localText.cronTextRegisterBtnUz : user?.bot_lang == 'ru' ? localText.cronTextRegisterBtnRu : user?.bot_lang == 'eng' ? localText.cronTextRegisterBtnEng : localText.cronTextRegisterBtnUz,
                                    callback_data: "to_buy"
                                 }
                              ]
                           ]
                        }
                     });
                  } else {
                     await bot.sendVideo(chatId, fileUrl, { caption: formattedText, parse_mode: "HTML" });
                  }
               } else {
                  if (premium === false) {
                     await bot.sendMessage(chatId, `${formattedText}\n\nFile: ${fileUrl}`, {
                        parse_mode: "HTML",
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: user?.bot_lang == 'uz' ? localText.cronTextRegisterBtnUz : user?.bot_lang == 'ru' ? localText.cronTextRegisterBtnRu : user?.bot_lang == 'eng' ? localText.cronTextRegisterBtnEng : localText.cronTextRegisterBtnUz,
                                    callback_data: "to_buy"
                                 }
                              ]
                           ]
                        }
                     });
                  } else {
                     await bot.sendMessage(chatId, `${formattedText}\n\nFile: ${fileUrl}`, { parse_mode: "HTML" });
                  }
               }
            } catch (err) {
               console.error(`❌ Failed to send to ${chatId}:`, err.message);
            }
         };

         // Start batch sending (30 per second)
         await sendInBatches(foundUsers, sendFn);

      } catch (error) {
         console.error("🔥 ADD_MESSAGE error:", error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   DELETE_MESSAGE: async (req, res) => {
      try {
         const { id } = req.params
         const foundMessage = await model.foundMessage(id)

         if (!foundMessage) {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

         const deleteMessage = await model.deleteMessage(id)

         if (deleteMessage) {
            if (deleteMessage?.image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${deleteMessage?.image_name}`))
               deleteOldAvatar.delete()
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

      } catch (error) {
         console.error(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   }
}