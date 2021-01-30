package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.*;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcGroupRepository implements GroupRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;
    private final SimpleJdbcInsert employeeInsert;
    private final SimpleJdbcInsert studentInsert;

    @Autowired
    JdbcGroupRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`group`")
                .usingGeneratedKeyColumns("`group_id`");
        this.employeeInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`employee_group`");
        this.studentInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`student_group`");
    }

    @Override
    public List<Group> getAll() {
        String query = "SELECT * FROM `group` " +
                "JOIN `course` ON `group`.`course_id` = `course`.`course_id` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`";
        return template.query(query, Mappers.GROUP_MAPPER);
    }

    @Override
    public List<Group> getGroupsByStudent(String email) {
        String query = "SELECT * FROM `group`" +
                "JOIN `course` ON `group`.`course_id` = `course`.`course_id`" +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`" +
                "JOIN `student_group` ON `group`.`group_id` = `student_group`.`group_id`" +
                "JOIN `student` ON `student_group`.`student_id` = `student`.`student_id`" +
                "JOIN `user` ON `student`.`user_id`=`user`.`user_id`" +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id`" +
                "WHERE `user`.`email` = ?";
        return template.query(query,Mappers.GROUP_MAPPER, email);
    }


    @Override
    public List<Group> getGroupsByEmployee(String email) {
        String query = "SELECT * FROM `group`" +
                "JOIN `course` ON `group`.`course_id` = `course`.`course_id`" +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`" +
                "JOIN `employee_group` ON `group`.`group_id` = `employee_group`.`group_id`" +
                "JOIN `employee` ON `employee_group`.`employee_id` = `employee`.`employee_id`" +
                "JOIN `user` ON `employee`.`user_id`=`user`.`user_id`" +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id`" +
                "WHERE `user`.`email` = ?";
        return template.query(query,Mappers.GROUP_MAPPER, email);
    }

    @Override
    public Optional<Group> getById(int groupId) {
        final var query = "SELECT * FROM `group` " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "WHERE `group`.`group_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.GROUP_MAPPER, groupId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Group> add(Course course, String name) {
        try {
            final var groupId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "course_id", course.courseId(),
                            "name", name)))
                    .intValue();
            return Optional.of(new Group(groupId, course, name));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(int groupId, Course course, String name) {
        final var query = "UPDATE `group` SET " +
                "`group`.`course_id` = ?, " +
                "`group`.`name` = ? " +
                "WHERE `group`.`group_id` = ?";
        try {
            template.update(query, course.courseId(), name, groupId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(int groupId) {
        final var query = "DELETE FROM `group` WHERE `group`.`group_id` = ?";
        try {
            template.update(query, groupId);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    @Override
    public List<Group> getAllByEmployeeId(int employeeId) {
        String query = "SELECT * FROM `employee_group` " +
                "JOIN `group` ON `employee_group`.`group_id` = `group`.`group_id` " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "WHERE `employee_group`.`employee_id` = ? ";
        return template.query(query, Mappers.GROUP_MAPPER, employeeId);
    }

    @Override
    public List<Group> getAllByStudentId(int studentId) {
        String query = "SELECT * FROM `student_group` " +
                "JOIN `group` ON `student_group`.`group_id` = `group`.`group_id` " +
                "JOIN `course` USING (`course_id`) " +
                "JOIN `subject` USING (`subject_id`) " +
                "JOIN `faculty` USING (`faculty_id`) " +
                "WHERE `student_group`.`student_id` = ? ";
        return template.query(query, Mappers.GROUP_MAPPER, studentId);
    }

    @Override
    public boolean addEmployee(Group group, Employee employee) {
        try {
            employeeInsert.execute(new MapSqlParameterSource(Map.of(
                    "group_id", group.groupId(),
                    "employee_id", employee.employeeId())));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean addStudent(Group group, Student student) {
        try {
            studentInsert.execute(new MapSqlParameterSource(Map.of(
                            "group_id", group.groupId(),
                            "student_id", student.studentId())));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
