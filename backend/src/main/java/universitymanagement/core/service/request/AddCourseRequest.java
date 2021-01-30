package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddCourseRequest(
        @JsonProperty(value = "subjectId", required = true) int subjectId,
        @JsonProperty(value = "name", required = true) String name) {
}
