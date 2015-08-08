//Library dependencies
const React = require('react');
const classNames = require('classnames');

//Styling
require('../../../styles/components/_EasyDay.scss');

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

module.exports = class EasyDay extends React.Component {
    constructor() {
        super();

        this.labels = [];

        this.state = {bitmask: 0}
    }

    componentDidMount() {
        //Check if min and max are out of order
        if (this.props.minSelectedDays > this.props.maxSelectedDays) {
            throw(new Error('EasyDay cannot have a minimum selected amount that is greater than its maximum selected amount.'));
        }

        //Get the correct set of labels based on the properties supplied.
        if (this.props.showLetters) {
            this.labels = EasyDay.dayLetters;
        } else if (this.props.showLongNames) {
            this.labels = EasyDay.longDayNames;
        } else {
            this.labels = EasyDay.shortDayNames;
        }

        let bitmask = 0;
        switch (typeof this.props.days) {
            case 'number':
                bitmask = this.props.days;
                break;

            case 'array':
                bitmask = this.dayArrayToBitmask();
                break;

            case 'object':
                bitmask = this.dayObjectToBitmask();
                break;
        }

        this.setState({bitmask});
    }

    isDaySet(index) {
        return (this.state.bitmask & Math.pow(2, index)) > 0
    }

    /**
     * Takes an index of a day (Sunday is 0) and toggles that byte in the bitmask. The function will reject changes if
     * it would cause the amount of selected days to fall below or surpass the minimum or maximum selected day
     * properties respectively. Additionally, if the maximum selected day property is 1, it simply switches the
     * selector to that day.
     *
     * @param index Index of day to toggle
     */
    toggleDay(index) {
        let bitmask;
        if (this.props.maxSelectedDays == 1) {
            //If only one day can be selected, switch to it automatically or toggle that day if it is clicked again.
            bitmask = Math.pow(2, index);

            if (bitmask == this.state.bitmask) bitmask = 0;

            this.setState({bitmask}, this.handleChange);
        } else {
            //Otherwise, make sure the new bitmask fits the constraint. If it does, set the new state.
            bitmask = this.state.bitmask ^= 1 << index;

            let selectedDays = EasyDay.countSetBytes(bitmask);
            if (selectedDays <= this.props.maxSelectedDays && selectedDays >= this.props.minSelectedDays) {
                this.setState({bitmask}, this.handleChange);
            }
        }
    }

    /**
     * Sends the bitmask from the state to the supplied on change function.
     */
    handleChange() {
        this.props.onChange(this.state.bitmask);
    }

    /**
     * If the days property is a object with lower case day names as keys, this function converts it into a bitmask.
     *
     * @returns {number} day bitmask
     */
    dayObjectToBitmask() {
        let bitmask = 0;

        bitmask += 1 * this.props.days.sunday;
        bitmask += 2 * this.props.days.monday;
        bitmask += 4 * this.props.days.tuesday;
        bitmask += 8 * this.props.days.wednesday;
        bitmask += 16 * this.props.days.thursday;
        bitmask += 32 * this.props.days.friday;
        bitmask += 64 * this.props.days.saturday;

        return bitmask
    }

    /**
     * If the day property is an array where index reflects day (Sunday is 0), this function converts the array values
     * to a bitmask.
     *
     * @returns {number} day bitmask
     */
    dayArrayToBitmask() {
        let bitmask = 0;
        this.props.days.map((checked, i) => {
            bitmask += checked * Math.pow(2, i);
        });

        return bitmask
    }

    render() {
        let days = EasyDay.dayLetters.map((letter, index) => {
            let checked = this.isDaySet(index) ? 'checked' : '';
            return (
                <div className='day'>
                    <div className={`inner ${checked}`} onClick={this.toggleDay.bind(this, index)}>
                        {this.labels[index]}
                    </div>
                </div>
            )
        }, this);

        let classes = classNames('easy-day', {
            light: !this.props.useDarkTheme,
            dark : this.props.useDarkTheme
        });

        return (
            <div className={classes}>
                <div className='days'>
                    {days}
                </div>
            </div>
        )
    }
};

/**
 * Returns the number of set bytes in the day bitmask.
 *
 * @param bitmask
 * @returns {number} number of active bytes
 */
EasyDay.countSetBytes = function (bitmask) {
    let setBytes = 0;

    let i = 7;
    while (i--) {
        setBytes += ((bitmask & Math.pow(2, i)) > 0) * 1;
    }

    return setBytes;
};

EasyDay.propTypes = {
    days           : React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.array,
        React.PropTypes.object
    ]),
    useDarkTheme   : React.PropTypes.bool,
    showLetters    : React.PropTypes.bool,
    showLongNames  : React.PropTypes.bool,
    showShortNames : React.PropTypes.bool,
    maxSelectedDays: React.PropTypes.number,

    //Min isn't really supported. The initial value of props.days needs to be checked.
    minSelectedDays: React.PropTypes.number,

    onChange: React.PropTypes.func
};

EasyDay.defaultProps = {
    days           : 0,
    useDarkTheme   : false,
    showLetters    : true,
    showLongNames  : false,
    showShortNames : false,
    maxSelectedDays: 7,
    minSelectedDays: 0,
    onChange       : function () {
    }
};

EasyDay.dayLetters = ["S", "M", "T", "W", "T", "F", "S"];

EasyDay.longDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

EasyDay.shortDayNames = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];
