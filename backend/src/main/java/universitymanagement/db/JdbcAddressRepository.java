package universitymanagement.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import universitymanagement.core.data.Address;
import universitymanagement.core.data.AddressRepository;

import javax.sql.DataSource;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcAddressRepository implements AddressRepository {

    private final JdbcTemplate template;
    private final SimpleJdbcInsert insert;

    @Autowired
    JdbcAddressRepository(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("`university_management`.`address`")
                .usingGeneratedKeyColumns("`address_id`");
    }

    @Override
    public Optional<Address> addAddress(
            String street,
            String houseNumber,
            @Nullable String flatNumber,
            String postcode,
            String city,
            String country) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource(Map.of(
                    "street", street,
                    "house_number", houseNumber,
                    "postcode", postcode,
                    "city", city,
                    "country", country));
            if (flatNumber != null) {
                params.addValue("flat_number", flatNumber);
            }
            final var addressId = insert
                    .executeAndReturnKey(params)
                    .intValue();

            return Optional.of(new Address(
                    addressId,
                    street,
                    houseNumber,
                    flatNumber,
                    postcode,
                    city,
                    country));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public Optional<Boolean> updateAddressById(
            int addressId,
            String street,
            String houseNumber,
            @Nullable String flatNumber,
            String postcode,
            String city,
            String country) {
        final var query = "UPDATE `address` SET " +
                "`address`.`street` = ?," +
                "`address`.`house_number` = ?," +
                "`address`.`flat_number` = ?," +
                "`address`.`postcode` = ?," +
                "`address`.`city` = ?," +
                "`address`.`country` = ?" +
                "WHERE `address`.`address_Id` = ?";
        try {
            template.update(
                    query,
                    street,
                    houseNumber,
                    flatNumber,
                    postcode,
                    city,
                    country,
                    addressId);
            return Optional.of(true);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }
}
