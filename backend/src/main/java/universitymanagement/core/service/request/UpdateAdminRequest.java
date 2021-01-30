package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateAdminRequest(@JsonProperty("user") UpdateUserRequest user) {
}

