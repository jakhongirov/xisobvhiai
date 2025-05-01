const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseGeminiResponse, getFormattedDate } = require('./functions')
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const { GoogleAIFileManager, FileState } = require('@google/generative-ai/server');
const fileManager = new GoogleAIFileManager(GOOGLE_API_KEY);
const fs = require('fs');
const path = require('path');

const analyzeText = async (inputText, categories) => {
   try {
      const current_datetime = getFormattedDate()
      const prompt = `
         ...You are an AI that extracts structured financial details from a text statement.

         ## Task:
         Analyze the input statement and return ONLY a JSON object with these keys:
         - "user_input": The original user input as a string.
         - "category": The category of expense or income flow categories list below provided. 
         - "amount": The numerical value of the transaction.
         - "currency": The currency used in the transaction (e.g., "USD", "EUR", "UZS"). If the currency is not explicitly mentioned, think, if amount more than "1500" maybe it is "UZS", another cases maybe - "USD" 
         - "type": Either "income" for earning or "outcome" for spending - based on whether it's income or outcome.
         - "date": The date and time of the transaction in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-15 20:34:59.25447+05). If the date and time are not explicitly mentioned, use the provided current date and time: ${current_datetime}. If the input contains a date, overwrite the current date with the found date.
         - "deadline": The date and time the debt is expected to be repaid in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-21 20:34:59.25447+05). If no deadline is mentioned, set it to "".
         - "isDebtPayment": true if the transaction is a debt payment, false otherwise.
         - "forWhom": The name of the person or entity involved in the debt payment. If not a debt payment, set it to "".

         ## Categories list - use it for clarify category of transaction:
         ${categories?.map(e => e.name).join(', ')} 
         For the transaction category, strictly choose the closest or most accurate one from the available categories list. If none match, select the "Boshqa daromadlar" category.

         ## Examples:
         1. Input: "I paid $200 for my rent on 2024-06-15 10:00:00+05"
            Output: [{{"user_input": "I paid $200 for my rent on 2024-06-15 10:00:00+05", "isDebtPayment": false, "forWhom": "", "category": "Uy-joy xarajatlari", "amount": 200, "currency": "USD", "type": "outcome", "date": "2024-06-15 10:00:00.000000+05", "deadline": ""}}]

         2. Input: "Aziz akaga kecha 500$ qarz berdim, 25 iyunda qaytarishi kerak"
            Output: [{{"user_input": "Aziz akaga kecha 500$ qarz berdim, 25 iyunda qaytarishi kerak", "isDebtPayment": true, "forWhom": "Alex aka", "category": "Moliyaviy majburiyatlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "${current_datetime}", "deadline": "2024-06-25 12:00:00.000000+05"}}]

         3. Input: "5000000 oylik oldim"
            Output: [{{"user_input": "5000000 oylik oldim", "isDebtPayment": false, "forWhom": "", "category": "Mehnat daromadlari", "amount": 5000000, "currency": "UZS", "type": "income", "date": "${current_datetime}", "deadline": ""}}]

         4. Input: "Obed uchun ovqatlangani 50000 ishlatdim"
            Output: [{{"user_input": "Obed uchun ovqatlangani 50000 ishlatdim", "isDebtPayment": false, "forWhom": "", "category": "Oziq-ovqat", "amount": 50000, "currency": "UZS", "type": "outcome", "date": "${current_datetime}", "deadline": ""}}]

         5. Input: "Nodir $200 qarzini berdi"
            Output: [{{"user_input": "Nodir $200 qarzini berdi", "isDebtPayment": true, "forWhom": "Nodir", "category": "Qarzlar", "amount": 200, "currency": "USD", "type": "income", "date": "${current_datetime}", "deadline": ""}}]

         6. Input: "Kecha anvar 100$ qarzini berdi"
            Output: [{{"user_input": "Kecha anvar 100$ qarzini berdi", "isDebtPayment": true, "forWhom": "Anvar", "category": "Qarzlar", "amount": 100, "currency": "USD", "type": "income", "date": "${current_datetime}", "deadline": ""}}]

         7. Input: "Anvarga qarz berdim 500. 21-martda qaytaradi."
            Output: [{{"user_input": "Anvarga qarz berdim 500. 21-martda qaytaradi.", "isDebtPayment": true, "forWhom": "Anvar", "category": "Qarzlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "${current_datetime}", "deadline": "2025-03-21 12:00:00.000000+05"}}]

         ## Now, process this input:
         "${inputText}"

         ## Input text only in Uzbek, English and Russian languages.
         ## Output ONLY JSON. No explanations, no text, just JSON. If the input text is not suitable for financial statement extraction or or if the sum is equal to 0, output 'wrong'.
         ...
      `;

      const result = await model.generateContent([prompt]);
      const responseText = result.response.text();
      const jsonData = parseGeminiResponse(responseText);
      console.log(jsonData)
      return jsonData;
   } catch (error) {
      console.error('Error analyzing text:', error);
      return 'An error occurred during text analysis.';
   }
}

