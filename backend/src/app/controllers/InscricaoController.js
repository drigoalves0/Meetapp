import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Inscricao from '../models/Inscricao';
import Queue from '../../lib/Queue';
import EnvioInscricaoMail from '../jobs/EnvioInscricaoMail';

class IncricaoController {
  async index(req, res) {
    const inscricao = await Inscricao.findAll({
      where: { id_user: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          // exibe apenas inscrições que tem meetups no banco
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(inscricao);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.body.id_meetup, {
      include: [User],
    });

    if (meetup.id_user === req.userId) {
      return res.status(400).json({
        error: 'Você organiza esse evento e por isso não pode se inscrever',
      });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: 'Esse meetup já aconteceu por isso não pode se inscrever',
      });
    }

    const inscricao_repetida = await Inscricao.findOne({
      where: {
        id_user: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (inscricao_repetida) {
      return res.status(400).json({
        error:
          'Esse meetup já inscreveu nesse meetup ou se inscreveu em outro no mesmo horario',
      });
    }
    const usuario = await User.findByPk(req.userId);
    await Inscricao.create({
      id_user: req.userId,
      id_meetup: meetup.id,
    });
    await Queue.add(EnvioInscricaoMail.key, {
      meetup,
      usuario,
    });
    return res.json('inscricao realizada com sucesso');
  }
}
export default new IncricaoController();
