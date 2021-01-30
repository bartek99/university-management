package universitymanagement.core.data;

import java.util.List;
import java.util.Optional;

public interface GroupRepository {

    List<Group> getAll();

    List<Group> getGroupsByStudent(String email);

    List<Group> getGroupsByEmployee(String email);

    Optional<Group> getById(int groupId);

    Optional<Group> add(Course course, String name);

    boolean updateById(int groupId, Course course, String name);

    boolean deleteById(int groupId);

    List<Group> getAllByEmployeeId(int employeeId);

    List<Group> getAllByStudentId(int studentId);

    boolean addEmployee(Group group, Employee employee);

    boolean addStudent(Group group, Student student);
}
