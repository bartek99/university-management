package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateBuildingRequest(
        @JsonProperty(value = "address", required = true) UpdateAddressRequest address,
        @JsonProperty(value = "name", required = true) String name) {
}
