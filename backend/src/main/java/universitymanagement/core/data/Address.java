package universitymanagement.core.data;

public record Address(
        int addressId,
        String street,
        String houseNumber,
        String flatNumber,
        String postcode,
        String city,
        String country) {
}
