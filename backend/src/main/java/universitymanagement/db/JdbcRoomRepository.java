package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.Building;
import universitymanagement.core.data.Room;
import universitymanagement.core.data.RoomRepository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcRoomRepository implements RoomRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcRoomRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`room`")
                .usingGeneratedKeyColumns("`room_id`");
    }

    @Override
    public List<Room> getRooms() {
        String query = "SELECT * FROM `room` " +
                "JOIN `building` ON `building`.`building_id` = `room`.`building_id` " +
                "JOIN `address` ON `building`.`address_id` = `address`.`address_id`";
        return template.query(query, Mappers.ROOM_MAPPER);
    }

    @Override
    public Optional<Room> getRoomById(int roomId) {
        final var query = "SELECT * FROM `room` JOIN `building` ON `room`.`building_id` = `building`.`building_id` " +
                "JOIN `address` ON `building`.`address_id` = `address`.`address_id` " +
                "WHERE `room`.`room_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.ROOM_MAPPER, roomId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Room> addRoom(Building building, String number) {
        try {
            final var roomId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "building_id", building.buildingId(),
                            "number", number)))
                    .intValue();
            return Optional.of(new Room(roomId, building, number));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean updateRoomById(int roomId, Building building, String number) {
        final var query = "UPDATE `room` SET " +
                "`room`.`building_id` = ?, " +
                "`room`.`number` = ? " +
                "WHERE `room`.`room_id` = ?";
        try {
            template.update(query, building.buildingId(), number, roomId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteRoomById(int roomId) {
        final var query = "DELETE FROM `room` WHERE `room`.`room_id` = ?";
        try {
            template.update(query, roomId);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
