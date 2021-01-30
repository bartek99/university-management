package universitymanagement.core.data;

import java.util.List;
import java.util.Optional;

public interface RoomRepository {
    List<Room> getRooms();

    Optional<Room> getRoomById(int roomId);

    Optional<Room> addRoom(Building building, String number);

    boolean updateRoomById(
            int roomId,
            Building building,
            String number);

    boolean deleteRoomById(int roomId);
}
