package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddRoomRequest(
        @JsonProperty(value = "buildingId", required = true) int buildingId,
        @JsonProperty(value = "number", required = true) String number) {
}
