package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PasswordValidationRequest(@JsonProperty(value = "password", required = true) String password) {
}
