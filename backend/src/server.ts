import { dot } from 'node:test/reporters';
import app from './app';
import { configDotenv } from 'dotenv';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
