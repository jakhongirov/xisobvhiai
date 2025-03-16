const model = require('./model')
const {
   bot
} = require('../bot')

const sendMessageBefore = async () => {
   try {
      const getUsersBefore2day = await model.getUsersBefore2day()
      const getUsersBefore1day = await model.getUsersBefore1day()
      const getUsers = await model.getUsers()

      if (getUsersBefore2day?.length > 0) {
         for (const user of getUsersBefore2day) {
            bot.sendMessage(user?.chat_id, localText.cronTextBefore2day)
         }
      }

      if (getUsersBefore1day?.length > 0) {
         for (const user of getUsersBefore1day) {
            bot.sendMessage(user?.chat_id, localText.cronTextBefore1day)
         }
      }

      if (getUsers?.length > 0) {
         for (const user of getUsers) {
            bot.sendMessage(user?.chat_id, localText.cronTextStoped).then(async () => {
               await model.editUserPremium(user?.id)
            })
         }
      }
   } catch (error) {
      console.log(error)
   }
}

module.exports = {
   sendMessageBefore
}