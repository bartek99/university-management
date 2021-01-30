package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddUserRequest(
        @JsonProperty(value = "email", required = true) String email,
        @JsonProperty(value = "password", required = true) String password,
        @JsonProperty(value = "passwordConfirmation", required = true) String passwordConfirmation) {
}
