import { TimeslotProps } from "components/Timetable/TimeslotsLayer/Timeslot/Timeslot";
import { Interval } from "luxon";

export const useTimeslotLogic = (props: TimeslotProps) => {
    return {
        getPositionStyle() {
            let height = this.calculateTimeslotIntervalSize();
            let left   = this.calculateHorizontalOffset();
            let top    = this.calculateTopOffset();

            return {
                left,
                top,

                width: props.timetableDimensions.columnWidth - 4 + "px",
                height
            }
        },

        calculateTimeslotIntervalSize() {
            return this.calculateIntervalSize(props.timeInterval);
        },

        calculateHorizontalOffset() {
            let pivotOffset  = props.timetableDimensions.pivot.x;
            let columnOffset = props.timetableDimensions.columnWidth * props.columnIndex;
            let borderOffset = (props.columnIndex - 1) / 2;
            let marginOffset = 2;

            return pivotOffset + columnOffset + borderOffset + marginOffset;
        },

        calculateTopOffset() {
            let dayStartToTimeslotInterval = Interval.fromDateTimes(
                props.timetableInterval.start,
                props.timeInterval.start,
            );

            let pivotOffset = props.timetableDimensions.pivot.y;
            let dayStartToTimeslotIntervalSize = this.calculateIntervalSize(dayStartToTimeslotInterval);

            return pivotOffset + dayStartToTimeslotIntervalSize;
        },

        calculateIntervalSize(interval : Interval) {
            let halfHourLength = props.timetableDimensions.halfHourLength;
            let minutesInInterval = interval.length('minute');
            let borderOffset = Math.ceil(minutesInInterval / 30) / 10;

            return (halfHourLength * minutesInInterval) / 30 + borderOffset;
        }
    }
}