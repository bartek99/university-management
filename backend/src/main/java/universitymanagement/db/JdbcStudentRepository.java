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
import java.util.*;

@Repository
public class JdbcStudentRepository implements StudentRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    private final GroupRepository groupRepository;

    @Autowired
    JdbcStudentRepository(DataSource dataSource, GroupRepository groupRepository) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`student`")
                .usingGeneratedKeyColumns("`student_id`");
        this.groupRepository = groupRepository;
    }

    @Override
    public List<Student> getAll() {
        final var query = "SELECT * FROM `student` " +
                "JOIN `user` ON `student`.`user_id` = `user`.`user_id` " +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id`";
        try {
            return template.query(query, Mappers.STUDENT_MAPPER);
        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public List<Student> getAllByGroupId(int groupId) {
        final var query = "SELECT * FROM `student_group` " +
                "JOIN `student` ON `student_group`.`student_id` = `student`.`student_id` " +
                "JOIN `user` ON `student`.`user_id` = `user`.`user_id` " +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id` " +
                "WHERE `student_group`.`group_id` = ?";
        try {
            return template.query(query, Mappers.STUDENT_MAPPER, groupId);
        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public Optional<Student> getById(int studentId) {
        final var query = "SELECT * FROM `student` " +
                "JOIN `user` ON `student`.`user_id` = `user`.`user_id` " +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id` " +
                "WHERE `student`.`student_id` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.STUDENT_MAPPER, studentId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Student> getByUserId(int userId) {
        final var query = "SELECT * FROM `user` " +
                "JOIN `student` ON `user`.`user_id` = `student`.`user_id` " +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id` " +
                "WHERE `user`.`user_id` = ? LIMIT 1";
        try {
            return Optional.ofNullable(template.queryForObject(query, Mappers.STUDENT_MAPPER, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Student> getByEmail(String email) {
        final var query = "SELECT * FROM `user` " +
                "JOIN `student` ON `user`.`user_id` = `student`.`user_id` " +
                "JOIN `address` ON `student`.`address_id` = `address`.`address_id` " +
                "WHERE `user`.`email` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.STUDENT_MAPPER, email))
                    .map(student -> {
                        final var groups = groupRepository.getAllByStudentId(student.studentId());
                        return new Student(
                                student.studentId(),
                                student.user(),
                                student.address(),
                                new HashSet<>(groups),
                                student.firstName(),
                                student.lastName(),
                                student.birthDate(),
                                student.pesel(),
                                student.phoneNumber(),
                                student.albumNumber());
                    });
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Student> addStudent(
            User user,
            Address address,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            String albumNumber,
            Set<Group> groups) {
        try {
            final var studentId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "user_id", user.userId(),
                            "address_id", address.addressId(),
                            "first_name", firstName,
                            "last_name", lastName,
                            "birth_date", DateTimeUtils.formatDate(birthDate),
                            "pesel", pesel,
                            "phone_number", phoneNumber,
                            "album_number", albumNumber)))
                    .intValue();

            return Optional.of(new Student(
                    studentId,
                    user,
                    address,
                    groups,
                    firstName,
                    lastName,
                    birthDate,
                    pesel,
                    phoneNumber,
                    albumNumber
            ));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public boolean updateStudentById(
            int studentId,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            String albumNumber,
            Set<Group> groups) {
        final var query = "UPDATE `student` SET " +
                "`student`.`first_name` = ?," +
                "`student`.`last_name` = ?," +
                "`student`.`birth_date` = ?," +
                "`student`.`pesel` = ?," +
                "`student`.`phone_number` = ?," +
                "`student`.`album_number` = ?" +
                "WHERE `student`.`student_id` = ?";
        try {
            template.update(
                    query,
                    firstName,
                    lastName,
                    DateTimeUtils.formatDate(birthDate),
                    pesel,
                    phoneNumber,
                    albumNumber,
                    studentId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }



}
