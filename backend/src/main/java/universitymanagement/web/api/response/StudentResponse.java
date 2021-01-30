package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Student;

public record StudentResponse(
        @JsonProperty("studentId") int studentId,
        @JsonProperty("user") UserResponse user,
        @JsonProperty("address") AddressResponse address,
        @JsonProperty("firstName") String firstName,
        @JsonProperty("lastName") String lastName,
        @JsonProperty("fullName") String fullName,
        @JsonProperty("birthDate") String birthDate,
        @JsonProperty("pesel") String pesel,
        @JsonProperty("phoneNumber") String phoneNumber,
        @JsonProperty("albumNumber") String albumNumber) {

    public static StudentResponse fromStudent(Student student) {
        return new StudentResponse(
                student.studentId(),
                UserResponse.fromUser(student.user()),
                AddressResponse.fromAddress(student.address()),
                student.firstName(),
                student.lastName(),
                student.fullName(),
                student.birthDate().toString(),
                student.pesel(),
                student.phoneNumber(),
                student.albumNumber());
    }
}
