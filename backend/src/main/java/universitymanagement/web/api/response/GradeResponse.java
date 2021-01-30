package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Grade;
import universitymanagement.core.data.Group;

public record GradeResponse(
        @JsonProperty("gradeId") int gradeId,
        @JsonProperty("course") CourseResponse course,
        @JsonProperty("student") StudentResponse student,
//        @JsonProperty("employee") EmployeeResponse employee,
        @JsonProperty("name") String name,
        @JsonProperty("description") String description,
        @JsonProperty("value") float value) {

    public static GradeResponse fromGrade(Grade grade) {
        return new GradeResponse(
                grade.gradeId(),
                CourseResponse.fromCourse(grade.course()),
                StudentResponse.fromStudent(grade.student()),
//                EmployeeResponse.fromEmployee(grade.employee()),
                grade.name(),
                grade.description(),
                grade.value());
    }
}
