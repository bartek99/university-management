package universitymanagement.core.data;

import java.time.LocalDate;
import java.time.LocalTime;

public record Event(
        int eventId,
        Employee employee,
        Group group,
        Room room,
        String name,
        LocalDate date,
        LocalTime timeFrom,
        LocalTime timeTo) {
}
