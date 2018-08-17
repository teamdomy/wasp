


<img src="http://nest.darkwasp.com/static/icons/favicon-96x96.png" alt="Dark Wasp Logo" width="96" height="96"> &nbsp; The platform for Distributed Web Apps
======================================

Build serverless apps connecting cloud, web, desktop and mobile in one shared environment, as if that was on the same computer or browser.

### Dark Wasp 2.0: Tarantula Hawk

Dark Wasp is a library and a platform for composing distributed web applications by using observable sequences, it was conceived as yet another tool for parallel computing and lambda function storage. It provides 3 cores types named `agents`: `Peer`, `Wasp` and `Swarm`.

*Dark Wasp was tested on Chrome, Firefox, Safari, Edge and IE 11*

[Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)


### Install with NPM

To install prebuilt library, use npm. The preferred method is to install `darkwasp` as a production dependency in your app:

```sh
npm install darkwasp
```

To import the entire core set of functionality:

 - `node` for backend use

```js
import { connect } from 'darkwasp/backend';

connect({ peer: 'first', app: '#app' });
```

 - `browser` for frontend use

```js
import { connect } from 'darkwasp/frontend';

connect({ peer: 'first', app: '#app' });
```

*The `connect` method returns `Promise`*  
*If the `app` doesn't exist, it'll be created and `peer` will get `owner`'s rights*  


### Using CDN

 - `browser` for frontend use:

```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>
  darkwasp.connect({ app: 'my_app', peer: 'first_peer_uid' }); // 'browser' word was omitted
</script>
```

*The global namespace for the library is `darkwasp`*  


Checkout more at [darkwasp.com](https://darkwasp.com)
