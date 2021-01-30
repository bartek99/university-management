package universitymanagement.core.data;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository {

    List<Subject> getAll();

    Optional<Subject> getById(int subjectId);

    List<Subject> getByFacultyId(int facultyId);

    Optional<Subject> add(Faculty faculty, String name);

    boolean updateById(int subjectId, Faculty faculty, String name);

    boolean deleteById(int subjectId);
}
