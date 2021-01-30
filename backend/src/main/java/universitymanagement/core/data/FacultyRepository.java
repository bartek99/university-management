package universitymanagement.core.data;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository {

    List<Faculty> getAll();

    Optional<Faculty> getById(int facultyId);

    Optional<Faculty> add(String name);

    boolean updateById(int facultyId, String name);

    boolean deleteById(int facultyId);
}
