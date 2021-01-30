package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Subject;

public record SubjectResponse(
        @JsonProperty("subjectId") int subjectId,
        @JsonProperty("faculty") FacultyResponse faculty,
        @JsonProperty("name") String name) {

    public static SubjectResponse fromSubject(Subject subject) {
        return new SubjectResponse(
                subject.subjectId(),
                FacultyResponse.fromFaculty(subject.faculty()),
                subject.name());
    }
}
