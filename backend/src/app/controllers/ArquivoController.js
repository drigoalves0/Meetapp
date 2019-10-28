import Arquivo from '../models/Arquivo';

class ArquivoController {
  async store(req, res) {
    const { originalname: nome, filename: path } = req.file;

    const arquivo = await Arquivo.create({
      nome,
      path,
    });
    return res.json(arquivo);
  }
}

export default new ArquivoController();
