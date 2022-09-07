const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions} = require('./options.js')

const token = `5730984709:AAGX0YssPYRpqDvYIwFpS5f_jf0lSkYvo68`

const bot = new TelegramApi(token, { polling: true })

const chats = {}


const startGame = async (chatId) => {
   await bot.sendMessage(chatId, 'Сейчас я предложу число забивок, а ты должен угадать число от 1 до 3 :)')
   const randomNumber = Math.floor(Math.random() * 3 + 1)
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, 'Угадывай давай', gameOptions)
}

const start = () => {
   bot.setMyCommands([
      { command: '/start', description: 'Кальянное приветствие' },
      { command: '/info', description: 'Информация о кальянщике' },
      { command: '/game', description: 'Игра на количество покуров' },
   ])

   bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;


      if (text === `/start`) {
         await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ce3/f51/ce3f5192-4aca-4112-853d-7a270bde4c03/1.webp')
         return bot.sendMessage(chatId, 'Покальяним?))) ')
      }

      if (text === '/info') {
         return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ',мой госпадин))'} `)
      }
      if (text === '/game') {
         return startGame(chatId)

      }
      return bot.sendMessage(chatId, 'ох, спроси чего по легче...')
   })

   bot.on('callback_query', msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
         return startGame(chatId)

      }
      if (data === chats[chatId]) {
         return bot.sendMessage(chatId, `Поздравляю,ты угадал цифру ${chats[chatId]}`, againOptions)
      } else {
         return bot.sendMessage(chatId, `Поздравляю,ты  не угадал цифру ${chats[chatId]}`, againOptions)
      }

   })
}

start()