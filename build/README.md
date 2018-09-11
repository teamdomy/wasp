
<img src="http://nest.darkwasp.com/static/icons/favicon-96x96.png" alt="Dark Wasp Logo" width="96" height="96"> &nbsp; Distributed Storage for Functions
======================================


The Dark Wasp is a function storage, it simplifies the execution of unlimited number of functions in parallel processes (website and Node.js app on multi-core processor). The package supports web browser and Node.js clients.

*Store once, run anywhere!*

[Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)


### Install with NPM

To install prebuilt library, use npm:

```sh
npm install darkwasp
```

To import the entire core set of functionality:

*The `connect` method returns the `Promise`*

 - `node` for backend use
 
```js
const darkwasp = require('darkwasp/backend');

darkwasp.connect({ peer: 'first', app: '#app' });
```

If you are using ES6 imports or TypeScript:
```js
import { connect } from 'darkwasp/backend';

connect({ peer: 'first', app: '#app' });
```

 - `browser` for frontend use

```js
const darkwasp = require('darkwasp/frontend');

darkwasp.connect({ peer: 'first', app: '#app' });
```

If you are using ES6 imports or TypeScript:
```js
import { connect } from 'darkwasp/frontend';

connect({ peer: 'first', app: '#app' });
```

Using CDN
```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>
  darkwasp.connect({ app: '#app', peer: 'first' });
</script>
```

*The global namespace for the library is `darkwasp`*


### Starting the first app

To start the work call the `connect` function, it returns the `Promise` and listens for an object with 2 properties: 

 1. `app` - the name of your app/storage and 
 2. `peer` - secret and unique `UID` of the user (think about it as the username and the password in one string).

The package provides 3 core types named `agents`: `Peer`, `Wasp` and `Swarm`. All`agent` methods return the `Promise`.

For the purpose of the example, lets create and save 2 files with functions, we will store them lately:

*random.js*
```js
module.exports = function() {
  return (Math.random() + 10).toString(7)
}
```

*fibonacci.js*
```js
module.exports = function(num) {
  var a = 1, b = 0, temp;

  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
};
```

The next file will be our main entry point:

*index.js*
```js
const darkwasp = require('darkwasp');

const fibonacci = require('./fibonacci.js');
const random = require('./random.js');

darkwasp.connect({ app: "#app", peer: "first" })
  .then(app => 
    Promise.all([
      app.wasp.fibonacci.set(fibonacci),
      app.wasp.random.set(random)
    ])
  )
  .then(result => {
    console.log(result)
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });
```

To store the functions execute the index.js file
```sh
node index.js
```

To change functions, make required modifications and run the index.js file one more time.

Now, to use function in node.js:
```js
const darkwasp = require('darkwasp/backend');

darkwasp.connect({app: '#app', peer: 'second'})
  .then(app => 
    app.peer.random().then(result => console.log(result))
  );
```

To use function in browser:
```html
<script src="https://nest.darkwasp.com/static/v1/darkwasp.js"></script>

<script>
darkwasp.connect({app: '#app', peer: 'second'})
  .then(app =>
    app.peer.fibonacci(100).then(result => console.log(result))
  );
</script>
```

Immediately-invoked function expression (in parallel process):
```js
// parameters are passed immediately after function expression (in our example - 42)
app.peer.run(function(data) { return data + 1 })(42)
  .then(data => console.log(data));
```

Checkout more at [darkwasp.com](https://darkwasp.com).
