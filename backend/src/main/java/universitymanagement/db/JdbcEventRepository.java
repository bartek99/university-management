package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;

import javax.sql.DataSource;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcEventRepository implements EventRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    public JdbcEventRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`event`")
                .usingGeneratedKeyColumns("`event_id`");
    }

    @Override
    public List<Event> getAllByEmployeeId(int employeeId) {
        String query = "SELECT * FROM `event` " +
                "JOIN `employee` USING (`employee_id`) " +
                "JOIN `user` USING (`user_id`) " +
                "JOIN `address` USING (`address_id`) " +
                "JOIN `group` USING (`group_id`) " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "JOIN `room` USING (`room_id`) " +
                "JOIN `building` USING (`building_id`) " +
                "JOIN `address` as `building_address` ON `building`.`address_id` = `building_address`.`address_id` " +
                "WHERE `event`.`employee_id` = ?";
        return template.query(query, Mappers.EVENT_MAPPER, employeeId);
    }

    @Override
    public List<Event> getAllByGroupId(int groupId) {
        String query = "SELECT * FROM `event` " +
                "JOIN `employee` USING (`employee_id`) " +
                "JOIN `user` USING (`user_id`) " +
                "JOIN `address` USING (`address_id`) " +
                "JOIN `group` USING (`group_id`) " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "JOIN `room` USING (`room_id`) " +
                "JOIN `building` USING (`building_id`) " +
                "JOIN `address` as `building_address` ON `building`.`address_id` = `building_address`.`address_id` " +
                "WHERE `event`.`group_id` = ?";
        return template.query(query, Mappers.EVENT_MAPPER, groupId);
    }

    @Override
    public Optional<Event> getById(int eventId) {
        String query = "SELECT * FROM `event` " +
                "JOIN `employee` USING (`employee_id`) " +
                "JOIN `user` USING (`user_id`) " +
                "JOIN `address` USING (`address_id`) " +
                "JOIN `group` USING (`group_id`) " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "JOIN `room` USING (`room_id`) " +
                "JOIN `building` USING (`building_id`) " +
                "JOIN `address` as `building_address` ON `building`.`address_id` = `building_address`.`address_id` " +
                "WHERE `event`.`event_id` = ?";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.EVENT_MAPPER, eventId));
        } catch (EmptyResultDataAccessException e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public Optional<Event> add(
            Employee employee,
            Group group,
            Room room,
            String name,
            LocalDate date,
            LocalTime timeFrom,
            LocalTime timeTo) {
        try {
            final var eventId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "employee_id", employee.employeeId(),
                            "group_id", group.groupId(),
                            "room_id", room.roomId(),
                            "name", name,
                            "date", DateTimeUtils.formatDate(date),
                            "time_from", DateTimeUtils.formatTime(timeFrom) + ":00",
                            "time_to", DateTimeUtils.formatTime(timeTo) + ":00")))
                    .intValue();
            return Optional.of(new Event(
                    eventId,
                    employee,
                    group,
                    room,
                    name,
                    date,
                    timeFrom,
                    timeTo));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(
            int eventId,
            Employee employee,
            Group group,
            Room room,
            String name,
            LocalDate date,
            LocalTime timeFrom,
            LocalTime timeTo) {
        final var query = "UPDATE `event` SET " +
                "`event`.`employee_id` = ?, " +
                "`event`.`group_id` = ?, " +
                "`event`.`room_id` = ?, " +
                "`event`.`name` = ?, " +
                "`event`.`date` = ?, " +
                "`event`.`time_from` = ?, " +
                "`event`.`time_to` = ? " +
                "WHERE `event`.`event_id` = ?";
        try {
            template.update(
                    query,
                    employee.employeeId(),
                    group.groupId(),
                    room.roomId(),
                    name,
                    DateTimeUtils.formatDate(date),
                    DateTimeUtils.formatDbTime(timeFrom),
                    DateTimeUtils.formatDbTime(timeTo),
                    eventId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean deleteById(int eventId) {
        final var query = "DELETE FROM `event` WHERE `event`.`event_id` = ?";
        try {
            template.update(query, eventId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }


    @Override
    public List<Event> getAllByDateAndTime(LocalDate date, LocalTime timeFrom, LocalTime timeTo) {
        final var query = "SELECT * FROM `event` " +
                "JOIN `employee` USING (`employee_id`) " +
                "JOIN `user` USING (`user_id`) " +
                "JOIN `address` USING (`address_id`) " +
                "JOIN `group` USING (`group_id`) " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "JOIN `room` USING (`room_id`) " +
                "JOIN `building` USING (`building_id`) " +
                "JOIN `address` as `building_address` ON `building`.`address_id` = `building_address`.`address_id` " +
                "WHERE `event`.`day` = ? AND ((`event`.`time_from` <= ? AND `event`.`time_to` > ?) OR (`event`.`time_from` < ? AND `event`.`time_to` >= ?))";
        try {
            return template.query(
                    query,
                    Mappers.EVENT_MAPPER,
                    DateTimeUtils.formatDate(date),
                    DateTimeUtils.formatDbTime(timeFrom),
                    DateTimeUtils.formatDbTime(timeFrom),
                    DateTimeUtils.formatDbTime(timeTo),
                    DateTimeUtils.formatDbTime(timeTo));
        } catch (Exception e) {
            return List.of();
        }
    }
}
