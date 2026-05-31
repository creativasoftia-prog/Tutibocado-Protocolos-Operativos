import { app } from './app.js';
import { env } from './config/env.js';

process.on('unhandledRejection', (err) => {
  console.error('[UnhandledRejection]', err?.message ?? err);
});

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
