import Queue from 'bull';
import {EmailInfo} from './email.service';
// import {emailService} from './index';

class QueueService {
  emailQueue;

  constructor() {
    this.emailQueue = new Queue('emailQueue', {
      redis: {
        port: parseInt(process.env.REDIS_PORT || '6379'),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
      },
    });
    this.emailQueue.process(async (job, done) => {
      console.log('Job is triggered: ', job.data);
      // await emailService.sendMail(job.data);
      done();
    });
  }

  addedEmailInQueue(data: EmailInfo) {
    const options: Queue.JobOptions = {
      removeOnComplete: true,
    };
    this.emailQueue.add(data, options);
  }
}

export default QueueService;
