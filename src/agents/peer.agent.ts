import { PeerService } from '../services/peer.service';
import { SwarmAgent } from './swarm.agent';
import { WaspAgent } from './wasp.agent';
import { Part } from '../interfaces/task.interface';

export class PeerAgent {

  /**
   * Possible roles:
   *
   * ~ owner  - creator of the app
   * ~ master - admin of the swarm
   * ~ peer   - ordinary member of the swarm
   *
   */
  protected id: string;
  protected peerService: PeerService;

  constructor(id?: string) {
    if (id) {
      this.id = id;
    }

    this.peerService = new PeerService();
  }


  /**
   * Returns type of the agent
   *
   * @return {string}
   */
  public getType(): string {
    return 'peers';
  }

  /**
   * Returns peer id
   *
   * @return {string}
   */
  public getId(): string {
    return this.id
  }

  /**
   * Returns number of cores in peer devices
   *
   * @return {Promise<number>}
   */
  public getCores(): Promise<number> {
    return this.peerService.askInfo(this.id, 'cores');
  }

  /**
   * Returns number of devices activated with peer UID
   *
   * @return {Promise<boolean>}
   */
  public getDevices(): Promise<number> {
    return this.peerService.askInfo(this.id, 'devices');
  }

  /**
   * Change peer UID (unique identifier)
   *
   * @param {string} uid
   * @return {Promise<boolean>}
   */
  public setUID(uid: string): Promise<boolean> {
    if (typeof uid === 'string') {
      return this.peerService.setProperty(this.id, 'uid', uid)
        .then(result => {
          if (result.id) {
            this.id = result.id;
          }
          return result.value;
        });
    } else {
      return Promise.reject('String expected');
    }
  }

  /**
   * Returns the list of peer swarms
   *
   * @return {Promise<SwarmAgent[] | null>}
   */
  public list(): Promise<SwarmAgent[] | null> {
    return this.peerService.getSwarms(this.id);
  }

  /**
   * Join swarm (by swarm name)
   *
   * @param {string} name
   * @return {Promise<boolean>}
   */
  public join(name: string, secret?: string): Promise<boolean> {
    if (
      typeof name === 'string' &&
      (!secret || typeof secret === 'string')
    ) {
      return this.peerService.addProperty(this.id, 'swarms', name, Part.name);
    } else {
      return Promise.reject('String expected')
    }
  }

  /**
   * Leave the swarm (by swarm name)
   *
   * @param {string} name
   * @return {Promise<boolean>}
   */
  public leave(name: string): Promise<boolean> {
    if (typeof name === 'string') {
      return this.peerService.delProperty(this.id, 'swarms', name, Part.name);
    } else {
      return Promise.reject('String expected');
    }
  }

  /**
   * Execute the wasp in user context
   *
   * @param {WaspAgent | Function | Promise<WaspAgent>} wasp
   * @return {Promise<any> | Function}
   */
  public run(wasp: Promise<WaspAgent> | WaspAgent | Function): Promise<any> | Function {
    if (wasp instanceof WaspAgent || wasp instanceof Promise) {
      return this.peerService.run(wasp, this.id);
    } else if (typeof wasp === 'function') {
      const iiwe = {
        body: wasp.toString(),
        params: []
      };
      return (...params) => {
        iiwe.params = params;
        return this.peerService.run(iiwe, this.id);
      }
    } else {
      return Promise.reject('Wasp or function expected');
    }
  }

  /**
   * Returns true if peer is owner
   *
   * @return {Promise<boolean>}
   */
  public isOwner(): Promise<boolean> {
    return this.peerService.getProperty(this.id, 'owner')
      .then(result => result === null ? false : result);
  }

  /**
   * Returns true if peer has at least one device on-line
   *
   * @return {Promise<boolean>}
   */
  public isActive(): Promise<boolean> {
    return this.peerService.askInfo(this.id, 'active');
  }

  /**
   * Destroy the wasp completely
   *
   * @return {Promise<boolean>}
   */
  public remove(): Promise<boolean> {
    return this.peerService.remove(this.id);
  }
}
