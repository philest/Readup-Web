import 'babel-polyfill';
import 'es5-shim';

import ReactOnRails from 'react-on-rails';

import HelloWorld from './HelloWorld/startup.jsx'; // hot reloaded!


ReactOnRails.setOptions({
  traceTurbolinks: true,
});

ReactOnRails.register({
  HelloWorld,
});

// ReactOnRails.registerStore({
//   SharedReduxStore,
// });
