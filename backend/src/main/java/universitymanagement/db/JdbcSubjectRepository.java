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
public class JdbcSubjectRepository implements SubjectRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    public JdbcSubjectRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`subject`")
                .usingGeneratedKeyColumns("`subject_id`");
    }

    @Override
    public List<Subject> getAll() {
        String query = "SELECT * FROM `subject` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id`";
        return template.query(query, Mappers.SUBJECT_MAPPER);
    }

    @Override
    public List<Subject> getByFacultyId(int facultyId) {
        String query = "SELECT * FROM `subject` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` where `subject`.`faculty_id` = ?";
        return template.query(query, Mappers.SUBJECT_MAPPER, facultyId);
    }

    @Override
    public Optional<Subject> getById(int subjectId) {
        final var query = "SELECT * FROM `subject` " +
                "JOIN `faculty` ON `subject`.`faculty_id` = `faculty`.`faculty_id` " +
                "WHERE `subject`.`subject_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.SUBJECT_MAPPER, subjectId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }



    @Override
    public Optional<Subject> add(Faculty faculty, String name) {
        try {
            final var subjectId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "faculty_id", faculty.facultyId(),
                            "name", name)))
                    .intValue();
            return Optional.of(new Subject(subjectId, faculty, name));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(int subjectId, Faculty faculty, String name) {
        final var query = "UPDATE `subject` SET " +
                "`subject`.`faculty_id` = ?, " +
                "`subject`.`name` = ? " +
                "WHERE `subject`.`subject_id` = ?";
        try {
            template.update(query, faculty.facultyId(), name, subjectId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(int subjectId) {
        final var query = "DELETE FROM `subject` WHERE `subject`.`subject_id` = ?";
        try {
            template.update(query, subjectId);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
