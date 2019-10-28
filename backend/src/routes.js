import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ArquivoController from './app/controllers/ArquivoController';
import MeetupController from './app/controllers/MeetupController';
import ProviderController from './app/controllers/ProviderController';
import InscricaoController from './app/controllers/InscricaoController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/arquivos', upload.single('file'), ArquivoController.store);
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.use(authMiddleware);
routes.post('/meetup', MeetupController.store);
routes.get('/meetup', MeetupController.index);
routes.put('/meetup/:id', MeetupController.update);
routes.delete('/meetup/:id', MeetupController.delete);
routes.get('/meetups', ProviderController.index);
routes.put('/users', UserController.update);
routes.post('/inscricao', InscricaoController.store);
routes.get('/inscricao', InscricaoController.index);

export default routes;
