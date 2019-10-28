import { Model, Sequelize } from 'sequelize';
import { isBefore } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // this.hasMany(models.Subscription, { foreignKey: 'meetup_id' });
    this.belongsTo(models.Arquivo, { foreignKey: 'id_arquivo' });
    this.belongsTo(models.User, { foreignKey: 'id_user' });
  }
}

export default Meetup;
