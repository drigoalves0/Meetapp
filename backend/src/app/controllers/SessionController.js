import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authconfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // validacao email e senha
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }
    // consulta inicio
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    const { id, nome } = user;
    return res.json({
      user: { id, nome, email },
      token: jwt.sign({ id }, authconfig.secret, {
        expiresIn: authconfig.expires,
      }),
    });
  }
}
export default new SessionController();
