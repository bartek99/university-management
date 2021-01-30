package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddGradeRequest(
        @JsonProperty(value = "courseId", required = true) int courseId,
        @JsonProperty(value = "studentId", required = true) int studentId,
        @JsonProperty(value = "name", required = true) String name,
        @JsonProperty(value = "description", required = true) String description,
        @JsonProperty(value = "value", required = true) float value) {
}
