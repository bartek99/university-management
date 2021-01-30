package universitymanagement.core.data;

public record Grade(int gradeId, Course course,  Student student, Employee employee, String name, String description, float value) {
}
