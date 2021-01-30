package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddAdminRequest(@JsonProperty(value = "user", required = true) AddUserRequest user) {
}
