import sqlite3

def display_all_users():
    # Подключаемся к базе данных
    conn = sqlite3.connect('users.db')  # Замените 'путь_к_вашей_базе_данных.db' на путь к вашей базе данных SQLite
    cursor = conn.cursor()

    # Выполняем запрос SELECT для извлечения всех пользователей
    cursor.execute("SELECT * FROM Users")
    rows = cursor.fetchall()

    # Выводим результатс
    print("Список всех пользователей:")
    for row in rows:
        print(row)

    # Закрываем соединение
    conn.close()

if __name__ == "__main__":
    display_all_users()
