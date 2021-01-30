package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.Faculty;
import universitymanagement.core.data.FacultyRepository;
import universitymanagement.core.data.User;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcFacultyRepository implements FacultyRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    public JdbcFacultyRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`faculty`")
                .usingGeneratedKeyColumns("`faculty_id`");
    }

    @Override
    public List<Faculty> getAll() {
        String query = "SELECT * FROM `faculty`";
        return template.query(query, Mappers.FACULTY_MAPPER);
    }

    @Override
    public Optional<Faculty> getById(int facultyId) {
        final var query = "SELECT * FROM `faculty` WHERE `faculty`.`faculty_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.FACULTY_MAPPER, facultyId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Faculty> add(String name) {
        try {
            final var facultyId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "name", name)))
                    .intValue();
            return Optional.of(new Faculty(facultyId, name));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(int facultyId, String name) {
        final var query = "UPDATE `faculty` " +
                "SET `faculty`.`name` = ? " +
                "WHERE `faculty`.`faculty_id` = ?";
        try {
            template.update(query, name, facultyId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(int facultyId) {
        final var query = "DELETE FROM `faculty` WHERE `faculty`.`faculty_id` = ?";
        try {
            template.update(query, facultyId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
