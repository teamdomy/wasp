import { env } from '../../environments/environment';
import { Order } from '../interfaces/order.interface';
import { ActionService } from './action.service';

export class BrowserService extends ActionService {

  constructor() {
    super();
    this.hive = self.parent;
    this.send = data =>
      self.parent.postMessage(data, '*');
  }


  protected perform(order: Order, claw: Function) {

    if (
      Worker &&
      order.app &&
      order.data &&
      order.data.id
    ) {

      let worker: Worker;

      const url = env.nest + env.ver + '/wasps/' + btoa(
        order.app + '/' + order.data.id + '/' + order.data.version
      );

      if (this.pool.has(url)) {
        worker = this.pool.get(url);
      } else {

        worker = new Worker(url);
        this.pool.set(url, worker);

        setTimeout(() => {
          this.pool.delete(url);
          worker.removeEventListener('message', gate);
          worker.terminate();
        }, order.timeout);

        const gate = event => {

          let result: any;

          if (event.data && event.data.order) {
            result = event.data.order;
          } else if (event.type === 'error') {
            result = order;
            result['error'] = event.message;
          }

          claw(result);

        };

        worker.addEventListener('message', gate);
        worker.addEventListener('error', gate);
      }

      worker.postMessage({
        order: order
      });

    }
  }

  /**
   * Number of processor cores
   *
   * @returns {number}
   */
  protected getCores(): number {
    return navigator.hardwareConcurrency;
  }
}
