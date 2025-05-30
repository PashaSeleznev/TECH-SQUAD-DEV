# Radex AI - Система анализа рентгенограмм

Система для автоматического анализа рентгеновских снимков с использованием искусственного интеллекта. Проект состоит из FastAPI бэкенда и React фронтенда.

## Структура проекта

```
├── src/                         # Исходный код фронтенда
│   ├── actions/                 # Логика работы с изображениями и рисованием
|       ├── defects.ts           # Функции для работы с дефектами и их сохранением
|       ├── draw.ts              # Обработчики событий рисования (мышь, клавиатура)
│   ├── components/              # Переиспользуемые UI-компоненты
|       ├── ColorArray.ts        # Массив доступных цветов и классов
|       ├── ColorPalette.tsx     # Палитра цветов для выбора класса дефекта
|       ├── Editor.tsx           # Основной компонент редактора изображений
|       ├── Header.tsx           # Компонент верхней панели (навигация)
|       ├── LoginForm.tsx        # Форма авторизации
|       ├── RegisterForm.tsx     # Форма регистрации  
│   ├── pages/                   # Страницы приложения
|       ├── AccountPage.tsx      # Страница пользователя
|       ├── ImagePage.tsx        # Страница загрузки и редактирования изображений
|       ├── ReportsPage.tsx      # Страница с отчетами
│   ├── App.tsx                  # Основной компонент приложения
│   ├── custom.d.ts              # # Объявления модулей (для импорта .png)
│   ├── index.css                # Глобальные стили приложения
│   ├── main.tsx                 # Точка входа приложения, рендеринг в DOM
│   ├── vite-env.d.ts            # Типы окружения для Vite
├── public/                
│   └── images/                  # Папка с иконками и статическими изображениями
├── index.html                   # HTML-шаблон приложения
├── ...                          # Прочие конфигурационные файлы (vite.config, tsconfig, и т.п.)
```

## Технологии

### Frontend
- React.js — библиотека для построения пользовательских интерфейсов
- TypeScript — типизированное надмножество JavaScript
- Vite — быстрый сборщик и dev-сервер
- React Router — маршрутизация между страницами
- Konva + React-Konva — отрисовка и взаимодействие с изображениями и фигурами на Canvas


## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект в режиме разработки (http://localhost:5173)
```bash
npm run dev
```

4. Соберите проект для продакшена:
```bash
npm run build
```

Сервер будет доступен по адресу http://localhost:8000 при локальном запуске.
Если вы планируете использовать сервер на разных устройствах (например, через serveo, ngrok или аналогичные сервисы), используйте соответствующий внешний адрес. Не забудьте указать актуальный адрес сервера в файле .env.


## API Endpoints

### Пользователи
- `GET /users/` - Получить список всех пользователей
- `POST /users/` - Создать нового пользователя
- `DELETE /users/{user_id}` - Удалить пользователя

### Изображения
- `POST /upload` - Загрузить новое изображение
- `POST /replace-image` - Заменить существующее изображение
- `GET /defects` - Получить примеры дефектов

## Особенности 

1. **Обработка изображений**
   - Поддержка PNG формата
   - Максимальный размер файла: 100MB
   - Автоматическое определение дефектов с помощью AI

2. **Генерация отчетов**
   - Автоматическое создание PDF-отчетов
   - Детальное описание найденных дефектов
   - Сохранение истории анализов

## Backend

Расположен в другом репозитории: https://github.com/RipYashok/Radex-backend
