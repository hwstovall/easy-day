EasyDay
=======

A simple and light day picker component for React.

## Installation

npm install easy-day --save

## Usage

Simply import the component using your packaging system. You can listen for an onChange event by supplying an `onChange` 
property on render. This returns the current day bitmask to the supplied function.

Using browserify

```javascript
var EasyDay = require('easy-day');
React.render(<EasyDay />);
```
Using ES6/Babel

```javascript
import EasyDay from 'easy-day'
React.render(<EasyDay />);
```

## Tests

npm test

## Release History

* 0.1.0 Initial release