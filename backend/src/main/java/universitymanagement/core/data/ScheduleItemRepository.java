package universitymanagement.core.data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleItemRepository {

    List<ScheduleItem> getAllByGroupId(int groupId);

    List<ScheduleItem> getAllByStudentId(int studentId);

    List<ScheduleItem> getAllByDayAndTime(Day day, LocalTime timeFrom, LocalTime timeTo);

    Optional<ScheduleItem> getById(int scheduleItemId);

    Optional<ScheduleItem> add(
            Term term,
            Group group,
            Room room,
            Week week,
            Day day,
            LocalTime timeFrom,
            LocalTime timeTo);

    boolean updateById(
            int scheduleItemId,
            Term term,
            Group group,
            Room room,
            Week week,
            Day day,
            LocalTime timeFrom,
            LocalTime timeTo);

    boolean deleteById(int scheduleItemId);
}
