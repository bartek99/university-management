package universitymanagement.core.data;

import java.time.LocalTime;

public record ScheduleItem(
        int scheduleItemId,
        Term term,
        Group group,
        Room room,
        Week week,
        Day day,
        LocalTime timeFrom,
        LocalTime timeTo) {
}
