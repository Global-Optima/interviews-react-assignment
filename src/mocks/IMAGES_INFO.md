# Информация об изображениях

## Текущие изображения

Все изображения в моках используют **Unsplash** - бесплатный сервис placeholder изображений.

URL формат: `https://images.unsplash.com/photo-{ID}?w=400`

## Варианты замены

### Вариант 1: Локальные изображения

1. Создайте папку `public/images/products/`
2. Поместите туда изображения (например: `headphones.jpg`, `watch.jpg`)
3. Замените URL в `handlers.ts`:

```typescript
image: '/images/products/headphones.jpg'
```

### Вариант 2: Свои URL

Замените URL на ваши:

```typescript
image: 'https://your-domain.com/images/product1.jpg'
```

### Вариант 3: Placeholder сервисы

- **Unsplash Source**: `https://source.unsplash.com/400x400/?headphones`
- **Placeholder.com**: `https://via.placeholder.com/400`
- **Picsum**: `https://picsum.photos/400/400`

### Вариант 4: Base64 изображения

Для небольших изображений можно использовать base64:

```typescript
image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
```

## Текущие изображения в проекте

Все изображения находятся в файле `src/mocks/handlers.ts` в массиве `mockProducts`.


