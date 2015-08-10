import React from 'react';
import EasyDay from '../../lib/EasyDay.js';

let EasyDayCmpnt = React.createElement(EasyDay, {
    days: 64,
    onChange: (bitmask) => {
        console.log(`bitmask: ${bitmask}`);
    }
});

React.render(EasyDayCmpnt, document.getElementById('easy-day'));