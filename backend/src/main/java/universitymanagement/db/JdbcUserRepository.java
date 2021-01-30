package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.User;
import universitymanagement.core.data.UserRepository;
import universitymanagement.core.data.UserType;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcUserRepository implements UserRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcUserRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`user`")
                .usingGeneratedKeyColumns("`user_id`");
    }

    @Override
    public List<User> getUsers() {
        String query = "SELECT * FROM `user`";
        return template.query(query, Mappers.USER_MAPPER);
    }

    @Override
    public Optional<User> getUserById(int userId) {
        final var query = "SELECT * FROM `user` WHERE `user`.`userId` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.USER_MAPPER, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> getByEmail(String email) {
        final var query = "SELECT * FROM `user` WHERE `user`.`email` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.USER_MAPPER, email));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> addUser(UserType userType, String email, String password) {
        try {
            final var userId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "user_type", userType.value(),
                            "email", email,
                            "password", password)))
                    .intValue();
           return Optional.of(new User(userId, userType, email, password));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public Optional<Boolean> updateUserById(int userId, String email) {
        final var query = "UPDATE `user` " +
                "SET `user`.`email` = ? " +
                "WHERE `user`.`user_id` = ?";
        try {
            template.update(query, email, userId);
            return Optional.of(true);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Boolean> updatePasswordByUserId(int userId, String password) {
        final var query = "UPDATE `user` " +
                "SET `user`.`password` = ? " +
                "WHERE `user`.`user_id` = ?";
        try {
            template.update(query, password, userId);
            return Optional.of(true);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Boolean> deleteUserById(int userId) {
        final var query = "DELETE FROM `user` WHERE `user`.`user_id` = ?";
        try {
            template.update(query, userId);
            return Optional.ofNullable(true);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
