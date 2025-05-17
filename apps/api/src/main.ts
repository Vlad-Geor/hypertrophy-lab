import { app } from './app';
import { loadEnv } from './config/env';

const { PORT } = loadEnv();

app.listen(PORT, () => {
  console.log(`[API] Running on http://localhost:${PORT}`);
});
