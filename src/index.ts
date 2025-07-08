import express from 'express';

const app = express();

app.get('/', (_, res) => {
  res.send('Spark Backend is running');
});

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
