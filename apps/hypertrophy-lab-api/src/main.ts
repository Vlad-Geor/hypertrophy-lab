import pg from 'pg';
import { app } from './app.js';
import { loadEnv } from './config/env.js';

async function bootstrap() {
  const { PORT, DB_URL } = loadEnv();

  const client = new pg.Client({ connectionString: DB_URL });
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

  app.listen(PORT, () => {
    console.log(`[API] Running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});
