EasyDay
=======

A simple and light day picker component for React.

## Installation

npm install easy-day --save

## Usage

Simply import the component using your packaging system. You can listen for an onChange event by supplying an `onChange` 
property on render. This returns the current selected days as a bitmask (Sunday is index 0) to the supplied function.

Using browserify

```javascript
var EasyDay = require('easy-day');
React.render(<EasyDay 
    days={1} //Sunday selected
    onChange={function(bitmask) { console.log('bitmask equals: ' + bitmask) } }
/>);
```
Using ES6/Babel

```javascript
import EasyDay from 'easy-day'
React.render(<EasyDay 
    days={1} //Sunday selected
    onChange={(bitmask) => { console.log(`bitmask equals: ${bitmask}`) } }
/>);
```

## Tests

npm test

## Release History

* 0.1.2 Build minified distribution version and included default styling
* 0.1.1 Built distribution version with babel and react
* 0.1.0 Initial release