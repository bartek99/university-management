package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PasswordChangeRequest(
        @JsonProperty(value = "currentPassword", required = true) String currentPassword,
        @JsonProperty(value = "newPassword", required = true) String newPassword,
        @JsonProperty(value = "newPasswordConfirmation", required = true) String newPasswordConfirmation) {
}
