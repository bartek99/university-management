package universitymanagement.core.data;

import com.sun.el.stream.Stream;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CourseRepository {

    List<Course> getAll();

    Optional<Course> getById(int courseId);

    List<Course> getBySubjectId(int subjectId);

    Optional<Course> add(Subject subject, String name);

    boolean updateById(int courseId, Subject subject, String name);

    boolean deleteById(int courseId);

    Optional<Course> getByGroupId(int groupId);

    List<Course> getCourseByStudent(String email);
}
