package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.Address;
import universitymanagement.core.data.Building;
import universitymanagement.core.data.BuildingRepository;
import universitymanagement.core.data.Employee;
import universitymanagement.core.service.request.AddBuildingRequest;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcBuildingRepository implements BuildingRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcBuildingRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`building`")
                .usingGeneratedKeyColumns("`building_id`");
    }


    @Override
    public List<Building> getBuildings() {
        String query = "SELECT * FROM `building` " +
                "JOIN `address` ON `building`.`address_id` = `address`.`address_id`";
        return template.query(query, Mappers.BUILDING_MAPPER);
    }

    @Override
    public Optional<Building> getBuildingById(int buildingId) {
        final var query = "SELECT * FROM `building` " +
                "JOIN `address` ON `building`.`address_id` = `address`.`address_id` " +
                "WHERE `building`.`building_id` = ? LIMIT 1";
        try {
            return Optional
                    .ofNullable(template.queryForObject(query, Mappers.BUILDING_MAPPER, buildingId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Building> addBuilding(Address address, String name) {
        try {
            final var buildingId = insert
                    .executeAndReturnKey(new MapSqlParameterSource(Map.of(
                            "address_id", address.addressId(),
                            "name", name)))
                    .intValue();
            return Optional.of(new Building(
                    buildingId,
                    address,
                    name
            ));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public boolean updateBuildingById(int buildingId, String name) {
        final var query = "UPDATE `building` SET " +
                "`building`.`name` = ?" +
                "WHERE `building`.`building_id` = ?";
        try {
            template.update(
                    query,
                    name,
                    buildingId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean deleteBuildingById(int buildingId) {
        Optional<Address> address;
        final var query = "SELECT * FROM `address` JOIN `building` ON `building`.`address_id` = `address`.`address_id` " +
                "WHERE `building`.`building_id` = ? LIMIT 1";
        final var query2 = "DELETE FROM `address` where `address`.`address_id` = ?";

        try {
            address= Optional
                    .ofNullable(template.queryForObject(query, Mappers.ADDRESS_MAPPER, buildingId));
        } catch (EmptyResultDataAccessException e) {
            address= Optional.empty();
        }

        try {
            template.update(query2,address.get().addressId());
            return true;
        } catch (Exception e) {
            return false;
        }
    }


}
