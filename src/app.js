import express from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerDocument from '../resources/swagger.json' with { type: 'json' };
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const webAppDirectory = path.resolve(currentDirectory, '../portfolio-web/dist');

app.use(express.json());
app.use(express.static(webAppDirectory));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/swagger.json', (_req, res) => res.json(swaggerDocument));
app.use('/api', routes);
app.use(errorHandler);

export default app;
