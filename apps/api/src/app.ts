import express, { Application } from 'express';
import supplementRouter from './routes/supplement.routes';

const app: Application = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Mount supplement routes at /api/supplements
app.use('/api/supplements', supplementRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.send('Server is healthy!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
