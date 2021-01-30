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
public class JdbcGradeRepository implements GradeRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcGradeRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`grade`")
                .usingGeneratedKeyColumns("`grade_id`");
    }

    @Override
    public Optional<Grade> addGrade(Course course, Student student, Employee employee, String name, String description, float value) {
        try {
            final var gradeId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "course_id", course.courseId(),
                            "student_id", student.studentId(),
                            "employee_id", employee.employeeId(),
                            "name", name,
                            "description", description,
                            "value", value)))
                    .intValue();
            return Optional.of(new Grade(gradeId, course, student, employee, name, description, value));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Grade> getGradeById(int gradeId) {
        final var query = "SELECT * FROM `grade` " +
                "JOIN `course` ON `grade`.`course_id`=`course`.`course_id`" +
                "JOIN `subject` ON `subject`.`subject_id`=`course`.`subject_id`" +
                "JOIN `faculty` ON `faculty`.`faculty_id`=`subject`.`faculty_id`" +
                "JOIN `student` ON `student`.`student_id`=`grade`.`student_id` " +
                "JOIN `user` ON `student`.`user_id`=`user`.`user_id`" +
                "JOIN `address` ON `student`.`address_id`=`address`.`address_id`" +
                "JOIN `employee` ON `employee`.`employee_id`=`grade`.`employee_id`" +
                "WHERE `grade`.`grade_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.GRADE_MAPPER, gradeId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Grade> getGradesByStudent(String email) {
        String query = "SELECT * FROM `grade`" +
                "JOIN `course` ON `grade`.`course_id`=`course`.`course_id`" +
                "JOIN `subject` ON `subject`.`subject_id`=`course`.`subject_id`" +
                "JOIN `faculty` ON `faculty`.`faculty_id`=`subject`.`faculty_id`" +
                "JOIN `student` ON `student`.`student_id`=`grade`.`student_id` " +
                "JOIN `user` ON `student`.`user_id`=`user`.`user_id`" +
                "JOIN `address` ON `student`.`address_id`=`address`.`address_id`" +
                "JOIN `employee` ON `employee`.`employee_id`=`grade`.`employee_id`" +
                "WHERE `user`.`email` = ?";
        List<Grade> grades=template.query(query,Mappers.GRADE_MAPPER, email);
        for (int i = 0; i <grades.size() ; i++) {
            System.out.println(grades.get(i));

        }
        return template.query(query,Mappers.GRADE_MAPPER, email);
    }

    @Override
    public List<Grade> getGradesByEmployee(String email) {
        String query = "SELECT * FROM `grade`" +
                "JOIN `course` ON `grade`.`course_id`=`course`.`course_id`" +
                "JOIN `subject` ON `subject`.`subject_id`=`course`.`subject_id`" +
                "JOIN `faculty` ON `faculty`.`faculty_id`=`subject`.`faculty_id`" +
                "JOIN `student` ON `student`.`student_id`=`grade`.`student_id` " +
                "JOIN `employee` ON `employee`.`employee_id`=`grade`.`employee_id`" +
                "JOIN `user` ON `employee`.`user_id`=`user`.`user_id`" +
                "JOIN `address` ON `employee`.`address_id`=`address`.`address_id`" +
                "WHERE `user`.`email` = ?";
        List<Grade> grades=template.query(query,Mappers.GRADE_MAPPER, email);
        for (int i = 0; i <grades.size() ; i++) {
            System.out.println(grades.get(i));

        }
        return template.query(query,Mappers.GRADE_MAPPER, email);
    }

    @Override
    public boolean deleteGradeById(int gradeId) {
        final var query = "DELETE FROM `grade` WHERE `grade`.`grade_id` = ?";
        try {
            template.update(query, gradeId);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    @Override
    public boolean updateGradeById(int gradeId, Course course, Student student, Employee employee, Float value, String name, String description) {
        final var query = "UPDATE `grade` SET " +
                "`grade`.`course_id` = ?, " +
                "`grade`.`student_id` = ?, " +
                "`grade`.`employee_id` = ?, " +
                "`grade`.`value` = ?, " +
                "`grade`.`name` = ?, " +
                "`grade`.`description` = ? " +
                "WHERE `grade`.`grade_id` = ?";
        try {
            template.update(query, course.courseId(),student.studentId(), employee.employeeId(),value,name,description,gradeId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
