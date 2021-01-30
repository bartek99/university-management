package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateSubjectRequest(
        @JsonProperty(value = "facultyId", required = true) int facultyId,
        @JsonProperty(value = "name") String name) {
}
