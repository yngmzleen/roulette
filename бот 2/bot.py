import logging
import asyncio
import sqlite3
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, CallbackQuery
from aiogram import Router
from aiogram.filters import Command

API_TOKEN = '6918049862:AAHL0_Fzm1gPqFzkQZ6uNOuYm7S1om12kAs'

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize bot and dispatcher
bot = Bot(token=API_TOKEN)
dp = Dispatcher()
router = Router()  # Создаем роутер

# Connect to SQLite database
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# Create users table if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                    user_id INTEGER PRIMARY KEY,
                    balance INTEGER NOT NULL
                )''')
conn.commit()

# Command /start
@router.message(Command(commands=['start']))
async def send_welcome(message: Message):
    user_id = message.from_user.id
    if message.from_user.is_bot:
        await message.answer("Боты не могут использовать этот бот.")
        return

    # Check if the user already exists in the database
    cursor.execute("SELECT * FROM Users WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()

    if user is None:
        # If the user doesn't exist, insert them into the database with an initial balance of 0
        cursor.execute("INSERT INTO Users (user_id, balance) VALUES (?, ?)", (user_id, 0))
        conn.commit()
        await bot.edit_message_text("Приветствую! Profit Drop Game - это первая игра-рулетка на блокчейне TON. Испытай свою удачу! Доступные разделы по команде /menu", chat_id=message.chat.id, message_id=message.message_id)
    else:
        await bot.edit_message_text("С возвращением!", chat_id=message.chat.id, message_id=message.message_id)
        await delete_previous_bot_message(message)

    await show_menu(message)

# Command /menu
@router.message(Command(commands=['menu']))
async def show_menu(message: Message):
    user_id = message.from_user.id
    if check_user_exists(user_id):
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Мой аккаунт", callback_data='account')],
            [InlineKeyboardButton(text="Играть", callback_data='play')],
            [InlineKeyboardButton(text="Пополнение", callback_data='deposit')],
            [InlineKeyboardButton(text="Вывод", callback_data='withdraw')],
            [InlineKeyboardButton(text="Бонусы", callback_data='bonus')]
        ])
        await bot.edit_message_text("Разделы", chat_id=message.chat.id, message_id=message.message_id, reply_markup=keyboard)
    else:
        await bot.edit_message_text("Вы не зарегистрированы в системе. Напишите /start для начала.", chat_id=message.chat.id, message_id=message.message_id)
        await delete_previous_bot_message(message)

# Callback query handler for bonuses
@router.callback_query(lambda c: c.data == 'bonus')
async def process_bonus(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id
    if check_user_exists(user_id):
        # Здесь добавьте логику начисления бонуса и обновления баланса пользователя
        await callback_query.answer("Вы получили бонус!")
    else:
        await callback_query.answer("Вы не зарегистрированы в системе. Напишите /start для начала.")

# Callback query handler
@router.callback_query(lambda c: True)
async def process_callback(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id

    if callback_query.from_user.is_bot:
        await callback_query.answer("Боты не могут использовать этот бот.", show_alert=True)
        return

    if callback_query.data == 'account':
        cursor.execute("SELECT * FROM Users WHERE user_id = ?", (user_id,))
        user = cursor.fetchone()
        response = (f"ID аккаунта: {user_id}\n"
                    f"Баланс пользователя: {user[1]} TON")
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Назад", callback_data='menu')]
        ])
        await bot.send_message(user_id, response, reply_markup=keyboard)

    elif callback_query.data == 'play':
        response = "В данный момент игра недоступна"
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Назад", callback_data='menu')]
        ])
        await bot.send_message(user_id, response, reply_markup=keyboard)

    elif callback_query.data == 'deposit':
        response = "Введите количество TON для пополнения целым числом. Пример: 5"
        await bot.send_message(user_id, response)

    elif callback_query.data == 'withdraw':
        response = "Введите количество TON для вывода целым числом. Пример: 5"
        await bot.send_message(user_id, response)

    elif callback_query.data == 'menu':
        await show_menu(callback_query.message)
        await delete_previous_bot_message(callback_query.message)

# Функция для проверки существования пользователя в базе данных
def check_user_exists(user_id):
    cursor.execute("SELECT * FROM Users WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()
    return user is not None

# Функция для удаления предыдущего сообщения бота
async def delete_previous_bot_message(message):
    if message.reply_to_message:
        if message.reply_to_message.from_user.is_bot:
            await message.delete()

async def main():
    dp.include_router(router)  # Подключаем роутер к диспетчеру
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
