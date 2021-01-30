package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Room;

public record RoomResponse(
        @JsonProperty("roomId") int roomId,
        @JsonProperty("building") BuildingResponse building,
        @JsonProperty("number") String number
) {
    public static RoomResponse fromRoom(Room room ){
        return new RoomResponse(
                room.roomId(),
                BuildingResponse.fromBuilding(room.building()),
                room.number());
    }
}
