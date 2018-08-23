import { SwarmService } from '../services/swarm.service';
import { SwarmAgent } from '../agents/swarm.agent';
import { AgentRepository } from './agent.repository';

export class SwarmRepository extends AgentRepository {

  constructor(
    protected service = new SwarmService(),
    protected agent = SwarmAgent
  ) {
    super();
  }

  /**
   * Selects swarms by the peer id (many to many)
   *
   * @param id
   * @return {Promise<SwarmAgent[]>}
   */
  public getByPeer(id: string): Promise<SwarmAgent[]> {
    return this.service.findByAgent('peers', id)
      .then(result =>
        result.map(data => {
          if (data) {
            const swarmAgent = new SwarmAgent(data.id);
            return swarmAgent;
          } else {
            return null;
          }
        })
      );
  }
}
