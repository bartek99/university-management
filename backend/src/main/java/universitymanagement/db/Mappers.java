package universitymanagement.db;

import org.springframework.jdbc.core.RowMapper;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;

import java.util.Set;

final class Mappers {

    static final RowMapper<Address> ADDRESS_MAPPER = (rs, rowNum) -> new Address(
            rs.getInt("address_id"),
            rs.getString("street"),
            rs.getString("house_number"),
            rs.getString("flat_number"),
            rs.getString("postcode"),
            rs.getString("city"),
            rs.getString("country"));

    static final RowMapper<User> USER_MAPPER = (rs, rowNum) -> new User(
            rs.getInt("user_id"),
            UserType.from(rs.getString("user_type")).get(),
            rs.getString("email"),
            rs.getString("password"));

    static final RowMapper<Admin> ADMIN_MAPPER = (rs, rowNum) -> new Admin(
            rs.getInt("admin_id"),
            USER_MAPPER.mapRow(rs, rowNum));

    static final RowMapper<Employee> EMPLOYEE_MAPPER = (rs, rowNum) -> new Employee(
            rs.getInt("employee_id"),
            USER_MAPPER.mapRow(rs, rowNum),
            ADDRESS_MAPPER.mapRow(rs, rowNum),
            rs.getString("first_name"),
            rs.getString("last_name"),
            DateTimeUtils.parseDate(rs.getString("birth_date")),
            rs.getString("pesel"),
            rs.getString("phone_number"),
            Set.of());

    static final RowMapper<Student> STUDENT_MAPPER = (rs, rowNum) -> new Student(
            rs.getInt("student_id"),
            USER_MAPPER.mapRow(rs, rowNum),
            ADDRESS_MAPPER.mapRow(rs, rowNum),
            Set.of(),
            rs.getString("first_name"),
            rs.getString("last_name"),
            DateTimeUtils.parseDate(rs.getString("birth_date")),
            rs.getString("pesel"),
            rs.getString("phone_number"),
            rs.getString("album_number"));

    static final RowMapper<Faculty> FACULTY_MAPPER = (rs, rowNum) -> new Faculty(
            rs.getInt("faculty_id"),
            rs.getString("faculty.name")
    );

    static final RowMapper<Subject> SUBJECT_MAPPER = (rs, rowNum) -> new Subject(
            rs.getInt("subject_id"),
            FACULTY_MAPPER.mapRow(rs, rowNum),
            rs.getString("subject.name")
    );

    static final RowMapper<Course> COURSE_MAPPER = (rs, rowNum) -> new Course(
            rs.getInt("course_id"),
            SUBJECT_MAPPER.mapRow(rs, rowNum),
            rs.getString("course.name")
    );

    static final RowMapper<Group> GROUP_MAPPER = (rs, rowNum) -> new Group(
            rs.getInt("group_id"),
            COURSE_MAPPER.mapRow(rs, rowNum),
            rs.getString("group.name")
    );

    static final RowMapper<Term> TERM_MAPPER = (rs, rowNum) -> new Term(
            rs.getInt("term_id"),
            rs.getString("term.name"),
            DateTimeUtils.parseDate(rs.getString("date_from")),
            DateTimeUtils.parseDate(rs.getString("date_to"))
    );

    static final RowMapper<Building> BUILDING_MAPPER = (rs, rowNum) -> new Building(
            rs.getInt("building_id"),
            ADDRESS_MAPPER.mapRow(rs, rowNum),
            rs.getString("building.name"));

    static final RowMapper<Room> ROOM_MAPPER = (rs, rowNum) -> new Room(
            rs.getInt("room_id"),
            BUILDING_MAPPER.mapRow(rs, rowNum),
            rs.getString("number"));

    static final RowMapper<ScheduleItem> SCHEDULE_ITEM_MAPPER = (rs, rowNum) -> new ScheduleItem(
            rs.getInt("schedule_item_id"),
            TERM_MAPPER.mapRow(rs, rowNum),
            GROUP_MAPPER.mapRow(rs, rowNum),
            ROOM_MAPPER.mapRow(rs, rowNum),
            Week.from(rs.getString("week")).get(),
            Day.from(rs.getString("day")).get(),
            rs.getTime("time_from").toLocalTime(),
            rs.getTime("time_to").toLocalTime()
    );

    static final RowMapper<Announcement> ANNOUNCEMENT_MAPPER = (rs, rowNum) -> new Announcement(
            rs.getInt("announcement_id"),
            EMPLOYEE_MAPPER.mapRow(rs, rowNum),
            rs.getString("title"),
            rs.getString("description"),
            rs.getString("content"),
            rs.getTimestamp("created_at").toLocalDateTime()
    );

    static final RowMapper<Comment> COMMENT_MAPPER = (rs, rowNum) -> new Comment(
            rs.getInt("comment_id"),
            ANNOUNCEMENT_MAPPER.mapRow(rs, rowNum),
            USER_MAPPER.mapRow(rs, rowNum),
            rs.getString("content"),
            rs.getTimestamp("created_at").toLocalDateTime()
    );

    static final RowMapper<Grade> GRADE_MAPPER = (rs, rowNum) -> new Grade(
            rs.getInt("grade_id"),
            COURSE_MAPPER.mapRow(rs,rowNum),
            STUDENT_MAPPER.mapRow(rs,rowNum),
            EMPLOYEE_MAPPER.mapRow(rs,rowNum),
            rs.getString("name"),
            rs.getString("description"),
            rs.getFloat("value"));

    static final RowMapper<Event> EVENT_MAPPER = (rs, rowNum) -> new Event(
            rs.getInt("event_id"),
            EMPLOYEE_MAPPER.mapRow(rs, rowNum),
            GROUP_MAPPER.mapRow(rs, rowNum),
            new Room(
                    rs.getInt("room_id"),
                    new Building(
                            rs.getInt("building_id"),
                            new Address(
                                    rs.getInt("building_address.address_id"),
                                    rs.getString("building_address.street"),
                                    rs.getString("building_address.house_number"),
                                    rs.getString("building_address.flat_number"),
                                    rs.getString("building_address.postcode"),
                                    rs.getString("building_address.city"),
                                    rs.getString("building_address.country")),
                            rs.getString("building.name")
                    ),
                    rs.getString("number")
            ),
            rs.getString("name"),
            rs.getDate("date").toLocalDate(),
            rs.getTime("time_from").toLocalTime(),
            rs.getTime("time_to").toLocalTime()
    );

    private Mappers() {
    }
}
