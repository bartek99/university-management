package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddStudentRequest(
        @JsonProperty(value = "user", required = true) AddUserRequest user,
        @JsonProperty(value = "address", required = true) AddAddressRequest address,
        @JsonProperty(value = "firstName", required = true) String firstName,
        @JsonProperty(value = "lastName", required = true) String lastName,
        @JsonProperty(value = "birthDate", required = true) String birthDate,
        @JsonProperty(value = "pesel", required = true) String pesel,
        @JsonProperty(value = "phoneNumber", required = true) String phoneNumber,
        @JsonProperty(value = "albumNumber", required = true) String albumNumber) {
}
