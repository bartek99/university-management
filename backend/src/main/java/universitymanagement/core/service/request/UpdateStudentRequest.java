package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateStudentRequest(
        @JsonProperty(value = "user", required = true) UpdateUserRequest user,
        @JsonProperty(value = "address", required = true) UpdateAddressRequest address,
        @JsonProperty(value = "firstName", required = true) String firstName,
        @JsonProperty(value = "lastName", required = true) String lastName,
        @JsonProperty(value = "birthDate", required = true) String birthDate,
        @JsonProperty(value = "pesel", required = true) String pesel,
        @JsonProperty(value = "phoneNumber", required = true) String phoneNumber,
        @JsonProperty(value = "albumNumber", required = true) String albumNumber) {
}

