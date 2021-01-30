package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.AddressRepository;
import universitymanagement.core.data.BuildingRepository;
import universitymanagement.core.data.UserRepository;
import universitymanagement.core.service.AddBuildingService;
import universitymanagement.core.service.request.AddBuildingRequest;
import universitymanagement.core.service.request.AddFacultyRequest;
import universitymanagement.core.service.request.UpdateBuildingRequest;
import universitymanagement.core.service.request.UpdateFacultyRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.BuildingResponse;
import universitymanagement.web.api.response.FacultyResponse;
import universitymanagement.web.api.response.UserResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/buildings")
public class BuildingController {

    private final BuildingRepository buildingRepository;
    private final AddBuildingService addBuildingService;
    private final AddressRepository addressRepository;

    @Autowired
    public BuildingController(BuildingRepository buildingRepository, AddBuildingService addBuildingService,
                              AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.addBuildingService=addBuildingService;
        this.addressRepository=addressRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping
    public SuccessResponse<List<BuildingResponse>> getBuildings() {
        final var buildings = buildingRepository
                .getBuildings()
                .stream()
                .map(BuildingResponse::fromBuilding)
                .collect(Collectors.toList());
        return new SuccessResponse<>(buildings);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{buildingId}")
    public SuccessResponse<BuildingResponse> getBuilding(@PathVariable("buildingId") int buildingId) {
        return buildingRepository
                .getBuildingById(buildingId)
                .map(BuildingResponse::fromBuilding)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a building."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<BuildingResponse> addBuilding(@RequestBody AddBuildingRequest request) {
        return addBuildingService
                .addBuilding(request)
                .map(BuildingResponse::fromBuilding)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a building."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{buildingId}")
    public SuccessResponse<Void> updateBuilding(
            @PathVariable("buildingId") int buildingId,
            @RequestBody UpdateBuildingRequest request) {
        return buildingRepository
                .getBuildingById(buildingId)
                .map(building -> {
                    final var address = request.address();

                    final var addressUpdated = addressRepository.updateAddressById(
                            building.address().addressId(),
                            address.street(),
                            address.houseNumber(),
                            address.flatNumber(),
                            address.postcode(),
                            address.city(),
                            address.country());
                    final var employeeUpdated = buildingRepository.updateBuildingById(
                            building.buildingId(),
                            request.name());
                    return true;
                })
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to add an building."));
    }
    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{buildingId}")
    public SuccessResponse<Void> deleteBuilding(@PathVariable("buildingId") int buildingId) {
        final var deleted = buildingRepository.deleteBuildingById(buildingId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a building.");
        }
    }
}