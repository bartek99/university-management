package universitymanagement.core.data;

import java.time.LocalDate;
import java.util.Set;

public record Student(
        int studentId,
        User user,
        Address address,
        Set<Group> groups,
        String firstName,
        String lastName,
        LocalDate birthDate,
        String pesel,
        String phoneNumber,
        String albumNumber) {

    public String fullName() {
        return firstName + " " + lastName;
    }
}
