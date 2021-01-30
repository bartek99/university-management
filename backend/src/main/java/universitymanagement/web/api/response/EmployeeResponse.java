package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Employee;

public record EmployeeResponse(
        @JsonProperty("employeeId") int employeeId,
        @JsonProperty("user") UserResponse user,
        @JsonProperty("address") AddressResponse address,
        @JsonProperty("firstName") String firstName,
        @JsonProperty("lastName") String lastName,
        @JsonProperty("fullName") String fullName,
        @JsonProperty("birthDate") String birthDate,
        @JsonProperty("pesel") String pesel,
        @JsonProperty("phoneNumber") String phoneNumber) {

    public static EmployeeResponse fromEmployee(Employee employee) {
        return new EmployeeResponse(
                employee.employeeId(),
                UserResponse.fromUser(employee.user()),
                AddressResponse.fromAddress(employee.address()),
                employee.firstName(),
                employee.lastName(),
                employee.fullName(),
                employee.birthDate().toString(),
                employee.pesel(),
                employee.phoneNumber());
    }
}
