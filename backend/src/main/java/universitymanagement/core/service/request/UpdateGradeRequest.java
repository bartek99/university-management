package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateGradeRequest(
        @JsonProperty(value = "courseId", required = true) int courseId,
        @JsonProperty(value = "studentId", required = true) int studentId,
        @JsonProperty(value = "value") Float value,
        @JsonProperty(value = "name") String name,
        @JsonProperty(value = "description") String description
        ) {
}
