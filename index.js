const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions, startOptions} = require('./options.js')

const token = '6554362538:AAGbjH__35v62ZMYgBiDj9QkB7u9DNVGsoU';


const bot = new TelegramApi(token, {polling: true})

const chats = {};



bot.setMyCommands([
    {command: '/start', description: 'приветстиве'},
    {command: '/info', description: 'Инфо'},
    {command: '/game', description: 'Играть'}
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'сейчас я загадаю число от 0 до 9, а ты должен будешь угадать')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}


const start = () => {

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const name = msg.chat.first_name;
        const username = msg.chat.username;

        if (text === '/start') {
            return bot.sendMessage(chatId, `Привет ${name}! Давай сыграем в игру?`, startOptions);
            
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Твой юзернейм: ${username}`)
        }

        
        
        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'я тебя не понимаю!');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);

        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, Бот загадал цифру ${chats[chatId]}`, againOptions);
        }

        
        
    })
}

start();