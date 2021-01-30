package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateRoomRequest(
        @JsonProperty(value = "buildingId", required = true) int buildingId,
        @JsonProperty(value = "number") String number){
}
