//Import the testing libraries
const expect = require('chai').expect;
const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

//Import and shallow render the component
const EasyDay = require('../src/EasyDay.js');
const shallowRenderer = TestUtils.createRenderer();
shallowRenderer.render(React.createElement(EasyDay, {
    days: {monday: 1, friday: 1}
}));
const easyDay = shallowRenderer.getRenderOutput();

//Run the tests
describe('EasyDay methods', function () {
    it('converts an array of days into a bitmask', function () {
        expect(EasyDay.dayArrayToBitmask([0, 1, 1, 1, 1, 1, 0])).to.equal(62);
    });
    it('converts an object of days into a bitmask', function () {
        expect(EasyDay.dayObjectToBitmask({
            monday   : true,
            friday   : true,
            sunday   : true,
            wednesday: false
        })).to.equal(35);
    });
});