package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddFacultyRequest(
        @JsonProperty(value = "name", required = true) String name) {
}
