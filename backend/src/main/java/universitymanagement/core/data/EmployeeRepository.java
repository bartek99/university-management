package universitymanagement.core.data;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface EmployeeRepository {

    List<Employee> getAll();

    List<Employee> getAllByGroupId(int groupId);

    Optional<Employee> getById(int employeeId);

    Optional<Employee> getByUserId(int userId);

    Optional<Employee> getByEmail(String email);

    Optional<Employee> addEmployee(
            User user,
            Address address,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            Set<Group> groups);

    boolean updateEmployeeById(
            int employeeId,
            String firstName,
            String lastName,
            LocalDate birthDate,
            String pesel,
            String phoneNumber,
            Set<Group> groups);
}
