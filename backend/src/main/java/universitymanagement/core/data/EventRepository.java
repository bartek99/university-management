package universitymanagement.core.data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository {

    List<Event> getAllByEmployeeId(int employeeId);

    List<Event> getAllByGroupId(int groupId);

    Optional<Event> getById(int eventId);

    Optional<Event> add(
            Employee employee,
            Group group,
            Room room,
            String name,
            LocalDate date,
            LocalTime timeFrom,
            LocalTime timeTo);

    boolean updateById(
            int eventId,
            Employee employee,
            Group group,
            Room room,
            String name,
            LocalDate date,
            LocalTime timeFrom,
            LocalTime timeTo);

    boolean deleteById(int eventId);

    List<Event> getAllByDateAndTime(LocalDate date, LocalTime timeFrom, LocalTime timeTo);
}
