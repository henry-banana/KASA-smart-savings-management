import { APP_CONFIG } from '@/config/app.config';

class Logger {
  constructor() {
    this.enabled = APP_CONFIG.enableLogger;
  }

  log(message, data) {
    if (!this.enabled) return;
    console.log(`[LOG] ${message}`, data);
  }

  info(message, data) {
    if (!this.enabled) return;
    console.info(`[INFO] ${message}`, data);
  }

  warn(message, data) {
    if (!this.enabled) return;
    console.warn(`[WARN] ${message}`, data);
  }

  error(message, error) {
    if (!this.enabled) return;
    console.error(`[ERROR] ${message}`, error);
  }

  debug(message, data) {
    if (!this.enabled) return;
    console.debug(`[DEBUG] ${message}`, data);
  }
}

export const logger = new Logger();
