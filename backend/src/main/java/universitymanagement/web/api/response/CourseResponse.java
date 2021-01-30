package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Course;

public record CourseResponse(
        @JsonProperty("courseId") int courseId,
        @JsonProperty("subject") SubjectResponse subject,
        @JsonProperty("name") String name) {

    public static CourseResponse fromCourse(Course course) {
        return new CourseResponse(
                course.courseId(),
                SubjectResponse.fromSubject(course.subject()),
                course.name());
    }
}
