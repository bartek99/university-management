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
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Repository
public class JdbcEmployeeRepository implements EmployeeRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcEmployeeRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`employee`")
                .usingGeneratedKeyColumns("`employee_id`");
    }

    @Override
    public List<Employee> getAll() {
        final var query = "SELECT * FROM `employee` " +
                "JOIN `user` ON `employee`.`user_id` = `user`.`user_id` " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id`";
        try {
            return template.query(query, Mappers.EMPLOYEE_MAPPER);
        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public List<Employee> getAllByGroupId(int groupId) {
        final var query = "SELECT * FROM `employee_group` " +
                "JOIN `employee` ON `employee_group`.`employee_id` = `employee`.`employee_id` " +
                "JOIN `user` ON `employee`.`user_id` = `user`.`user_id` " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "WHERE `employee_group`.`group_id` = ?";
        try {
            return template.query(query, Mappers.EMPLOYEE_MAPPER, groupId);
        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public Optional<Employee> getById(int employeeId) {
        final var query = "SELECT * FROM `employee` " +
                "JOIN `user` ON `user`.`user_id` = `employee`.`user_id` " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "WHERE `employee`.`employee_id` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.EMPLOYEE_MAPPER, employeeId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Employee> getByUserId(int userId) {
        final var query = "SELECT * FROM `user` " +
                "JOIN `employee` ON `user`.`user_id` = `employee`.`user_id` " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "WHERE `user`.`user_id` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.EMPLOYEE_MAPPER, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Employee> getByEmail(String email) {
        final var query = "SELECT * FROM `user` " +
                "JOIN `employee` ON `user`.`user_id` = `employee`.`user_id` " +
                "JOIN `address` ON `employee`.`address_id` = `address`.`address_id` " +
                "WHERE `user`.`email` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.EMPLOYEE_MAPPER, email));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Employee> addEmployee(
            User user,
            Address address,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            Set<Group> groups) {
        try {
            final var employeeId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "user_id", user.userId(),
                            "address_id", address.addressId(),
                            "first_name", firstName,
                            "last_name", lastName,
                            "birth_date", DateTimeUtils.formatDate(birthDate),
                            "pesel", pesel,
                            "phone_number", phoneNumber)))
                    .intValue();
            return Optional.of(new Employee(
                    employeeId,
                    user,
                    address,
                    firstName,
                    lastName,
                    birthDate,
                    pesel,
                    phoneNumber,
                    groups
            ));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public boolean updateEmployeeById(
            int employeeId,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            Set<Group> groups) {
        final var query = "UPDATE `employee` SET " +
                "`employee`.`first_name` = ?," +
                "`employee`.`last_name` = ?," +
                "`employee`.`birth_date` = ?," +
                "`employee`.`pesel` = ?," +
                "`employee`.`phone_number` = ?" +
                "WHERE `employee`.`employee_id` = ?";
        try {
            template.update(
                    query,
                    firstName,
                    lastName,
                    DateTimeUtils.formatDate(birthDate),
                    pesel,
                    phoneNumber,
                    employeeId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
