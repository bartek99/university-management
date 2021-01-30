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
public class JdbcScheduleItemRepository implements ScheduleItemRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcScheduleItemRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`schedule_item`")
                .usingGeneratedKeyColumns("`schedule_item_id`");
    }

    @Override
    public List<ScheduleItem> getAllByGroupId(int groupId) {
        String query = "SELECT * FROM `schedule_item` " +
                "JOIN `group` ON `schedule_item`.`group_id` = `group`.`group_id`" +
                "JOIN `course` ON `group`.`course_id` = `course`.`course_id` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` " +
                "JOIN `term` USING(`term_id`) " +
                "JOIN `room` USING(`room_id`) " +
                "JOIN `building` USING(`building_id`) " +
                "JOIN `address` USING(`address_id`) " +
                "WHERE `schedule_item`.`group_id` = ?";
        return template.query(query, Mappers.SCHEDULE_ITEM_MAPPER, groupId);
    }

    @Override
    public List<ScheduleItem> getAllByStudentId(int studentId) {
        String query = "SELECT * FROM `schedule_item` " +
                "JOIN `group` USING (`group_id`) " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "JOIN `term` USING (`term_id`) " +
                "JOIN `room` USING(`room_id`) " +
                "JOIN `building` USING(`building_id`) " +
                "JOIN `address` USING(`address_id`) " +
                "JOIN `student_group` USING (`group_id`)" +
                "JOIN `student` USING (`student_id`) " +
                "WHERE `student`.`student_id` = ?";
        return template.query(query, Mappers.SCHEDULE_ITEM_MAPPER, studentId);
    }

    @Override
    public List<ScheduleItem> getAllByDayAndTime(
            Day day,
            LocalTime timeFrom,
            LocalTime timeTo) {
        final var query = "SELECT * FROM `schedule_item` " +
                "JOIN `group` ON `schedule_item`.`group_id` = `group`.`group_id`" +
                "JOIN `course` ON `group`.`course_id` = `course`.`course_id` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` " +
                "JOIN `term` USING(`term_id`) " +
                "JOIN `room` USING(`room_id`) " +
                "JOIN `building` USING(`building_id`) " +
                "JOIN `address` USING(`address_id`) " +
                "WHERE `schedule_item`.`day` = ? AND ((`schedule_item`.`time_from` <= ? AND `schedule_item`.`time_to` > ?) OR (`schedule_item`.`time_from` < ? AND `schedule_item`.`time_to` >= ?))";
        try {
            return template.query(
                    query,
                    Mappers.SCHEDULE_ITEM_MAPPER,
                    day.value(),
                    DateTimeUtils.formatDbTime(timeFrom),
                    DateTimeUtils.formatDbTime(timeFrom),
                        DateTimeUtils.formatDbTime(timeTo),
                    DateTimeUtils.formatDbTime(timeTo));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return List.of();
        }
    }

    @Override
    public Optional<ScheduleItem> getById(int scheduleItemId) {
        String query = "SELECT * FROM `schedule_item` " +
                "JOIN `group` ON `schedule_item`.`group_id` = `group`.`group_id`" +
                "JOIN `course` ON `group`.`course_id` = `course`.`course_id` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` " +
                "JOIN `term` ON `schedule_item`.`term_id` = `term`.`term_id` " +
                "JOIN `room` USING(`room_id`) " +
                "JOIN `building` USING(`building_id`) " +
                "JOIN `address` USING(`address_id`) " +
                "WHERE `schedule_item`.`schedule_item_id` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.SCHEDULE_ITEM_MAPPER, scheduleItemId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<ScheduleItem> add(
            Term term,
            Group group,
            Room room,
            Week week,
            Day day,
            LocalTime timeFrom,
            LocalTime timeTo) {
        try {
            final var scheduleItemId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "term_id", term.termId(),
                            "group_id", group.groupId(),
                            "room_id", room.roomId(),
                            "week", week.value(),
                            "day", day.value(),
                            "time_from", DateTimeUtils.formatTime(timeFrom) + ":00",
                            "time_to", DateTimeUtils.formatTime(timeTo) + ":00")))
                    .intValue();
            return Optional.of(new ScheduleItem(scheduleItemId, term, group, room, week, day, timeFrom, timeTo));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(
            int scheduleItemId,
            Term term,
            Group group,
            Room room,
            Week week,
            Day day,
            LocalTime timeFrom,
            LocalTime timeTo) {
        final var query = "UPDATE `schedule_item` SET " +
                "`schedule_item`.`term_id` = ?, " +
                "`schedule_item`.`group_id` = ?, " +
                "`schedule_item`.`room_id` = ?, " +
                "`schedule_item`.`week` = ?, " +
                "`schedule_item`.`day` = ?, " +
                "`schedule_item`.`time_from` = ?, " +
                "`schedule_item`.`time_to` = ? " +
                "WHERE `schedule_item`.`schedule_item_id` = ?";
        try {
            template.update(
                    query,
                    term.termId(),
                    group.groupId(),
                    room.roomId(),
                    week.value(),
                    day.value(),
                    DateTimeUtils.formatTime(timeFrom) + ":00",
                    DateTimeUtils.formatTime(timeTo) + ":00",
                    scheduleItemId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(int scheduleItemId) {
        final var query = "DELETE FROM `schedule_item` WHERE `schedule_item`.`schedule_item_id` = ?";
        try {
            template.update(query, scheduleItemId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
