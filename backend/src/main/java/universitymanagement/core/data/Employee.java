package universitymanagement.core.data;

import java.time.LocalDate;
import java.util.Set;

public record Employee(
        int employeeId,
        User user,
        Address address,
        String firstName,
        String lastName,
        LocalDate birthDate,
        String pesel,
        String phoneNumber,
        Set<Group> groups) {

    public String fullName() {
        return firstName + " " + lastName;
    }
}
