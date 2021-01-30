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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcAnnouncementRepository implements AnnouncementRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    public JdbcAnnouncementRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`announcement`")
                .usingGeneratedKeyColumns("`announcement_id`");
    }

    @Override
    public List<Announcement> getAll() {
        String query = "SELECT * FROM `announcement` " +
                "JOIN `user` USING (`user_id`) " +
                "JOIN `employee` USING (`user_id`) " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "ORDER BY `announcement`.`created_at` DESC";
        return template.query(query, Mappers.ANNOUNCEMENT_MAPPER);
    }

    @Override
    public Optional<Announcement> getById(int announcementId) {
        String query = "SELECT * FROM `announcement` " +
                "JOIN `user` USING (`user_id`) " +
                "JOIN `employee` USING (`user_id`) " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "WHERE `announcement`.`announcement_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.ANNOUNCEMENT_MAPPER, announcementId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Announcement> add(Employee employee, String title, String description, String content, LocalDateTime createdAt) {
        try {
            final var announcementId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "user_id", employee.user().userId(),
                            "title", title,
                            "description", description,
                            "content", content,
                            "created_at", DateTimeUtils.formatDateTime(createdAt))))
                    .intValue();
            return Optional.of(new Announcement(announcementId, employee, title, description, content, createdAt));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public boolean deleteById(int announcementId) {
        final var query = "DELETE FROM `announcement` WHERE `announcement`.`announcement_id` = ?";
        try {
            template.update(query, announcementId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
