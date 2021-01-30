package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Faculty;

public record FacultyResponse(
        @JsonProperty("facultyId") int facultyId,
        @JsonProperty("name") String name) {

    public static FacultyResponse fromFaculty(Faculty faculty) {
        return new FacultyResponse(
                faculty.facultyId(),
                faculty.name());
    }
}
