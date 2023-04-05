import express from 'express';
import { router } from './routes';
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const server = express();

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
server.use(express.json())
server.use(router)

server.listen(5000, () => console.log('Server on'))
