import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import Arquivo from '../app/models/Arquivo';
import Meetup from '../app/models/Meetup';
import Inscricao from '../app/models/Inscricao';

import databaseConfig from '../config/database';

const models = [User, Arquivo, Meetup, Inscricao];
class Database {
  constructor() {
    this.init();
    this.associate();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    // .map(model => model.associate && model.associate(this.connection.models););
  }

  associate() {
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}
export default new Database();
