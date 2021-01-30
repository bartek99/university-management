package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateFacultyRequest(
        @JsonProperty(value = "name", required = true) String name) {
}
