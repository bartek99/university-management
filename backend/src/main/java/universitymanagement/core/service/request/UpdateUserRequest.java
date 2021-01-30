package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateUserRequest(@JsonProperty("email") String email) {
}
