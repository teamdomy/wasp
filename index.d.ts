declare interface Main {
  peer: any;
  wasp: any;
  swarm: any;

  peers: PeerRepository;
  swarms: SwarmRepository;
  wasps: WaspRepository;
}

export declare interface Wasp {
  getId(): string;
  setParams(params: any[]): void;
  getParams(): any[];
  setPure(pure: boolean): Promise<boolean>;
  isPure(): Promise<boolean>;
  getTimeout(): Promise<number>;
  setTimeout(timeout: number): Promise<boolean>;
  setName(name: string): Promise<boolean>;
  getName(): Promise<string>;
  list(): Promise<Swarm[]>;
  join(name: string): Promise<boolean>;
  leave(name: string): Promise<boolean>;
  get(): Promise<string>;
  set(func: Function): Promise<boolean>;
  remove(): Promise<boolean>;
}

export declare interface Swarm {
  getId(): string;
  getCores(): Promise<number>;
  getDevices(): Promise<number>;
  setName(name: string): Promise<boolean>;
  getName(): Promise<string>;
  addPeer(peer: Peer): Promise<boolean>;
  removePeer(peer: Peer): Promise<boolean>;
  hasPeer(peer: Peer): Promise<boolean>;
  getPeers(): Promise<Peer[]>;
  addWasp(wasp: Wasp): Promise<boolean>;
  removeWasp(wasp: Wasp): Promise<boolean>;
  hasWasp(wasp: Wasp): Promise<boolean | string>;
  getWasps(): Promise<Wasp[]>;
  addMaster(peer: Peer): Promise<boolean>;
  removeMaster(peer: Peer): Promise<boolean>;
  hasMaster(peer: Peer): Promise<boolean>;
  getMasters(): Promise<Peer[]>;
  kick(peer: Peer): Promise<boolean>;
  ban(peer: Peer): Promise<boolean>;
  getDescription(): Promise<string>;
  setDescription(desc: string): Promise<boolean>;
  run(wasp: Wasp | Promise<Wasp>): Promise<any>;
  lock(key: string): Promise<boolean>;
  listen(action: string): Promise<any>;
  remove(): Promise<boolean>;
}

export declare interface Peer {
  getId(): string;
  isOwner(): Promise<boolean>;
  getCores(): Promise<number>;
  getDevices(): Promise<number>;
  setUID(uid: string): Promise<boolean>;
  list(): Promise<Swarm[]>;
  join(name: string, secret?: string): Promise<boolean>;
  leave(name: string): Promise<string>
  run(wasp: Promise<Wasp> | Wasp | Function): Promise<any> | Function;
  remove(): Promise<boolean>
  isActive(): Promise<boolean>
}

declare interface PeerRepository {
  getAll(): Promise<Peer[]>;
  getByName(name: string): Promise<Peer>;
  getById(id: string): Promise<Peer>;
  create(name?: string): Promise<Peer>;
  removeById(id: string): Promise<boolean>;
  getBySwarm(name: string): Promise<Peer[]>;
}

declare interface WaspRepository {
  getAll(): Promise<Wasp[]>;
  getByName(name: string): Promise<Wasp>;
  getById(id: string): Promise<Wasp>;
  create(name?: string): Promise<Wasp>;
  removeById(id: string): Promise<boolean>;
  getBySwarm(name: string): Promise<Wasp[]>;
}

declare interface SwarmRepository {
  getAll(): Promise<Swarm[]>;
  getByName(name: string): Promise<Swarm>;
  getById(id: string): Promise<Swarm>;
  create(name?: string): Promise<Swarm>;
  removeById(id: string): Promise<boolean>;
  getByPeer(id: string): Promise<Swarm[]>;
}
