import Meetup from '../models/Meetup';
import Arquivo from '../models/Arquivo';

class Provider {
  async index(req, res) {
    const consulta = await Meetup.findAll({
      where: { id_user: req.userId },
      include: [{ model: Arquivo }],
    });

    return res.json(consulta);
  }
}
export default new Provider();
