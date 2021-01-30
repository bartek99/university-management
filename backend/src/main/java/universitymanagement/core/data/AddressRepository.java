package universitymanagement.core.data;

import org.springframework.lang.Nullable;

import java.util.Optional;

public interface AddressRepository {

    Optional<Address> addAddress(
            String street,
            String houseNumber,
            @Nullable String flatNumber,
            String postcode,
            String city,
            String country);

    Optional<Boolean> updateAddressById(
            int addressId,
            String street,
            String houseNumber,
            @Nullable String flatNumber,
            String postcode,
            String city,
            String country);
}
