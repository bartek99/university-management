package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Address;
import universitymanagement.core.data.Building;

public record BuildingResponse(
        @JsonProperty("buildingId") int buildingId,
        @JsonProperty("address")AddressResponse address,
        @JsonProperty("name") String name
        ) {

        public static BuildingResponse fromBuilding(Building building){
                return new BuildingResponse(
                        building.buildingId(),
                        AddressResponse.fromAddress(building.address()),
                        building.name());
        }
}
