import { PeerAgent } from '../agents/peer.agent';
import { WaspAgent } from '../agents/wasp.agent';
import { Task } from '../interfaces/task.interface';
import { Order } from '../interfaces/order.interface';
import { Query } from '../interfaces/query.interface';
import { Info } from '../interfaces/info.interface';

export class SourceService {

  public static peer: PeerAgent;
  public static app: string;

  public static send;
  private static gate;

  /**
   * Generates a random sequence
   *
   * @returns {string}
   */
  public static getSerial(): string {
    return 'sn.' + (Math.random() + 10).toString(7);
  }

  /**
   * Stores data necessary for communication with the colony
   *
   * @param { { app: string, peer: string } } auth
   * @param gate
   * @param {Function} send
   * @return {Promise<PeerAgent>}
   */
  public setTarget(
    auth: { app: string, peer: string },
    gate: any,
    send: Function
  ): Promise<PeerAgent> {
    SourceService.send = send;
    SourceService.gate = gate;

    return this.authPeer(auth);
  }

  /**
   * Authenticates the peer
   *
   * @param { { app: string, peer: string } } auth
   * @return {Promise<PeerAgent>}
   */
  public authPeer(auth: { app: string, peer: string }): Promise<PeerAgent> {

    return this.request(auth, 'auth')
      .then(result => {

        const peer = new PeerAgent(result.id);

        SourceService.peer = peer;
        SourceService.app = auth.app;

        return peer;
      });
  }

  /**
   * Prepares the wasp for execution
   *
   * @param {WaspAgent | Promise<WaspAgent> | { body: string, params: any[] }} wasp
   * @param {string} id
   * @param {string} host
   */
  public execute(
    wasp: WaspAgent | Promise<WaspAgent> | { body: string, params: any[] },
    id: string,
    host: string
  ): Promise<any> {
    if (wasp instanceof Promise) {
      return wasp.then(data =>
        this.makeOrder(data, id, host)
      );
    } else {
      return this.makeOrder(wasp, id, host);
    }
  }

  /**
   * Prepares info request (device related)
   *
   * @param {Info} info
   * @return {Promise<any>}
   */
  public inform(info: Info): Promise<any> {

    if (info.subject === SourceService.peer.getId()) {
      info.local = true;
    }

    return this.request(info, 'info');
  }

  /**
   * Prepares request for agent properties manipulation
   *
   * @param {Task} task
   * @return {Promise<any>}
   */
  public setTask(task: Task): Promise<any> {
    return this.request(task, 'task');
  }

  /**
   * Prepares request for swarm even listener
   *
   * @param data
   * @return {Promise<any>}
   */
  public setWatch(data): Promise<any> {
    return this.request(data, 'watch');
  }

  /**
   * Prepares query for platform storage
   *
   * @param query
   * @return {Promise}
   */
  public setQuery(query: Query): Promise<any> {
    return this.request(query, 'query');
  }

  /**
   * Creates order for wasp execution
   *
   * @param {WaspAgent |  { body: string, params: any[] }} wasp
   * @param {string} id
   * @param {string} agent
   * @return Promise<any>
   */
  public makeOrder(
    wasp: WaspAgent |  { body: string, params: any[] },
    id: string,
    agent: string
  ): Promise<any> {

    const peer = SourceService.peer;

    const order: Order = {
      data: {},
      subject: id,
      agent: agent
    };

    if (wasp instanceof WaspAgent) {

      const promises = Promise.all([
        wasp.isPure(),
        wasp.getTimeout()
      ]);

      return promises.then(result => {
        order.data = {
          id: wasp.getId(),
          params: wasp.getParams(),
          pure: result[0]
        };

        if (id === peer.getId()) {
          order.timeout = result[1];
          order.local = true;
          order.app = SourceService.app;
        }

        return this.request(order, 'order');
      })

    } else if (wasp.body) {
      order.data = {
        body: wasp.body,
        params: wasp.params
      };

      return this.request(order, 'order');
    } else {
      return Promise.reject('Incorrect order');
    }

  }

  /**
   * Send the request to the colony and create response listener
   *
   * @param request
   * @param {string} type
   * @return {Promise}
   */
  public request(request: any, type: string): Promise<any> {

    request['type'] = type;
    request['sn'] = SourceService.getSerial();

    return new Promise((resolve, reject) => {

      const handler = event => {

        let result: any;

        if (event.sn) {
          result = event;
        } else if (event['data']) {
          result = event['data'];
        }

        if (
          result && result.sn === request.sn
        ) {
          if (result.error) {
            reject(result.error);
          } else if (!result.data.hasOwnProperty('value')) {
            reject('Wrong request')
          } else {
            if (result.created) {
              resolve({
                value: result.data.value,
                id: result.subject
              });
            } else {
              resolve(result.data.value);
            }
          }

          if (SourceService.gate.removeEventListener) {
            SourceService.gate.removeEventListener('message', handler);
          } else {
            SourceService.gate.removeListener('message', handler);
          }

        }

      };

      SourceService.send(request);

      if (SourceService.gate.addEventListener) {
        SourceService.gate.addEventListener('message', handler);
      } else {
        SourceService.gate.on('message', handler);
      }

    });

  }
}
