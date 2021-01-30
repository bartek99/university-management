package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.Admin;
import universitymanagement.core.data.AdminRepository;
import universitymanagement.core.data.User;

import javax.sql.DataSource;
import java.util.Optional;

@Repository
public class JdbcAdminRepository implements AdminRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcAdminRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`admin`")
                .usingGeneratedKeyColumns("`admin_id`");
    }

    @Override
    public Optional<Admin> getAdminByUserId(int userId) {
        final var query = "SELECT * FROM `user` " +
                "JOIN `admin` ON `user`.`user_id` = `admin`.`user_id` " +
                "WHERE `user`.`user_id` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.ADMIN_MAPPER, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Admin> getAdminByEmail(String email) {
        final var adminQuery = "SELECT * FROM `user` " +
                "JOIN `admin` ON `user`.`user_id` = `admin`.`user_id` " +
                "WHERE `user`.`email` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(adminQuery, Mappers.ADMIN_MAPPER, email));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Admin> addAdmin(User user) {
        try {
            final var adminId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(
                            "user_id", user.userId()
                    ))
                    .intValue();
            return Optional.of(new Admin(adminId, user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
