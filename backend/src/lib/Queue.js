import Bee from 'bee-queue';
import EnvioInscricaoMail from '../app/jobs/EnvioInscricaoMail';
import redisConfig from '../config/redis';

const jobs = [EnvioInscricaoMail];
class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('fail', this.handleFaulure).process(handle);
    });
  }

  handleFaulure(job, err) {
    console.log(`Error fila ${job.queue.name}: falha `, err);
  }
}
export default new Queue();
