import { SwarmService } from '../services/swarm.service';
import { PeerAgent } from './peer.agent';
import { WaspAgent } from './wasp.agent';

export class SwarmAgent {

  protected id: string;
  protected swarmService: SwarmService;

  constructor(id?: string) {
    if (id) {
      this.id = id;
    }

    this.swarmService = new SwarmService();
  }


  /**
   * Returns type of the agent
   *
   * @return {string}
   */
  public getType(): string {
    return 'swarms';
  }

  /**
   * Returns swarm id
   *
   * @return {string}
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Returns number of cores in all swarm devices
   *
   * @return {Promise<number>}
   */
  public getCores(): Promise<number> {
    return this.swarmService.askInfo(this.id, 'cores');
  }

  /**
   * Returns number of devices in swarm
   *
   * @return {Promise<boolean>}
   */
  public getDevices(): Promise<number> {
    return this.swarmService.askInfo(this.id, 'devices');
  }

  /**
   * Set swarm name
   *
   * @param {string} name
   * @return {Promise<boolean>}
   */
  public setName(name: string): Promise<boolean> {
    if (typeof name === 'string') {
      return this.swarmService.setProperty(this.id, 'name', name)
        .then(result => {
          this.id = result.id;
          return result.value;
        });
    } else {
      return Promise.reject('String expected');
    }
  }

  /**
   * Get swarm name
   *
   * @return {Promise<string>}
   */
  public getName(): Promise<string> {
    return this.swarmService.getProperty(this.id, 'name');
  }

  /**
   * Add peer to the swarm list
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public addPeer(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      return this.swarmService.addProperty(this.id, 'peers', peer.getId());
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Remove peer from the swarm list
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public removePeer(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      return this.swarmService.delProperty(this.id, 'peers', peer.getId())
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Returns true if peer is in the swarm
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public hasPeer(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      return this.swarmService.hasProperty(this.id, 'peers', peer.getId())
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Returns the list of peers in the swarm
   *
   * @return {Promise<PeerAgent[]>}
   */
  public getPeers(): Promise<PeerAgent[]> {
    return this.swarmService.getPeers(this.id);
  }

  /**
   * Add wasp to the swarm list
   *
   * @param {WaspAgent} wasp
   * @return {Promise<boolean>}
   */
  public addWasp(wasp: WaspAgent): Promise<boolean> {
    if (wasp instanceof WaspAgent) {
      return this.swarmService.addProperty(this.id, 'wasps', wasp.getId());
    } else {
      Promise.reject('Wasp expected');
    }
  }

  /**
   * Remove wasp from the swarm list
   *
   * @param wasp
   * @return {Promise<boolean>}
   */
  public removeWasp(wasp: WaspAgent): Promise<boolean> {
    if (wasp instanceof WaspAgent) {
      return this.swarmService.delProperty(this.id, 'wasps', wasp.getId());
    } else {
      return Promise.reject('Wasp expected');
    }
  }

  /**
   * Returns true if wasp is in the member of the swarm
   *
   * @param {WaspAgent} wasp
   * @return {Promise<boolean>}
   */
  public hasWasp(wasp: WaspAgent): Promise<boolean | string> {
    if (wasp instanceof WaspAgent) {
      return this.swarmService.hasProperty(this.id, 'wasps', wasp.getId());
    } else {
      return Promise.reject('Wasp expected');
    }
  }

  /**
   * Returns the list of wasps in the swarm
   *
   * @return {Promise<WaspAgent[]>}
   */
  public getWasps(): Promise<WaspAgent[]> {
    return this.swarmService.getWasps(this.id);
  }

  /**
   * Promotes an ordinary peer to the master
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public addMaster(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof  PeerAgent) {
      return this.swarmService.addProperty(this.id, 'masters', peer.getId());
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Remove thr peer from the master list
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public removeMaster(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      return this.swarmService.delProperty(this.id, 'masters', peer.getId());
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Returns true if peer is the master of the swarm
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public hasMaster(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      return this.swarmService.hasProperty(this.id, 'masters', peer.getId());
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Returns the list of masters in the swarm
   *
   * @return {Promise<PeerAgent[]>}
   */
  public getMasters(): Promise<PeerAgent[]> {
    return this.swarmService.getMasters(this.id);
  }
  //
  // public addGuard(wasp: GuardAgent) {
  //   if (wasp instanceof GuardAgent) {
  //     return this.swarmService.addProperty(this.id, 'guards', wasp.getId());
  //   }
  // }
  //
  // public removeGuard(wasp: GuardAgent) {
  //   if (wasp instanceof WaspAgent) {
  //     return this.swarmService.delProperty(this.id, 'guards', wasp.getId());
  //   }
  // }
  //
  // public hasGuard(wasp: GuardAgent) {
  //   if (wasp instanceof WaspAgent) {
  //     return this.swarmService.hasProperty(this.id, 'guards', wasp.getId());
  //   }
  // }
  //
  // public getGuards(): Promise<GuardAgent[]> {
  //   return this.swarmService.getGuards(this.id);
  // }

  /**
   * Remove the peer from the swarm (removePeer alias)
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public kick(peer: PeerAgent): Promise<boolean> {
    return this.removePeer(peer);
  }

  /**
   * Remove the peer from the swarm list and add it to the blacklist
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public ban(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      this.kick(peer).then(() =>
        this.swarmService.addProperty(this.id, 'blacklist', peer.getId())
      )
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Ignore order request coming from the peer (ban on execution).
   *
   * @param {PeerAgent} peer
   * @return {Promise<boolean>}
   */
  public ignore(peer: PeerAgent): Promise<boolean> {
    if (peer instanceof PeerAgent) {
      //
    } else {
      return Promise.reject('Peer expected');
    }
  }

  /**
   * Returns description of the swarm
   *
   * @return {Promise<string>}
   */
  public getDescription(): Promise<string> {
    return this.swarmService.getProperty(this.id, 'description');
  }

  /**
   * Add description of the swarm
   *
   * @param {string} desc
   * @return {Promise<boolean>}
   */
  public setDescription(desc: string): Promise<boolean> {
    if (typeof desc === 'string') {
      return this.swarmService.setProperty(this.id, 'description', desc)
    } else {
      return Promise.reject('String expected');
    }
  }

  /**
   * Execute the wasp in swarm context
   *
   * @param {WaspAgent | Promise<WaspAgent>} wasp
   * @return {Promise<any>}
   */
  public run(wasp: WaspAgent | Promise<WaspAgent>): Promise<any> {
    if (wasp instanceof WaspAgent || wasp instanceof Promise) {
      return this.swarmService.run(wasp, this.id);
    } else {
      return Promise.reject('Wasp or promise expected');
    }
  }

  /**
   * Lock swarm with a key
   *
   * @param {string} key
   * @return {Promise<boolean>}
   */
  public lock(key: string): Promise<boolean> {
    if (typeof key === 'string') {
      return this.swarmService.setProperty(this.id, 'key', key)
    } else {
      return Promise.reject('String expected');
    }
  }

  /**
   * Listen to an event - join, leave, run
   *
   * @param {string} event
   * @return {Promise}
   */
  public listen(action: string): Promise<any> {
    if (
      typeof action === 'string' &&
      ~['join', 'leave', 'run'].indexOf(action)
    ) {
      return this.swarmService.listen(this.id, action);
    } else {
      return Promise.reject('String expected');
    }
  }

  /**
   * Destroy the swarm completely
   *
   * @return {Promise<boolean>}
   */
  public remove(): Promise<boolean> {
    return this.swarmService.remove(this.id);
  }
}
