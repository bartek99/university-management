package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateGroupRequest(
        @JsonProperty(value = "courseId", required = true) int courseId,
        @JsonProperty(value = "name", required = true) String name) {
}
