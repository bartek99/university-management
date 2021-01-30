package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
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
public class JdbcCommentRepository implements CommentRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    public JdbcCommentRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`comment`")
                .usingGeneratedKeyColumns("`comment_id`");
    }

    @Override
    public List<Comment> getAllByAnnouncementId(int announcementId) {
        String query = "SELECT * FROM `comment` " +
                "JOIN `user` ON `user`.`user_id` = `comment`.`user_id` " +
                "JOIN `announcement` USING (`announcement_id`) " +
                "JOIN `employee` ON `user`.`user_id` = `user`.`user_id` " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "WHERE `announcement_id` = ?";
        return template.query(query, Mappers.COMMENT_MAPPER, announcementId);
    }

    @Override
    public Optional<Comment> add(Announcement announcement, User user, String content, LocalDateTime createdAt) {
        try {
            final var commentId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "announcement_id", announcement.announcementId(),
                            "user_id", user.userId(),
                            "content", content,
                            "createdAt", DateTimeUtils.formatDateTime(createdAt))))
                    .intValue();
            return Optional.of(new Comment(commentId, announcement, user, content, createdAt));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean deleteById(int commentId) {
        final var query = "DELETE FROM `comment` WHERE `comment`.`comment_id` = ?";
        try {
            template.update(query, commentId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
