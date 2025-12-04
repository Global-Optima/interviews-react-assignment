# 🚀 Инструкция по деплою

Проект успешно загружен в GitHub: https://github.com/Yerassyl-hub/Shop-CRM

## Варианты деплоя

### 1. Vercel (Рекомендуется)

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите репозиторий `Yerassyl-hub/Shop-CRM`
5. Настройки:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
6. Нажмите "Deploy"

### 2. Netlify

1. Перейдите на [netlify.com](https://netlify.com)
2. Войдите через GitHub
3. Нажмите "New site from Git"
4. Выберите репозиторий `Yerassyl-hub/Shop-CRM`
5. Настройки:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
6. Нажмите "Deploy site"

### 3. GitHub Pages

1. В репозитории перейдите в Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `root`
4. Добавьте в `vite.config.ts`:
   ```typescript
   base: '/Shop-CRM/'
   ```
5. После деплоя проект будет доступен по адресу:
   `https://yerassyl-hub.github.io/Shop-CRM/`

## Важные замечания

⚠️ **MSW работает только в development режиме**

Для production деплоя нужно:
1. Либо заменить MSW на реальный API
2. Либо использовать статический JSON файл с данными
3. Либо настроить отдельный backend сервер

## Локальная сборка

```bash
# Установка зависимостей
pnpm install

# Инициализация MSW
npx msw init public/ --save

# Сборка
pnpm build

# Просмотр сборки
pnpm preview
```

Собранные файлы будут в папке `dist/`.

