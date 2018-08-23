import { AgentService } from '../services/agent.service';
import { AgentType, Part } from '../interfaces/query.interface';

export abstract class AgentRepository {

  protected service: AgentService;
  protected agent;

  /**
   * Returns all agents of the same type
   *
   * @return {Promise<AgentType[]>}
   */
  public getAll(): Promise<AgentType[]> {
    return this.service.findAll()
      .then(result =>
        result.map(data => {
          if (data) {
            const agent = new this.agent(data.id);
            return agent
          } else {
            return null;
          }
        })
      );
  }

  /**
   * Selects the agent by its name
   *
   * @param {string} name
   * @return {Promise<AgentType>}
   */
  public getByName(name: string): Promise<AgentType> {
    return this.service.findOneBy('name', name)
      .then(result => {
        if (result) {
          const agent = new this.agent(result.id);
          return agent;
        } else {
          return null;
        }
      });
  }

  /**
   * Selects the agent by its id
   *
   * @param {string} id
   * @return {Promise<AgentType>}
   */
  public getById(id: string): Promise<AgentType> {
    return this.service.findOneBy('id', id, Part.id)
      .then(result => {
        if (result) {
          const agent = new this.agent(result.id);
          return agent;
        } else {
          return null;
        }
      });
  }

  /**
   * Instantiates the agent and returns it
   *
   * @return {Promise<AgentType>}
   */
  public create(): Promise<AgentType> {
    return Promise.resolve(new this.agent());
  }

  /**
   * Removes the agent by its id
   *
   * @param {string} id
   * @return {Promise<boolean>}
   */
  public removeById(id: string): Promise<boolean> {
    return this.service.remove(id, this.agent.name);
  }
}
