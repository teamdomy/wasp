import { Main } from '../main';
import { env } from '../../environments/environment';
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
 * if 'slim' word is passed limited version of the app would be returned
 *
 * @param { {app: string, peer: string } } auth
 * @param {string} version
 * @return {Promise<Main>}
 */
export function connect(
    auth: { app: string, peer: string }, version: string
  ): Promise<Main> {

  if (
    auth.hasOwnProperty('app') &&
    auth.hasOwnProperty('peer')
  ) {

    if (
      connection.data &&
      (
        connection.app !== auth.app ||
        connection.peer !== auth.peer
      )
    ) {
      return Promise.reject('Peer was authenticated with another app already');
    } else if (
      connection.app !== auth.app ||
      connection.peer !== auth.peer
    ) {

      connection.data = browserConfig()
        .then(colony => {
          const soureService = new SourceService();
          const send = data => colony.postMessage(data, '*');

          return soureService.setTarget(
            auth,
            self,
            send
          );
        })
        .then(peer => {
          const main = new Main();
          main.initApp(peer);

          if (typeof self['Proxy'] !== 'undefined') {
            main.initProxies();
          }

          if (version !== 'slim') {
            main.initRepos();
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
 * @return {Promise<Window>}
 */
function browserConfig(): Promise<Window> {

  return new Promise((resolve, reject) => {

    const colony: any = document.createElement('iframe');
    colony.setAttribute('src', env.static + 'colony.' + env.ver + '.html');
    colony.setAttribute('type', 'text/html');
    colony.setAttribute('name', 'dark-wasp');
    colony.setAttribute('style', 'display: none;');

    colony.onload = () => {

      let frame;

      if (colony.contentWindow) {
        frame = colony.contentWindow;
      } else if (
        self.frames &&
        self.frames['dark-wasp']
      ) {
        frame = self.frames['dark-wasp'];
      }

      if (frame) {
        resolve(frame);
      } else {
        reject('Can\'t create an isolated context');
      }

    };

    colony.onerror = (event) => {
      reject(event);
    };

    document.body.appendChild(colony);

  });

}
