import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../resources/swagger.json' with { type: 'json' };
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/swagger.json', (_req, res) => res.json(swaggerDocument));
app.use('/api', routes);
app.use(errorHandler);

export default app;
