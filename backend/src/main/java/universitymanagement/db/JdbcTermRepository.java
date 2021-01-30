package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.Term;
import universitymanagement.core.data.TermRepository;

import javax.sql.DataSource;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcTermRepository implements TermRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    public JdbcTermRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`term`")
                .usingGeneratedKeyColumns("`term_id`");
    }

    @Override
    public List<Term> getAll() {
        String query = "SELECT * FROM `term`";
        return template.query(query, Mappers.TERM_MAPPER);
    }

    @Override
    public Optional<Term> getById(int termId) {
        final var query = "SELECT * FROM `term` WHERE `term`.`term_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.TERM_MAPPER, termId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Term> add(
            String name,
            LocalDate dateFrom,
            LocalDate dateTo) {
        try {
            final var termId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "name", name,
                            "date_from", DateTimeUtils.formatDate(dateFrom),
                            "date_to", DateTimeUtils.formatDate(dateTo))))
                    .intValue();
            return Optional.of(new Term(termId, name, dateFrom, dateTo));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean updateById(
            int termId,
            String name,
            LocalDate dateFrom,
            LocalDate dateTo) {
        final var query = "UPDATE `term` SET " +
                "`term`.`name` = ?, " +
                "`term`.`date_from` = ?, " +
                "`term`.`date_to` = ? " +
                "WHERE `term`.`term_id` = ?";
        try {
            template.update(query, name, DateTimeUtils.formatDate(dateFrom), DateTimeUtils.formatDate(dateTo), termId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(int termId) {
        final var query = "DELETE FROM `term` WHERE `term`.`term_id` = ?";
        try {
            template.update(query, termId);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
