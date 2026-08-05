import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
  console.log(`Swagger available at http://localhost:${port}/api-docs`);
});
