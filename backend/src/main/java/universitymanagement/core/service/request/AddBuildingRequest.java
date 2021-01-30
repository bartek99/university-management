package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddBuildingRequest(
        @JsonProperty(value = "address", required = true) AddAddressRequest address,
        @JsonProperty(value = "name", required = true) String name){}
