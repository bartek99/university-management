package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.Course;
import universitymanagement.core.data.CourseRepository;
import universitymanagement.core.data.Subject;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcCourseRepository implements CourseRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcCourseRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`course`")
                .usingGeneratedKeyColumns("`course_id`");
    }

    @Override
    public List<Course> getAll() {
        String query = "SELECT * FROM `course` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`";
        return template.query(query, Mappers.COURSE_MAPPER);
    }

    @Override
    public List<Course> getBySubjectId(int subjectId) {
        String query = "SELECT * FROM `course` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`" +
                "WHERE `course`.`subject_id` = ?";
        return template.query(query, Mappers.COURSE_MAPPER, subjectId);
    }

    @Override
    public Optional<Course> getById(int courseId) {
        final var query = "SELECT * FROM `course` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` " +
                "WHERE `course`.`course_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.COURSE_MAPPER, courseId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Course> add(Subject subject, String name) {
        try {
            final var courseId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "subject_id", subject.subjectId(),
                            "name", name)))
                    .intValue();
            return Optional.of(new Course(courseId, subject, name));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(int courseId, Subject subject, String name) {
        final var query = "UPDATE `course` SET " +
                "`course`.`subject_id` = ?, " +
                "`course`.`name` = ? " +
                "WHERE `course`.`course_id` = ?";
        try {
            template.update(query, subject.subjectId(), name, courseId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(int courseId) {
        final var query = "DELETE FROM `course` WHERE `course`.`course_id` = ?";
        try {
            template.update(query, courseId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @Override
    public Optional<Course> getByGroupId(int groupId) {
        final var query = "SELECT * FROM `course` " +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` " +
                "JOIN `group` ON `course`.`course_id`= `group`.`course_id`" +
                "WHERE `group`.`group_id` = ? LIMIT 1";
        try {
            System.out.println(Optional
                    .ofNullable(template.queryForObject(query, Mappers.COURSE_MAPPER, groupId)));
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.COURSE_MAPPER, groupId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }}

    @Override
    public List<Course> getCourseByStudent(String email) {
        String query = "SELECT * FROM `course`" +
                "JOIN `group` ON `group`.`course_id` = `course`.`course_id`" +
                "JOIN `subject` ON `course`.`subject_id` = `subject`.`subject_id` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`" +
                "JOIN `student_group` ON `group`.`group_id` = `student_group`.`group_id`" +
                "JOIN `student` ON `student_group`.`student_id` = `student`.`student_id`" +
                "JOIN `user` ON `student`.`user_id`=`user`.`user_id`" +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id`" +
                "WHERE `user`.`email` = ?";
        return template.query(query,Mappers.COURSE_MAPPER, email);
    }
}
