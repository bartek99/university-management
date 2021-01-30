package universitymanagement.core.data;

import com.sun.el.stream.Stream;

import java.util.List;
import java.util.Collection;
import java.util.Optional;

public interface GradeRepository {
    Optional<Grade> addGrade(Course course, Student student, Employee employee, String name, String description, float value);

    Optional<Grade> getGradeById(int gradeId);

    List<Grade> getGradesByStudent(String email);
    List<Grade> getGradesByEmployee(String email);

    boolean deleteGradeById(int gradeId);

    boolean updateGradeById(
            int gradeId,
            Course course,
            Student student,
            Employee employee,
            Float value,
            String name,
            String description);
}
