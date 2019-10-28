import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const page = req.query.page || 1;

    const parsedDate = parseISO(req.query.date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      include: [{ model: User, attributes: ['nome', 'email'] }],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      id_arquivo: Yup.number().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Data invalida' });
    }
    const id_user = req.userId;
    const { title, id_arquivo, descricao, localizacao, date } = req.body;
    const meetup = await Meetup.create({
      title,
      id_arquivo,
      descricao,
      localizacao,
      date,
      id_user,
    });
    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      id_user: Yup.number(),
      id_arquivo: Yup.number(),
      descricao: Yup.string(),
      localizacao: Yup.string(),
      date: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const id_user = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.id_user !== id_user) {
      return res.status(403).json({ error: 'Erro ao editar' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Data invalida' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Esse meetup já aconteceu e não pode ser alterado' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const id_user = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.id_user !== id_user) {
      return res.status(403).json({ error: 'Erro ao editar' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Nao pode cancelar esse meetup.' });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
