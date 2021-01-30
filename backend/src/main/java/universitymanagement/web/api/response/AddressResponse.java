package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Address;

public record AddressResponse(
        @JsonProperty("addressId") int addressId,
        @JsonProperty("street") String street,
        @JsonProperty("houseNumber") String houseNumber,
        @JsonProperty("flatNumber") String flatNumber,
        @JsonProperty("postcode") String postcode,
        @JsonProperty("city") String city,
        @JsonProperty("country") String country) {

    public static AddressResponse fromAddress(Address address) {
        return new AddressResponse(
                address.addressId(),
                address.street(),
                address.houseNumber(),
                address.flatNumber(),
                address.postcode(),
                address.city(),
                address.country());
    }
}

