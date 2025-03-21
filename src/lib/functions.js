const formatBalanceWithSpaces = (balance) => {
   return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(balance).replace(/,/g, ' ');
}

const calculateExpiredDate = (perid) => {
   const currentDate = new Date();
   const expirationDate = new Date(currentDate);
   expirationDate.setDate(expirationDate.getDate() + Number(perid));
   const expirationTimestamp = Math.floor(expirationDate.getTime() / 1000);
   return expirationTimestamp
}

const parseGeminiResponse = (geminiResponse) => {
   try {
      let cleanedText = geminiResponse.replace("```", "").trim();
      cleanedText = cleanedText.startsWith("json") ? cleanedText.substring(4) : cleanedText;
      cleanedText = cleanedText.replace(/`/g, ''); // Orqa qo'shtirnoqlarni olib tashlash
      return JSON.parse(cleanedText);
   } catch (e) {
      throw new Error(`Error decoding JSON: ${e}`);
   }
}

const formatDateAdvanced = (dateString) => {
   const date = new Date(dateString);

   if (isNaN(date)) {
      // Attempt to handle ISO 8601 with timezone offset directly
      const isoDate = new Date(dateString.replace(' ', 'T'));
      if (isNaN(isoDate)) {
         return "No aniq";
      }
      else {
         const day = String(isoDate.getDate()).padStart(2, '0');
         const month = String(isoDate.getMonth() + 1).padStart(2, '0');
         const year = isoDate.getFullYear();
         return `${day}.${month}.${year}`;
      }
   }

   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();

   return `${day}.${month}.${year}`;
}

const getFormattedDate = () => {
   const date = new Date();

   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   const seconds = String(date.getSeconds()).padStart(2, '0');
   const milliseconds = String(date.getMilliseconds()).padStart(6, '0'); // Ensure 6-digit microseconds

   const offsetMinutes = date.getTimezoneOffset();
   const absOffsetMinutes = Math.abs(offsetMinutes);
   const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, '0');
   const offsetMins = String(absOffsetMinutes % 60).padStart(2, '0');
   const timezoneSign = offsetMinutes > 0 ? '-' : '+';
   const timezone = `${timezoneSign}${offsetHours}:${offsetMins}`;

   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezone}`;
};

const formatDatePremium = (timestamp) => {
   const date = new Date(timestamp * 1000);
   const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '.');
   return `${formattedDate}`
}

module.exports = {
   formatBalanceWithSpaces,
   calculateExpiredDate,
   parseGeminiResponse,
   formatDateAdvanced,
   getFormattedDate,
   formatDatePremium
}