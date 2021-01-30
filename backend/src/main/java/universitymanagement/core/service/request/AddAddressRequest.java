package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddAddressRequest(
        @JsonProperty(value = "street", required = true) String street,
        @JsonProperty(value = "houseNumber", required = true) String houseNumber,
        @JsonProperty(value = "flatNumber") String flatNumber,
        @JsonProperty(value = "postcode", required = true) String postcode,
        @JsonProperty(value = "city", required = true) String city,
        @JsonProperty(value = "country", required = true) String country) {
}
