package universitymanagement.core.data;

import com.sun.el.stream.Stream;
import universitymanagement.core.service.request.AddBuildingRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface BuildingRepository {
    List<Building> getBuildings();

    Optional<Building> getBuildingById(int buildingId);

    Optional<Building> addBuilding(Address address, String name);

    boolean updateBuildingById(
            int buildingId,
            String name);

    boolean deleteBuildingById(int buildingId);
}
