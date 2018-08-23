import { WaspService } from '../services/wasp.service';
import { SwarmAgent } from './swarm.agent';
import { Part } from '../interfaces/task.interface';

// Circular reference doesn't allow extension (WaspAgent)
export class GuardAgent {

  protected id: string;
  protected params: any[];
  protected waspService: WaspService;

  constructor(id?: string) {
    if (id) {
      this.id = id
    }

    this.waspService = new WaspService()
  }


  /**
   * Returns type of the agent
   *
   * @return {string}
   */
  public getType(): string {
    return 'wasps';
  }

  /**
   * Returns wasp id
   *
   * @return {string}
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Returns true if function is pure
   *
   * @see \`{@link https://en.wikipedia.org/wiki/Pure_function }\`
   * @return {Promise<boolean>}
   */
  public isPure(): Promise<boolean> {
    return this.waspService.getProperty(this.id, 'pure')
  }

  /**
   * Marks stored function as pure (default: true)
   *
   * @see \`{@link https://en.wikipedia.org/wiki/Pure_function }\`
   * @param {boolean} pure
   * @return {Promise<boolean>}
   */
  public setPure(pure: boolean): Promise<boolean> {
    if (typeof pure === 'boolean') {
      return this.waspService.setProperty(this.id, 'pure', pure);
    } else {
      return Promise.reject('Boolean expected')
    }
  }

  /**
   * Parameters are passed to the function during execution
   *
   * @param {any[]} params
   * @return {void}
   */
  public setParams(params: any[]): void {
    if (params && Array.isArray(params)) {
      this.params = params;
    }
  }

  /**
   * Returns parameters stored locally
   *
   * @return {any[]}
   */
  public getParams(): any[] {
    return this.params;
  }

  /**
   * Set function execution timeout.
   *
   * @param {number} timeout
   * @return {Promise<boolean>}
   */
  public setTimeout(timeout: number): Promise<boolean>  {
    if (typeof timeout === 'number' && timeout > 1000) {
      return this.waspService.setProperty(this.id, 'duration', timeout)
    } else {
      return Promise.reject('Number expected')
    }
  }

  /**
   * Get function execution timeout
   *
   * @return {Promise<number>}
   */
  public getTimeout(): Promise<number> {
    return this.waspService.getProperty(this.id, 'duration')
  }

  /**
   * Set wasp name
   *
   * @param {string} name
   * @return {Promise<boolean>}
   */
  public setName(name: string): Promise<boolean> {
    if (typeof name === 'string') {
      return this.waspService.setProperty(this.id, 'name', name)
          .then(result => {
            this.id = result.id;
            return result.value;
          });
    } else {
      return Promise.reject('String with the name expected')
    }
  }

  /**
   * Get wasp name
   *
   * @return {Promise<string>}
   */
  public getName(): Promise<string> {
    return this.waspService.getProperty(this.id, 'name');
  }

  /**
   * Returns the list of wasp swarms
   *
   * @return {Promise<SwarmAgent[]>}
   */
  public list(): Promise<SwarmAgent[]> {
    return this.waspService.getSwarms(this.id);
  }

  /**
   * Join swarm (by swarm name)
   *
   * @param {string} name
   * @return {Promise<boolean>}
   */
  public join(name: string): Promise<boolean> {
    if (typeof name === 'string') {
      return this.waspService.addProperty(this.id, 'swarms', name, Part.name);
    } else {
      return Promise.reject('String with the swarm name expected')
    }
  }

  /**
   * Leave swarm (by swarm name)
   *
   * @param {string} name
   * @return {Promise<boolean>}
   */
  public leave(name: string): Promise<boolean> {
    if (typeof name === 'string') {
      return this.waspService.delProperty(this.id, 'swarms', name, Part.name);
    } else {
      return Promise.reject('String with the swarm name expected')
    }
  }

  /**
   * Add function to the wasp shell
   *
   * @param {Function} func
   * @return {Promise<boolean>}
   */
  public set(func: Function): Promise<boolean> {
    if (typeof func === 'function') {
      return this.waspService.setProperty(this.id, 'content', func.toString())
    } else {
      return Promise.reject('Function expected');
    }
  }

  /**
   * Extract function from the shell
   *
   * @return {Promise<string>}
   */
  public get(): Promise<string> {
    return this.waspService.getProperty(this.id, 'content');
  }

  /**
   * Destroy the wasp
   *
   * @return {Promise<boolean>}
   */
  public remove(): Promise<boolean> {
    return this.waspService.remove(this.id);
  }
}
