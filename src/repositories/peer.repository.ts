import { PeerService } from '../services/peer.service';
import { PeerAgent } from '../agents/peer.agent';
import { AgentRepository } from './agent.repository';

export class PeerRepository extends AgentRepository {

  constructor(
    protected service = new PeerService(),
    protected agent = PeerAgent // not instantiated
  ) {
    super();
  }

  /**
   * Selects peers by swarm name (many to many)
   *
   * @param {string} name
   * @return {Promise<PeerAgent[]>}
   */
  public getBySwarm(name: string): Promise<PeerAgent[]> {
    return this.service.findByAgent('swarms', name)
      .then(result =>
        result.map(data => {
          if (data) {
            const peerAgent = new PeerAgent(data);
            return peerAgent;
          } else {
            return null;
          }
        })
      );
  }

}
