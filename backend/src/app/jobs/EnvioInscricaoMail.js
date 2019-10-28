import Mail from '../../lib/Mail';

class EnvioInscricaoMail {
  get key() {
    return 'EnvioInscricaoMail';
  }

  async handle({ data }) {
    const { meetup, usuario } = data;

    await Mail.sendMail({
      to: `${meetup.User.nome}<${meetup.User.email}>`,
      subject: 'Confirmação de inscrição',
      template: 'inscricoes',
      context: {
        organizador: meetup.User.nome,
        meetup: meetup.title,
        user: usuario.nome,
        email: usuario.email,
      },
    });
  }
}
export default new EnvioInscricaoMail();
