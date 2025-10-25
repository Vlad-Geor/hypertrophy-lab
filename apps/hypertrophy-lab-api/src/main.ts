import pg from 'pg';
import { app } from './app.js';
import { db } from './config/database.js';
import { loadEnv } from './config/env.js';
import './worker/morning-summary.cron.js';
import { morningTask } from './worker/morning-summary.cron.js';
import { notifierTask } from './worker/supplement-intake-notifier.cron.js';

let srv: import('http').Server | undefined;

async function bootstrap() {
  const env = loadEnv();
  console.log('[BOOT] PORT', env.PORT);
  console.log('[BOOT] AUTH0_AUDIENCE', env.AUTH0_AUDIENCE);
  console.log('[BOOT] AUTH0_DOMAIN', env.AUTH0_DOMAIN);
  console.log('[BOOT] NODE_ENV', process.env.NODE_ENV);
  console.log('[BOOT] RENDER', process.env.RENDER);
  

  const client = new pg.Client({ connectionString: env.DB_URL });
  await client.connect();
  const { rows } = await client.query(`
  SELECT typarray FROM pg_type WHERE typname = 'health_target_enum'`);
  await client.end();

  const enumArrayOid: number = rows[0].typarray;

  pg.types.setTypeParser(enumArrayOid, (val: string) =>
    val
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim()),
  );

  notifierTask.start();
  morningTask.start();

  srv = app.listen(env.PORT, () => {
    console.log(`[API] Running on http://localhost:${env.PORT}`);
  });
}

async function shutdown(sig: string) {
  console.log('shutdown', sig);
  try {
    notifierTask.stop();
    morningTask.stop();
  } catch (err) {
    console.error(err);
  }
  try {
    if (srv) await new Promise((r) => srv.close(r));
  } catch (err) {
    console.error(err);
  }
  try {
    await db.destroy();
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});
process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

bootstrap().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});
