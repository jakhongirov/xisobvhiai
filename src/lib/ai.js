const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseGeminiResponse, getFormattedDate } = require('./functions')
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const { GoogleAIFileManager, FileState } = require('@google/generative-ai/server');
const fileManager = new GoogleAIFileManager(GOOGLE_API_KEY);
const fs = require('fs');
const path = require('path');

const analyzeText = async (inputText) => {
   try {
      const current_datetime = getFormattedDate()
      const prompt = `
         You are an AI that extracts structured financial details from a text statement.

         ## Task:
         Analyze the input statement and return ONLY a JSON object with these keys:
         - "user_input": The original user input as a string.
         - "category": The type of expense or income (e.g., "Food", "Salary", "Rent").
         - "amount": The numerical value of the transaction.
         - "currency": The currency used in the transaction (e.g., "USD", "EUR", "UZS"). If the currency is not explicitly mentioned, infer from the context or default to "USD".
         - "type": Either "income" or "outcome" based on whether it's earnings or spending.
         - "date": The date and time of the transaction in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-15 20:34:59.25447+05). If the date and time are not explicitly mentioned, use the provided current date and time: ${current_datetime}. If the input text contains a date, overwrite the current date with the found date.
         - "deadline": The date and time the debt is expected to be repaid in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-21 20:34:59.25447+05). If no deadline is mentioned, set it to "".

         Additional Rules for Debt Payments:
         - If the transaction is a debt payment, include:
         - "isDebtPayment": true
         - "forWhom": The name of the person or entity involved in the debt payment.
         - If not a debt payment, set "isDebtPayment": false and "forWhom": "".

         ## Examples:
         1. Input: "I paid $200 for my rent on 2024-06-15 10:00:00+05"
            Output: [{{"user_input": "I paid $200 for my rent on 2024-06-15 10:00:00+05", "isDebtPayment": false, "forWhom": "", "category": "Uy-joy xarajatlari", "amount": 200, "currency": "USD", "type": "outcome", "date": "2024-06-15 10:00:00.000000+05", "deadline": ""}}]

         2. Input: "I borrowed 500$ from Alex aka yesterday, he will return it on 2024-06-25 12:00:00+05"
            Output: [{{"user_input": "I borrowed 500$ from Alex aka yesterday, he will return it on 2024-06-25 12:00:00+05", "isDebtPayment": true, "forWhom": "Alex aka", "category": "Moliyaviy majburiyatlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "2024-06-15 20:34:59.25447+05", "deadline": "2024-06-25 12:00:00.000000+05"}}]

         3. Input: "I received my salary of 1000 UZS"
            Output: [{{"user_input": "I received my salary of 1000 UZS", "isDebtPayment": false, "forWhom": "", "category": "Mehnat daromadlari", "amount": 1000, "currency": "UZS", "type": "income", "date": "2024-06-16 20:34:59.25447+05", "deadline": ""}}]

         4. Input: "I spent 50 sum on dinner at a restaurant"
            Output: [{{"user_input": "I spent 50 sum on dinner at a restaurant", "isDebtPayment": false, "forWhom": "", "category": "Oziq-ovqat", "amount": 50, "currency": "UZS", "type": "outcome", "date": "2024-06-16 20:34:59.25447+05", "deadline": ""}}]

         5. Input: "Nodir $200 qarzini berdi kecha"
            Output: [{{"user_input": "Nodir $200 qarzini berdi kecha", "isDebtPayment": true, "forWhom": "Nodir", "category": "Moliyaviy majburiyatlar", "amount": 200, "currency": "USD", "type": "income", "date": "2024-06-15 20:34:59.25447+05", "deadline": ""}}]

         6. Input: "Kecha anvar 100$ qarzini berdi"
            Output: [{{"user_input": "Kecha anvar 100$ qarzini berdi", "isDebtPayment": true, "forWhom": "Anvar", "category": "Moliyaviy majburiyatlar", "amount": 100, "currency": "USD", "type": "income", "date": "2024-06-15 20:34:59.25447+05", "deadline": ""}}]

         7. Input: "Anvarga qarz berdim 500 dollar. 21-mart 12:00:00+05 da qaytaradi."
            Output: [{{"user_input": "Anvarga qarz berdim 500 dollar. 21-mart 12:00:00+05 da qaytaradi.", "isDebtPayment": true, "forWhom": "Anvar", "category": "Moliyaviy majburiyatlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "2024-06-16 20:34:59.25447+05", "deadline": "2025-03-21 12:00:00.000000+05"}}]

         8. Use that categories

         otutcome: {
            "categories": [
               "Uy-joy xarajatlari",
               "Oziq-ovqat",
               "Transport",
               "Sog'liqni saqlash",
               "Kiyim-kechak",
               "Shaxsiy parvarish",
               "O'qish va rivojlanish",
               "O'yin-kulgi va dam olish",
               "Moliyaviy majburiyatlar",
               "Jamg'arma va investitsiyalar",
               "Bolalar va oilaviy xarajatlar",
               "Uy hayvonlari",
               "Aloqa va media",
               "Sovg'alar va ehsonlar",
               "Kutilmagan xarajatlar"
            ]
         }

         income: {
            "categories": [
               "Mehnat daromadlari",
               "Biznes daromadlari",
               "Ijara daromadlari",
               "Investitsiya daromadlari",
               "Davlat to'lovlari",
               "Boshqa daromadlar"
            ]
         }

         ## Now, process this input:
         "${inputText}"

         ## Input text only in Uzbek, English and Russian languages.

         ## Output ONLY JSON. No explanations, no text, just JSON.
      `;

      const result = await model.generateContent([prompt]);
      const responseText = result.response.text();
      const jsonData = parseGeminiResponse(responseText);

      return jsonData;
   } catch (error) {
      console.error('Error analyzing text:', error);
      return 'An error occurred during text analysis.';
   }
}

