export const TOAST_TYPES = Object.freeze({
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
});

export const TOAST_DURATIONS = Object.freeze({
  success: 3000,
  info: 3500,
  warning: 4500,
  error: 5500,
});

export const createToastHelpers = (pushToast) => ({
  show: (message, type = TOAST_TYPES.SUCCESS, durationMs) => pushToast(message, type, durationMs),
  success: (message, durationMs) => pushToast(message, TOAST_TYPES.SUCCESS, durationMs),
  info: (message, durationMs) => pushToast(message, TOAST_TYPES.INFO, durationMs),
  warning: (message, durationMs) => pushToast(message, TOAST_TYPES.WARNING, durationMs),
  error: (message, durationMs) => pushToast(message, TOAST_TYPES.ERROR, durationMs),
});
