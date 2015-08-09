//Library dependencies
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var classNames = require('classnames');

//Styling
//require('../../../styles/components/_EasyDay.scss');

/**
 *                                    _
 *                                   | |
 *      ___  __ _ ___ _   _ ______ __| | __ _ _   _
 *     / _ \/ _` / __| | | |______/ _` |/ _` | | | |
 *    |  __/ (_| \__ \ |_| |     | (_| | (_| | |_| |
 *     \___|\__,_|___/\__, |      \__,_|\__,_|\__, |
 *                     __/ |                   __/ |
 *                    |___/                   |___/
 *
 *      - by Harrison Stovall
 *
 * EasyDay isa simple react component for selecting days of week and returning a bitmask.
 *
 */

var EasyDay = (function (_React$Component) {
    _inherits(EasyDay, _React$Component);

    _createClass(EasyDay, null, [{
        key: 'defaultProps',

        /**
         * Get the default values for all properties.
         *
         * @type {{days: number, useDarkTheme: boolean, showLetters: boolean, showLongNames: boolean, showShortNames:
         *     boolean, maxSelectedDays: number, minSelectedDays: number, onChange: Function}}
         */
        value: {
            days: 0,
            useDarkTheme: false,
            showLetters: true,
            showLongNames: false,
            showShortNames: false,
            maxSelectedDays: 7,
            minSelectedDays: 0,
            onChange: function onChange() {}
        },

        /**
         * Describe each propType for React.
         *
         * @type {{days: *, useDarkTheme: *, showLetters: *, showLongNames: *, showShortNames: *, maxSelectedDays: *,
         *     minSelectedDays: *, onChange: *}}
         */
        enumerable: true
    }, {
        key: 'propTypes',
        value: {
            days: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.object]),
            useDarkTheme: React.PropTypes.bool,
            showLetters: React.PropTypes.bool,
            showLongNames: React.PropTypes.bool,
            showShortNames: React.PropTypes.bool,
            maxSelectedDays: React.PropTypes.number,

            //Min isn't really supported. The initial value of props.days needs to be checked.
            minSelectedDays: React.PropTypes.number,

            onChange: React.PropTypes.func
        },

        /**
         * The letter abbreviations for each day name.
         *
         * @type {string[]}
         */
        enumerable: true
    }, {
        key: 'dayLetters',
        value: ["S", "M", "T", "W", "T", "F", "S"],

        /**
         * The full day names.
         *
         * @type {string[]}
         */
        enumerable: true
    }, {
        key: 'longDayNames',
        value: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

        /**
         * The abbreviated day names.
         *
         * @type {string[]}
         */
        enumerable: true
    }, {
        key: 'shortDayNames',
        value: ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."],
        enumerable: true
    }]);

    function EasyDay() {
        _classCallCheck(this, EasyDay);

        _get(Object.getPrototypeOf(EasyDay.prototype), 'constructor', this).call(this);

        this.labels = [];

        this.state = { bitmask: 0 };
    }

    _createClass(EasyDay, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            //Check if min and max are out of order
            if (this.props.minSelectedDays > this.props.maxSelectedDays) {
                throw new Error('EasyDay cannot have a minimum selected amount that is greater than its maximum selected amount.');
            }

            //Get the correct set of labels based on the properties supplied.
            if (this.props.showLetters) {
                this.labels = EasyDay.dayLetters;
            } else if (this.props.showLongNames) {
                this.labels = EasyDay.longDayNames;
            } else {
                this.labels = EasyDay.shortDayNames;
            }

            var bitmask = 0;
            switch (typeof this.props.days) {
                case 'number':
                    bitmask = this.props.days;
                    break;

                case 'array':
                    bitmask = EasyDay.dayArrayToBitmask(this.props.days);
                    break;

                case 'object':
                    bitmask = EasyDay.dayObjectToBitmask(this.props.days);
                    break;
            }

            this.setState({ bitmask: bitmask });
        }
    }, {
        key: 'isDaySet',
        value: function isDaySet(index) {
            return (this.state.bitmask & Math.pow(2, index)) > 0;
        }

        /**
         * Takes an index of a day (Sunday is 0) and toggles that byte in the bitmask. The function will reject changes if
         * it would cause the amount of selected days to fall below or surpass the minimum or maximum selected day
         * properties respectively. Additionally, if the maximum selected day property is 1, it simply switches the
         * selector to that day.
         *
         * @param index Index of day to toggle
         */
    }, {
        key: 'toggleDay',
        value: function toggleDay(index) {
            var bitmask = undefined;
            if (this.props.maxSelectedDays == 1) {
                //If only one day can be selected, switch to it automatically or toggle that day if it is clicked again.
                bitmask = Math.pow(2, index);

                if (bitmask == this.state.bitmask) bitmask = 0;

                this.setState({ bitmask: bitmask }, this.handleChange);
            } else {
                //Otherwise, make sure the new bitmask fits the constraint. If it does, set the new state.
                bitmask = this.state.bitmask ^= 1 << index;

                var selectedDays = EasyDay.countSetBytes(bitmask);
                if (selectedDays <= this.props.maxSelectedDays && selectedDays >= this.props.minSelectedDays) {
                    this.setState({ bitmask: bitmask }, this.handleChange);
                }
            }
        }

        /**
         * Sends the bitmask from the state to the supplied on change function.
         */
    }, {
        key: 'handleChange',
        value: function handleChange() {
            this.props.onChange(this.state.bitmask);
        }

        /**
         * Render it.
         *
         * @returns {XML}
         */
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var days = EasyDay.dayLetters.map(function (letter, index) {
                var checked = _this.isDaySet(index) ? 'checked' : '';
                return React.createElement(
                    'div',
                    { className: 'day', key: '' + index },
                    React.createElement(
                        'div',
                        { className: 'inner ' + checked, onClick: _this.toggleDay.bind(_this, index) },
                        _this.labels[index]
                    )
                );
            }, this);

            var classes = classNames('easy-day', {
                light: !this.props.useDarkTheme,
                dark: this.props.useDarkTheme
            });

            return React.createElement(
                'div',
                { className: classes },
                React.createElement(
                    'div',
                    { className: 'days' },
                    days
                )
            );
        }

        /**
         * If the days property is a object with lower case day names as keys, this function converts it into a bitmask.
         *
         * @param {object} days
         * @returns {number} day bitmask
         */
    }], [{
        key: 'dayObjectToBitmask',
        value: function dayObjectToBitmask() {
            var days = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var defaults = {
                sunday: 0,
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0
            };

            //Merge the supplied object with the defaults to prevent undefined issues.
            days = _extends({}, defaults, days);

            var bitmask = 0;

            bitmask += 1 * days.sunday;
            bitmask += 2 * days.monday;
            bitmask += 4 * days.tuesday;
            bitmask += 8 * days.wednesday;
            bitmask += 16 * days.thursday;
            bitmask += 32 * days.friday;
            bitmask += 64 * days.saturday;

            return bitmask;
        }

        /**
         * Returns the number of set bytes in the day bitmask.
         *
         * @param bitmask
         * @returns {number} number of active bytes
         */
    }, {
        key: 'countSetBytes',
        value: function countSetBytes(bitmask) {
            var setBytes = 0;

            var i = 7;
            while (i--) {
                setBytes += ((bitmask & Math.pow(2, i)) > 0) * 1;
            }

            return setBytes;
        }

        /**
         * If the day property is an array where index reflects day (Sunday is 0), this function converts the array values
         * to a bitmask.
         *
         * @returns {number} day bitmask
         */
    }, {
        key: 'dayArrayToBitmask',
        value: function dayArrayToBitmask(days) {
            var bitmask = 0;
            days.map(function (checked, i) {
                bitmask += checked * Math.pow(2, i);
            });

            return bitmask;
        }
    }]);

    return EasyDay;
})(React.Component);

exports['default'] = EasyDay;
module.exports = exports['default'];