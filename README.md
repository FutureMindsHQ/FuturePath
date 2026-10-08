# FuturePath

Обычный сайт: открывается по ссылке, регистрация в Claude не нужна. Только ИИ-функции идут через Claude API.

## Запуск (Vercel, ~5 минут)
1. Залей папку в GitHub-репозиторий.
2. vercel.com -> Add New Project -> выбери репозиторий.
3. Settings -> Environment Variables -> добавь `ANTHROPIC_API_KEY` (ключ из console.anthropic.com).
4. Deploy. Готово: получишь ссылку вида https://futurepath.vercel.app

Netlify тоже подойдёт: те же шаги, переменная `ANTHROPIC_API_KEY`.
Ключ хранится только на сервере и не попадает на сайт.