const getTextFromAudio = async (fileUri, categories) => {
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

const analyzeVoice = async (tempFilePath, categories) => {
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
         - "category": The category of expense or income flow categories list below provided. 
         - "amount": The numerical value of the transaction.
         - "currency": The currency used in the transaction (e.g., "USD", "EUR", "UZS"). If the currency is not explicitly mentioned, think, if amount more than "1500" maybe it is "UZS", another cases maybe - "USD" 
         - "type": Either "income" for earning or "outcome" for spending - based on whether it's income or outcome.
         - "date": The date and time of the transaction in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-15 20:34:59.25447+05). If the date and time are not explicitly mentioned, use the provided current date and time: ${current_datetime}. If the input contains a date, overwrite the current date with the found date.
         - "deadline": The date and time the debt is expected to be repaid in "YYYY-MM-DD HH:MM:SS.mmmmmm+ZZ" format (e.g., 2025-03-21 20:34:59.25447+05). If no deadline is mentioned, set it to "".
         - "isDebtPayment": true if the transaction is a debt payment, false otherwise.
         - "forWhom": The name of the person or entity involved in the debt payment. If not a debt payment, set it to "".

         ## Categories list - use it for clarify category of transaction:
         ${categories?.map(e => e.name).join(', ')} . For the transaction category, strictly choose the closest or most accurate one from the available categories list. If none match, select the "Boshqa daromadlar" category.

         ## Examples:
         1. Input: "I paid $200 for my rent on 2024-06-15 10:00:00+05"
            Output: [{{"user_input": "I paid $200 for my rent on 2024-06-15 10:00:00+05", "isDebtPayment": false, "forWhom": "", "category": "Uy-joy xarajatlari", "amount": 200, "currency": "USD", "type": "outcome", "date": "2024-06-15 10:00:00.000000+05", "deadline": ""}}]

         2. Input: "Aziz akaga kecha 500$ qarz berdim, 25 iyunda qaytarishi kerak"
            Output: [{{"user_input": "Aziz akaga kecha 500$ qarz berdim, 25 iyunda qaytarishi kerak", "isDebtPayment": true, "forWhom": "Alex aka", "category": "Moliyaviy majburiyatlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "${current_datetime}", "deadline": "2024-06-25 12:00:00.000000+05"}}]

         3. Input: "5000000 oylik oldim"
            Output: [{{"user_input": "5000000 oylik oldim", "isDebtPayment": false, "forWhom": "", "category": "Mehnat daromadlari", "amount": 5000000, "currency": "UZS", "type": "income", "date": "${current_datetime}", "deadline": ""}}]

         4. Input: "Obed uchun ovqatlangani 50000 ishlatdim"
            Output: [{{"user_input": "Obed uchun ovqatlangani 50000 ishlatdim", "isDebtPayment": false, "forWhom": "", "category": "Oziq-ovqat", "amount": 50000, "currency": "UZS", "type": "outcome", "date": "${current_datetime}", "deadline": ""}}]

         5. Input: "Nodir $200 qarzini berdi"
            Output: [{{"user_input": "Nodir $200 qarzini berdi", "isDebtPayment": true, "forWhom": "Nodir", "category": "Qarzlar", "amount": 200, "currency": "USD", "type": "income", "date": "${current_datetime}", "deadline": ""}}]

         6. Input: "Kecha anvar 100$ qarzini berdi"
            Output: [{{"user_input": "Kecha anvar 100$ qarzini berdi", "isDebtPayment": true, "forWhom": "Anvar", "category": "Qarzlar", "amount": 100, "currency": "USD", "type": "income", "date": "${current_datetime}", "deadline": ""}}]

         7. Input: "Anvarga qarz berdim 500. 21-martda qaytaradi."
            Output: [{{"user_input": "Anvarga qarz berdim 500. 21-martda qaytaradi.", "isDebtPayment": true, "forWhom": "Anvar", "category": "Qarzlar", "amount": 500, "currency": "USD", "type": "outcome", "date": "${current_datetime}", "deadline": "2025-03-21 12:00:00.000000+05"}}]

         ## Now, process this input:
         "${await getTextFromAudio(uploadResult.file.uri)}"


         ## Input text only in Uzbek, English and Russian languages.
         ## Output ONLY JSON. No explanations, no text, just JSON. If the input text is not suitable for financial statement extraction or or if the sum is equal to 0, output 'wrong'.
      `;


      const result = await model.generateContent([prompt]);
      const responseText = result.response.text();

      try {
         const jsonData = parseGeminiResponse(responseText);
         console.log(jsonData)
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

const newCategoryData = async (inputText) => {
   try {
      const prompt = `
         ## Task:
         Translate the provided Uzbek term into Russian and English, and return the results as a JSON object with the keys "name_uz", "name_ru", and "name_en", "emoji".
         
         ## Now, process this input:
         "${inputText}"

         ## Output ONLY JSON. No explanations, no text, just JSON.
      `;

      const result = await model.generateContent([prompt]);
      const responseText = result.response.text();

      try {
         const jsonData = parseGeminiResponse(responseText);
         console.log(jsonData)
         return jsonData
      } catch (jsonError) {
         console.error('Error parsing JSON:', jsonError);
      }

   } catch (error) {
      console.error('Error analyzing text:', error);
      return 'An error occurred during text analysis.';
   }
}

module.exports = {
   analyzeText,
   analyzeVoice,
   newCategoryData
}