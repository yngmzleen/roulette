import asyncio

from aiogram import Router, Bot, Dispatcher, F
from aiogram.types import Message, CallbackQuery
from aiogram.enums import ParseMode
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.filters import CommandStart

from config import BOT_TOKEN, API_KEY, API_URL
from cryptomus import create_invoice, get_invoice

router = Router()

@router.message(CommandStart())
async def start(message: Message) -> None:
    invoice = await create_invoice(message.from_user.id)
    markup = InlineKeyboardBuilder().button(
        text='Проверить счет✅', callback_data=f"o_{invoice['result']['uuid']}"
    )
    await message.reply(
        f'Добро пожаловать в Profit Drop Game!👋\n Это первая игра-рулетка в блокчейне TON!\n Победитель забирает всё!\n Ваш счет: {invoice["result"]["url"]}', reply_markup=markup.as_markup()
    )

@router.callback_query(F.data.startswith('o_'))
async def chek_order(query: CallbackQuery) -> None:
    invoice = await get_invoice(query.data.split('_')[1])

    if invoice['result']['status'] == 'paid':
        await query.answer()
        await query.message.answer('Счет оплачен!')
    else:
        await query.answer('Счет не оплачен!')

async def main() -> None:
    bot = Bot(BOT_TOKEN, parse_mode=ParseMode.HTML)

    dp = Dispatcher()
    dp.include_router(router)

    await bot.delete_webhook(True)
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())