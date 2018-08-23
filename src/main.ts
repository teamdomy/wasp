import { PeerAgent } from './agents/peer.agent';
import { WaspProxy } from './proxies/wasp.proxy';
import { SwarmProxy } from './proxies/swarm.proxy';
import { SwarmAgent } from './agents/swarm.agent';
import { WaspRepository } from './repositories/wasp.repository';
import { PeerRepository } from './repositories/peer.repository';
import { SwarmRepository } from './repositories/swarm.repository';
import { WaspAgent } from './agents/wasp.agent';

export class Main {

  // host of app
  public peer: PeerAgent;

  // Helpers
  public wasp;
  public swarm;

  // Agents
  public Wasp;
  public Swarm;
  public Peer;

  // Repositories
  public wasps: WaspRepository;
  public peers: PeerRepository;
  public swarms: SwarmRepository;


  public initApp(peer: PeerAgent): void {
    this.peer = peer;
  }

  public initProxies(): void {

    const waspProxy = new WaspProxy();
    const swarmProxy = new SwarmProxy();

    this.wasp = waspProxy.wasp();
    this.swarm = swarmProxy.swarm();
  }

  public initRepos(): void {

    this.peers = new PeerRepository();
    this.swarms = new SwarmRepository();
    this.wasps = new WaspRepository();

    this.Wasp = WaspAgent;
    this.Swarm = SwarmAgent;
    this.Peer = PeerAgent;
  }
}
