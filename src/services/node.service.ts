import { ActionService } from './action.service';
import { Order } from '../interfaces/order.interface';
import { env } from '../../environments/environment';
import * as Path from 'path';
const { fork } = require('child_process');
const os = require('os');
const https = require('https');

export class NodeService extends ActionService {

  protected cache = new Map();

  constructor() {
    super();
    this.hive = process;
    this.send = data =>
      process.send(data);
  }


  /**
   * Execute the function in child process
   *
   * @param order
   * @param claw
   * @return {undefined}
   */
  protected perform(order: Order, claw: Function) {
    if (
      fork &&
      order.app &&
      order.data &&
      order.data.id
    ) {

      const hash = Buffer.from(
        order.app + '/' + order.data.id + '/' + order.data.version + '/node'
      ).toString('base64');

      const promise = new Promise((resolve, reject) => {
        if (this.cache.has(hash)) {
          resolve(this.cache.get(hash));
        } else {
          const url = env.nest + env.ver + '/wasps/' + hash;
          https.get(url, response => {
            if (response.statusCode === 200) {
              let script = '';
              response.setEncoding('utf8');
              response.on('data', chunk => script += chunk);
              response.on('error', error => reject(error));
              response.on('end', () => {
                this.cache.set(hash, script);
                resolve(script);
              })
            }
          })
        }
      });

      promise.then(script => {
        if (this.pool.has(hash)) {
          return {
            script: script,
            wasp: this.pool.get(hash)
          }
        } else {
          const forked = fork(Path.resolve(__dirname, './helper.back.js'));

          // const forked = fork('/var/www/darkwasp/hive/helpers/node.helper',
          //   [],
          //   {
          //     execArgv: ['--inspect-brk=64435']
          //   }
          // );

          this.pool.set(hash, forked);

          setTimeout(() => {
            this.pool.delete(hash);
            forked.kill();
          }, order.timeout);

          const gate = data => {

            let result: any;

            if (data && data.order) {
              result = data.order;
            } else if (data.type === 'error') {
              result = order;
              result['error'] =  data.message;
            }

            claw(result);

          };

          forked.on('message', gate);
          forked.on('error', gate);

          return {
            script: script,
            wasp: forked,
          };
        }
      }).then(data => {
        data.wasp.send({
          order: order,
          script: data.script
        });
      }).catch(err => console.log(err))
    }

  }

  /**
   * Number of processor cores
   *
   * @returns {number}
   */
  protected getCores(): number {
    return os.cpus().length;
  }
}
