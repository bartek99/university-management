package universitymanagement.core.data;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface StudentRepository {

    List<Student> getAll();

    List<Student> getAllByGroupId(int groupId);

    Optional<Student> getById(int studentId);

    Optional<Student> getByUserId(int userId);

    Optional<Student> getByEmail(String email);

    Optional<Student> addStudent(
            User user,
            Address address,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            String albumNumber,
            Set<Group> groups);

    boolean updateStudentById(
            int studentId,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            String albumNumber,
            Set<Group> groups);

}
