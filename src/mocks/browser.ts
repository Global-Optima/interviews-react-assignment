import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export function enableMockServiceWorker() {
  return worker.start({
    onUnhandledRequest(req, print) {
      // Игнорируем внешние URL (изображения и т.д.)
      const url = new URL(req.url);
      if (url.origin !== window.location.origin) {
        return;
      }
      // Предупреждаем только о локальных необработанных запросах
      print.warning();
    },
  }).then(() => {
    console.log('[MSW] Mocking enabled');
  }).catch((error) => {
    console.error('[MSW] Failed to start:', error);
  });
}
