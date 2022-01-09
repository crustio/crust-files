import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
dayjs.extend(utc)
dayjs.extend(duration)

export const mDayjs = dayjs
export default mDayjs