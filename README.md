Fullstack додаток для бронювання послуг.

Користувачі можуть реєструватися, бронювати доступний час у бізнес-користувачів, змінювати або скасовувати бронювання.
Також реалізована адмін-панель для управління користувачами.

Tech Stack

Backend:

- NestJS – Node.js framework
- Prisma – ORM
- PostgreSQL – Database
- Passport + JWT – Authentication
- Argon2 – Password hashing

Frontend:

- React – UI
- Vite – Bundler
- React Hook Form – Forms
- Zod – Validation
- Tailwind CSS – Styling
- Axios – API requests
- date-fns – Date handling

Features

Authentication

- Реєстрація
- Логін
- JWT авторизація
- Ролі користувачів:
  -CLIENT
  -BUSINESS
  -ADMIN

CLIENT

- Може бронювати час у BUSINESS
- Вибір дня через datepicker
- Вибір доступного часу
- Скасування бронювання
- Зміна часу бронювання

BUSINESS

- Має доступні часові слоти
- Отримує бронювання від CLIENT

ADMIN PANEL
Адміністратор має можливість:

- Створювати нових користувачів (CLIENT / BUSINESS)
- Редагувати користувачів
- Видаляти користувачів
- Змінювати ролі користувачів

!!!!!! Admin credentials !!!!!!
email: root@gmail.com
password: rootroot

---

Backend Setup:

npm install

Створити .env файл:
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_secret_key

Prisma:
npx prisma migrate dev
npx prisma generate

Run server:
npm run start:dev

Frontend Setup:

npm install
npm run dev

Main Business Logic:

CLIENT не може забронювати зайнятий слот
BUSINESS не може мати два бронювання на один і той самий час
При зміні бронювання перевіряється доступність нового часу
Всі маршрути захищені через JWT guard
