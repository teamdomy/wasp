
<img src="http://nest.darkwasp.com/static/icons/favicon-96x96.png" alt="Dark Wasp Logo" width="96" height="96"> &nbsp; The platform for Distributed Web Apps
======================================

Build serverless apps connecting cloud, web, desktop and mobile in one shared environment, as if that was on the same computer or browser.

### Dark Wasp 2.0: Tarantula Hawk

Dark Wasp is a library and a platform for composing distributed web applications by using async sequences, it was conceived as yet another tool for parallel computing and lambda function storage. It provides 3 cores types named `agents`: `Peer`, `Wasp` and `Swarm`.

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

// peer - secret UID of the user
// app - name of YOUR app
connect({ peer: 'first', app: '#app' }); // app should be changed
```

 - `browser` for frontend use

```js
import { connect } from 'darkwasp/frontend';

// peer - secret UID of the user
// app - name of YOUR app
connect({ peer: 'first', app: '#app' }); // app should be changed
```

*The `connect` method returns the `Promise`*
*If the `app` doesn't exist, it'll be created and the `peer` will get `owner` rights*


### Using CDN

 - `browser` for frontend use:

```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>
  // peer - secret UID of the user
  // app - name of YOUR app
  darkwasp.connect({ app: 'my_app', peer: 'first_peer_uid' });
</script>
```

*The global namespace for the library is `darkwasp`*



### Starting the first app
As far as development is concerned, web distributed app is essentially a JavaScript app. 

The Dark Wasp package exports one function - `connect`, it creates the isolated scope and instantiates the core set of functionality. The`connect` function listens for an object with 2 properties: 
 1. `app` - the name of YOUR `app` and 
 2. `peer` - secret and unique `UID` of user (think about it as an username and password in one string). 
 
Primary elements of the package are `agents`. All passed parameters to the `agent` methods are cached immediately in the system and distributed between members of the `app`, therefore the first called method should be `setName` (it generates new `id` for the `agent`). All `agent` methods return the `Promise`.

Next code with app structure should be executed just once, platform will cache it.

*first.html*
```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>

async function init() {
  // peer - secret UID of the user
  // app - name of YOUR app
  const app = await darkwasp.connect({ app: '#app', peer: 'first' }); // app should be changed

  // Create the Swarm
  const firstSwarm = new app.Swarm();
  await firstSwarm.setName('firstSwarm');
  await firstSwarm.setDescription('This is the first description');

  // Create the first Wasp and add it to the Swarm
  const firstWasp = new app.Wasp();
  await firstWasp.setName('firstWasp');
  await firstWasp.set(function() { return 1 })
  await firstWasp.join('firstSwarm');

  // Create the second Wasp and add it to the Swarm
  const secondWasp = new app.Wasp();
  await secondWasp.setName('secondWasp');
  await secondWasp.set(function(amount) { return amount + 42 })
  await secondWasp.join('firstSwarm');

  // Add current Peer to the Swarm
  await app.peer.join('firstSwarm');

  // Execute Wasps in the Swarm, using members devices
  return app.swarm.firstSwarm.secondWasp(
    await app.swarm.firstSwarm.firstWasp()
  );
}

// Run the init function and log the result
init().then(result => console.log(result));

</script>
```

After `app` initiation, every member of the `app` could request `wasp` execution in the `swarm` context.

*second.html*
```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>

  // Connect the second `peer` to the `app` and request `wasp` execution in the `swarm`
  // (`swarm` will choose the first `peer` device, because he is the solo member)
  darkwasp.connect({ app: '#app', peer: 'second' }) // peer - secret UID of current user, app - name of YOUR app
    .then(app => app.swarm.firstSwarm.secondWasp(42))
    .then(result => console.log(result));

</script>
```

*third.html*
```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>

  // Connect the third `peer` to the `app` and request `wasp` execution in the `swarm`
  // (`swarm` will choose the first `peer` device, because he is the solo member)
  darkwasp.connect({ app: '#app', peer: 'third' }) // peer - secret UID of current user, app - name of YOUR app
    .then(app => app.swarm.firstSwarm.secondWasp(42))
    .then(result => console.log(result));

</script>
```

Wasp could be executed locally (parallel process):
```js
app.peer.run(app.wasp.secondWasp(42)).then(data => console.log(data));
```

Immediate function execution in local context (parallel process):
```js
// parameters are passed immediately after function expression (in our example - 42)
app.peer.run(function(data) { return data + 1 })(42)
  .then(data => console.log(data));
```

Checkout more at [darkwasp.com](https://darkwasp.com).
