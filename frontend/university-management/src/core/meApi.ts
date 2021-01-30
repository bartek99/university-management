import { requestGet } from './common';
import { mapScheduleItem, ScheduleItem } from './scheduleItemApi';

export function getMeScheduleItems(): Promise<ScheduleItem[]> {
    return requestGet(
        '/me/student/schedule-items',
        (result) => result.map(mapScheduleItem), (error) => []);
}
