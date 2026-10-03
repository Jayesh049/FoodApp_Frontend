const dsn = import.meta.env.VITE_SENTRY_DSN;

export function initClientSentry() {
  if (!dsn) return;
  void import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0,
      sendDefaultPii: false,
      beforeSend(event) {
        if (event.request?.headers) {
          delete event.request.headers.cookie;
          delete event.request.headers.authorization;
        }
        if (event.request) {
          delete event.request.cookies;
        }
        return event;
      },
    });
  });
}

export function reportClientError(error: unknown) {
  if (!dsn) return;
  void import("@sentry/react").then((Sentry) => {
    Sentry.captureException(error);
  });
}
