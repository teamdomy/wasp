import * as Socket from 'socket.io-client';
import { env } from '../../environments/environment';
import { Order } from '../interfaces/order.interface';

export class ActionService {

  protected send;
  public hive: any;
  protected pool = new Map();
  protected socket: Socket;


  /**
   * Initiate communication
   */
  public setUpLinks(): void {

    this.socket = Socket(env.queen, {
      'forceNew': true,
      'timeout': 10000,
      'secure': env.secure
    });

    this.socket.on('data.res', result =>
      this.send(result)
    );

    this.socket.on('order.run', order =>
      this.perform(order, result =>
        this.socket.emit('order.res', result)
      )
    );

    this.socket.on('info.req', info =>
      this.provide(info, result =>
        this.socket.emit('info.res', result)
      )
    );
  }

  public setOrder(order) {
    if (order.local) {
      return this.perform(order, result =>
        this.send(result)
      );
    } else {
      this.socket.emit('order.run', order);
    }
  }

  /**
   * Get information about any device
   */
  public getInfo(info) {
    this.socket.emit('info.req', info);
  }

  public setTask(task) {
    this.socket.emit('task.req', task);
  }

  public setQuery(query) {
    this.socket.emit('query.req', query);
  }

  public setWatch(data) {
    this.socket.emit('watch.req', data);
  }

  public authPeer(data) {

    if (data.peer && data.app) {

      this.socket.emit('peer.auth', data);

      this.socket.on('reconnect', () => {
        this.socket.emit('peer.auth', data);
      });
    }

  }

  /**
   * Provide information about the device.
   *
   */
  public provide(info, claw) {

    if (
      info &&
      info.data &&
      info.data.property === 'cores'
    ) {
      info.data.value = this.getCores();

      return claw(info);
    }
  }

  protected perform(order: Order, claw: Function) {}

  protected getCores() {}
}
