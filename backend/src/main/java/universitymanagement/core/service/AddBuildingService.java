package universitymanagement.core.service;

import com.sun.el.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;
import universitymanagement.core.service.request.AddAddressRequest;
import universitymanagement.core.service.request.AddBuildingRequest;
import universitymanagement.core.service.request.AddEmployeeRequest;
import universitymanagement.core.service.request.AddUserRequest;

import java.util.Optional;
import java.util.Set;

@Service
public class AddBuildingService {
    private final TransactionTemplate transaction;
    private final AddressRepository addressRepository;
    private final BuildingRepository buildingRepository;

    @Autowired
    public AddBuildingService(TransactionTemplate transaction, AddressRepository addressRepository, BuildingRepository buildingRepository){
        this.transaction=transaction;
        this.addressRepository=addressRepository;
        this.buildingRepository=buildingRepository;
    }


    public Optional<Building> addBuilding(AddBuildingRequest request) {
        return transaction.execute(status -> {
            AddAddressRequest addressRequest = request.address();

            final var building = addressRepository
                    .addAddress(
                            addressRequest.street(),
                            addressRequest.houseNumber(),
                            addressRequest.flatNumber(),
                            addressRequest.postcode(),
                            addressRequest.city(),
                            addressRequest.country()
                    )
                    .flatMap(address -> buildingRepository.addBuilding(
                            address,
                            request.name())
                    );
            if (building.isEmpty()) {
                status.setRollbackOnly();
            }
            return building;
        });
    }
}
