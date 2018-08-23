import { Main } from '../main';
const Path = require('path');
const { fork } = require('child_process');
import { SourceService } from '../services/source.service';

export { WaspAgent as Wasp } from '../agents/wasp.agent'
export { PeerAgent as Peer } from '../agents/peer.agent'

/**
 * Connection will be stored in memory for further requests
 */
const connection = {
  data: undefined,
  app: undefined,
  peer: undefined
};

/**
 * Application entry point.
 * It creates the isolated scope, authenticates the user and instantiates the Main class with the core set of functionality.
 *
 * @param { {app: string, peer: string } } auth
 * @return {Promise<Main>}
 */
export function connect(
    auth: { app: string, peer: string }
  ): Promise<Main> {

  if (
    auth.hasOwnProperty('app') &&
    auth.hasOwnProperty('peer')
  ) {

    if (
      connection.data &&
      (
        connection.app !== auth.app ||
        connection.peer !== auth.peer)
    ) {
      return Promise.reject('Peer was authenticated with another app already');
    } else if (
      connection.app !== auth.app ||
      connection.peer !== auth.peer
    ) {

      connection.data = nodeConfig()
        .then(colony => {
          const sourceService = new SourceService();
          const send = data => colony.send(data);

          return sourceService.setTarget(
            auth,
            colony,
            send
          );
        })
        .then(peer => {
          const main = new Main();
          main.initApp(peer);
          main.initRepos();

          if (typeof global['Proxy'] !== 'undefined') {
            main.initProxies();
          }

          return main;
        });

      connection.app = auth.app;
      connection.peer = auth.peer;

    }

    // on second request the same app will be returned
    return connection.data;

  } else {
    return Promise.reject('No app or peer keys passed');
  }

}

/**
 * Creates the isolated scope for external connections and wasp execution
 *
 * @return {Promise<any>}
 */
function nodeConfig(): Promise<any> {

  return new Promise((resolve, reject) => {
    const forked = fork(Path.resolve(__dirname, 'colony.back.js'));

    // // for debugging purpose
    // const forked = fork('/var/www/darkwasp/hive/build/backend/colony.back.js',
    //     [],
    //   {
    //     execArgv: ['--inspect-brk=64535']
    //   }
    // );

    resolve(forked);
  });
}
