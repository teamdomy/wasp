import { Part, Predicate } from '../interfaces/task.interface';
import { SourceService } from './source.service';
import { Actions } from '../interfaces/query.interface';

export class AgentService {

  protected agent: string;

  constructor(
    protected sourceService = new SourceService()
  ) {

  }


  /**
   * Returns all agents of the same type
   *
   * @return {Promise<any[]>}
   */
  public findAll(): Promise<any[]> {
    return this.sourceService.setQuery({
      agent: this.agent,
      action: Actions.all,
      data: {
        attribute: 'id'
      }
    });
  }

  /**
   * Returns all many to many relation by agent id or name
   *
   * @param {string}  att
   * @param {string}  val
   * @param {Part}  part
   * @return {Promise<any>}
   */
  public findByAgent(
    att: string,
    val: string,
    part: Part = Part.name
  ): Promise<any[]> {
    return this.sourceService.setQuery({
      agent: this.agent,
      action: Actions.get,
      data: {
        attribute: att,
        value: val,
        part: part
      }
    });
  }

  /**
   * Finds agent by its unique property
   *
   * @param {string} att
   * @param {string} val
   * @param {Part} part
   * @return {Promise<any>}
   */
  public findOneBy(
    att: string,
    val: string,
    part: Part = Part.name
  ): any {
    return this.sourceService.setQuery({
      agent: this.agent,
      action: Actions.one,
      data: {
        attribute: att,
        value: val,
        part: part
      }
    });
  }

  /**
   * Destroy the agent by its id
   *
   * @param {string} id
   * @param {string} agent
   * @return {Promise<any>}
   */
  public remove(id: string, agent?: string): Promise<any> {
    if (!id) {
      return this.isNotActivated();
    }
    return this.sourceService.setQuery({
      agent: agent || this.agent,
      action: Actions.del,
      data: {
        attribute: 'id',
        value: id
      }
    });
  }


  /**
   * Create many to many relation between agents (by name or id)
   *
   * @param {string} subject
   * @param {string} property
   * @param {any} value
   * @param {Part} part
   * @return {Promise<any>}
   */
  public addProperty(
    subject: string,
    property: string,
    value: any,
    part: Part = Part.id
  ): Promise<any> {
    if (!subject) {
      return this.isNotActivated();
    }
    return this.sourceService.setTask({
      agent: this.agent,
      subject: subject, // agent id
      predicate: Predicate.add,
      data: {
        attribute: property,
        part: part, // name, id of att/prop (for many to many relation with other agents)
        value: value
      }
    });
  }

  /**
   * Destroy many to many relation between agents (by name or id)
   *
   * @param {string} subject
   * @param {string} property
   * @param {string} value
   * @param {Part} part
   * @return {Promise<any>}
   */
  public delProperty(
    subject: string,
    property: string,
    value: string,
    part: Part = Part.id
  ): Promise<any> {
    if (!subject) {
      return this.isNotActivated();
    }
    return this.sourceService.setTask({
      agent: this.agent,
      subject: subject, // agent id
      predicate: Predicate.exc,
      data: {
        attribute: property,
        part: part, // name, id
        value: value
      }
    });
  }

  /**
   * Return true is agents have many to many relation established
   *
   * @param {string} subject
   * @param {string} property
   * @param {string} value
   * @param {Part} part
   * @return {Promise<any>}
   */
  public hasProperty(
    subject: string,
    property: string,
    value: string,
    part: Part = Part.id
  ): Promise<any> {
    if (!subject) {
      return this.isNotActivated();
    }
    return this.sourceService.setTask({
      agent: this.agent,
      subject: subject, // agent id
      predicate: Predicate.has,
      data: {
        attribute: property,
        part: part, // name, id
        value: value
      }
    });
  }

  /**
   * update the property of the agent
   *
   * @param {string} subject
   * @param {string} property
   * @param {string | number | boolean} value
   * @return {Promise<any>}
   */
  public setProperty(
    subject: string,
    property: string,
    value: string | number | boolean,
  ): Promise<any> {
    if (!subject && !~['name', 'uid'].indexOf(property)) {
      return this.isNotActivated();
    }
    return this.sourceService.setTask({
      agent: this.agent,
      subject: subject, // agent id
      predicate: Predicate.set,
      data: {
        attribute: property,
        value: value
      }
    });
  }

  /**
   * Retuns the property of the agent
   *
   * @param {string} subject
   * @param {string} property
   * @return {Promise<any>}
   */
  public getProperty(
    subject: string,
    property: string,
  ): Promise<any> {
    if (!subject) {
      return this.isNotActivated();
    }
    return this.sourceService.setTask({
      agent: this.agent,
      subject: subject, // agent id
      predicate: Predicate.get,
      data: {
        attribute: property
      }
    })
  }

  /**
   * Returns information about peer device
   *
   * @param {string} subject
   * @param {string} property
   * @return {Promise<any>}
   */
  public askInfo(
    subject: string,
    property: string
  ): Promise<any> {
    if (!subject) {
      return this.isNotActivated();
    }
    return this.sourceService.inform({
      agent: this.agent,
      subject: subject,
      data: {
        property: property
      }
    })
  }

  /**
   * Returns an array with instantiated agents
   *
   * @param data
   * @param Agent
   * @return {any[]}
   */
  public scatter(data, Agent): Array<any> {
    if (data && Array.isArray(data)) {
      return data.map(id => {
        const agent = new Agent(id);
        return agent;
      });
    } else {
      return data;
    }
  }

  /**
   * Returns a refuse if the agent hasn't an id
   *
   * @return {Promise<string>}
   */
  private isNotActivated(): Promise<string> {
    return Promise.reject('Agent is not activated. Set the name/uid before adding properties.');
  }

}
