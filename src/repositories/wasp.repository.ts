import { WaspService } from '../services/wasp.service';
import { WaspAgent } from '../agents/wasp.agent';
import { AgentRepository } from './agent.repository';

export class WaspRepository extends AgentRepository {

  constructor(
    protected service = new WaspService(),
    protected agent = WaspAgent
  ) {
    super();
  }

  /**
   * Returns wasps selected by swarm name (many to many)
   *
   * @param {string} name
   * @return {Promise<WaspAgent[]> }
   */
  public getBySwarm(name: string): Promise<WaspAgent[] | null> {
    return this.service.findByAgent('swarms', name)
      .then(result => {
        if (result) {
          return result.map(data => {
            if (data) {
              const waspAgent = new WaspAgent(data);
              return waspAgent;
            }
          });
        } else {
          return null;
        }
      });
  }
}
