//Library dependencies
const React = require('react');
const classNames = require('classnames');

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

export default class EasyDay extends React.Component {
    /**
     * Get the default values for all properties.
     *
     * @type {{days: number, useDarkTheme: boolean, showLetters: boolean, showLongNames: boolean, showShortNames:
     *     boolean, maxSelectedDays: number, minSelectedDays: number, onChange: Function}}
     */
    static defaultProps = {
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

    /**
     * Describe each propType for React.
     *
     * @type {{days: *, useDarkTheme: *, showLetters: *, showLongNames: *, showShortNames: *, maxSelectedDays: *,
     *     minSelectedDays: *, onChange: *}}
     */
    static propTypes = {
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

    /**
     * The letter abbreviations for each day name.
     *
     * @type {string[]}
     */
    static dayLetters = ["S", "M", "T", "W", "T", "F", "S"];

    /**
     * The full day names.
     *
     * @type {string[]}
     */
    static longDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    /**
     * The abbreviated day names.
     *
     * @type {string[]}
     */
    static shortDayNames = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];

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
                bitmask = EasyDay.dayArrayToBitmask(this.props.days);
                break;

            case 'object':
                bitmask = EasyDay.dayObjectToBitmask(this.props.days);
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
     * Render it.
     *
     * @returns {XML}
     */
    render() {
        let days = EasyDay.dayLetters.map((letter, index) => {
            let checked = this.isDaySet(index) ? 'checked' : '';
            return (
                <div className='day' key={`${index}`}>
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

    /**
     * If the days property is a object with lower case day names as keys, this function converts it into a bitmask.
     *
     * @param {object} days
     * @returns {number} day bitmask
     */
    static dayObjectToBitmask(days = {}) {
        const defaults = {
            sunday   : 0,
            monday   : 0,
            tuesday  : 0,
            wednesday: 0,
            thursday : 0,
            friday   : 0,
            saturday : 0
        };

        //Merge the supplied object with the defaults to prevent undefined issues.
        days = {...defaults, ...days};

        let bitmask = 0;

        bitmask += 1 * days.sunday;
        bitmask += 2 * days.monday;
        bitmask += 4 * days.tuesday;
        bitmask += 8 * days.wednesday;
        bitmask += 16 * days.thursday;
        bitmask += 32 * days.friday;
        bitmask += 64 * days.saturday;

        return bitmask
    }

    /**
     * Returns the number of set bytes in the day bitmask.
     *
     * @param bitmask
     * @returns {number} number of active bytes
     */
    static countSetBytes(bitmask) {
        let setBytes = 0;

        let i = 7;
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
    static dayArrayToBitmask(days) {
        let bitmask = 0;
        days.map((checked, i) => {
            bitmask += checked * Math.pow(2, i);
        });

        return bitmask
    }
}