const getTextFromAudio = async (fileUri) => {
   const result = await model.generateContent([
      "Transcribe this audio clip. The audio is in either Uzbek, English, or Russian.",
      {
         fileData: {
            fileUri: fileUri,
            mimeType: 'audio/ogg',
         },
      },
   ]);
   return result.response.text();
}

const analyzeVoice = async (tempFilePath) => {
   try {
      const uploadResult = await fileManager.uploadFile(path.join(__dirname, tempFilePath), {
         mimeType: 'audio/ogg',
         displayName: 'Telegram Voice Message',
      });

      let file = await fileManager.getFile(uploadResult.file.name);
      while (file.state === FileState.PROCESSING) {
         process.stdout.write('.');
         await new Promise((resolve) => setTimeout(resolve, 10_000));
         file = await fileManager.getFile(uploadResult.file.name);
      }

      if (file.state === FileState.FAILED) {
         throw new Error('Audio processing failed.');
      }

      const current_datetime = getFormattedDate()
      const prompt = `
         You are an AI that extracts structured financial details from a text statement.

         ## Task:
         Analyze the input statement and return ONLY a JSON object with these keys:
         - "user_input": The original user input as a string.
         - "category": The type of expense or income (e.g., "Food", "Salary", "Rent").
         - "amount": The numerical value of the transaction.
         - "currency": The currency used in the transaction (e.g., "USD", "EUR", "UZS"). If the currency is not explicitly mentioned, infer from the context or default to "USD".
         - "type": Either "income" or "outcome" based on whether it's earnings or spending.
         - "date": The date and time of the transaction in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-15 20:34:59.25447+05). If the date and time are not explicitly mentioned, use the provided current date and time: ${current_datetime}. If the input text contains a date, overwrite the current date with the found date.
         - "deadline": The date and time the debt is expected to be repaid in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-21 20:34:59.25447+05). If no deadline is mentioned, set it to "".

         Additional Rules for Debt Payments:
         - If the transaction is a debt payment, include:
         - "isDebtPayment": true
         - "forWhom": The name of the person or entity involved in the debt payment.
         - If not a debt payment, set "isDebtPayment": false and "forWhom": "".

         ## Examples:
         1. Input: "I paid $200 for my rent on 2024-06-15 10:00:00+05"
            Output: [{{"user_input": "I paid $200 for my rent on 2024-06-15 10:00:00+05", "isDebtPayment": false, "forWhom": "", "category": "Uy-joy xarajatlari", "amount": 200, "currency": "USD", "type": "outcome", "date": "2024-06-15 10:00:00.000000+05", "deadline": ""}}]

         2. Input: "I borrowed 500$ from Alex aka yesterday, he will return it on 2024-06-25 12:00:00+05"
            Output: [{{"user_input": "I borrowed 500$ from Alex aka yesterday, he will return it on 2024-06-25 12:00:00+05", "isDebtPayment": true, "forWhom": "Alex aka", "category": "Moliyaviy majburiyatlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "2024-06-15 20:34:59.25447+05", "deadline": "2024-06-25 12:00:00.000000+05"}}]

         3. Input: "I received my salary of 1000 UZS"
            Output: [{{"user_input": "I received my salary of 1000 UZS", "isDebtPayment": false, "forWhom": "", "category": "Mehnat daromadlari", "amount": 1000, "currency": "UZS", "type": "income", "date": "2024-06-16 20:34:59.25447+05", "deadline": ""}}]

         4. Input: "I spent 50 sum on dinner at a restaurant"
            Output: [{{"user_input": "I spent 50 sum on dinner at a restaurant", "isDebtPayment": false, "forWhom": "", "category": "Oziq-ovqat", "amount": 50, "currency": "UZS", "type": "outcome", "date": "2024-06-16 20:34:59.25447+05", "deadline": ""}}]

         5. Input: "Nodir $200 qarzini berdi kecha"
            Output: [{{"user_input": "Nodir $200 qarzini berdi kecha", "isDebtPayment": true, "forWhom": "Nodir", "category": "Moliyaviy majburiyatlar", "amount": 200, "currency": "USD", "type": "income", "date": "2024-06-15 20:34:59.25447+05", "deadline": ""}}]

         6. Input: "Kecha anvar 100$ qarzini berdi"
            Output: [{{"user_input": "Kecha anvar 100$ qarzini berdi", "isDebtPayment": true, "forWhom": "Anvar", "category": "Moliyaviy majburiyatlar", "amount": 100, "currency": "USD", "type": "income", "date": "2024-06-15 20:34:59.25447+05", "deadline": ""}}]

         7. Input: "Anvarga qarz berdim 500 dollar. 21-mart 12:00:00+05 da qaytaradi."
            Output: [{{"user_input": "Anvarga qarz berdim 500 dollar. 21-mart 12:00:00+05 da qaytaradi.", "isDebtPayment": true, "forWhom": "Anvar", "category": "Moliyaviy majburiyatlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "2024-06-16 20:34:59.25447+05", "deadline": "2025-03-21 12:00:00.000000+05"}}]

         8. Use that categories

         otutcome: {
            "categories": [
               "Uy-joy xarajatlari",
               "Oziq-ovqat",
               "Transport",
               "Sog'liqni saqlash",
               "Kiyim-kechak",
               "Shaxsiy parvarish",
               "O'qish va rivojlanish",
               "O'yin-kulgi va dam olish",
               "Moliyaviy majburiyatlar",
               "Jamg'arma va investitsiyalar",
               "Bolalar va oilaviy xarajatlar",
               "Uy hayvonlari",
               "Aloqa va media",
               "Sovg'alar va ehsonlar",
               "Kutilmagan xarajatlar"
            ]
         }

         income: {
            "categories": [
               "Mehnat daromadlari",
               "Biznes daromadlari",
               "Ijara daromadlari",
               "Investitsiya daromadlari",
               "Davlat to'lovlari",
               "Boshqa daromadlar"
            ]
         }

         ## Now, process this input:
         "${await getTextFromAudio(uploadResult.file.uri)}"

         ## Input text only in Uzbek, English and Russian languages.

         ## Output ONLY JSON. No explanations, no text, just JSON.
      `;

      const result = await model.generateContent([prompt]);
      const responseText = result.response.text();

      try {
         const jsonData = parseGeminiResponse(responseText);
         return jsonData
      } catch (jsonError) {
         console.error('Error parsing JSON:', jsonError);
      }
   } catch (uploadError) {
      console.error('Error during upload or analysis:', uploadError);
   } finally {
      fs.unlinkSync(path.join(__dirname, tempFilePath));
   }
}

module.exports = {
   analyzeText,
   analyzeVoice
}