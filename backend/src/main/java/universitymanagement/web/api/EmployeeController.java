package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.AddressRepository;
import universitymanagement.core.data.EmployeeRepository;
import universitymanagement.core.data.UserRepository;
import universitymanagement.core.service.request.AddEmployeeRequest;
import universitymanagement.core.service.AddEmployeeService;
import universitymanagement.core.service.request.UpdateEmployeeRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.BuildingResponse;
import universitymanagement.web.api.response.EmployeeResponse;
import universitymanagement.web.error.RestException;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final EmployeeRepository employeeRepository;
    private final AddEmployeeService addEmployeeService;

    @Autowired
    public EmployeeController(
            UserRepository userRepository,
            AddressRepository addressRepository,
            EmployeeRepository employeeRepository,
            AddEmployeeService addEmployeeService) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.employeeRepository = employeeRepository;
        this.addEmployeeService = addEmployeeService;
    }

//    @PreAuthorize("hasRole('Admin') or hasRole('Student')")
    @GetMapping
    public SuccessResponse<List<EmployeeResponse>> getEmployees(@PathParam("groupId") Integer groupId) {
        final var employees = groupId != null
                ? employeeRepository.getAllByGroupId(groupId)
                : employeeRepository.getAll();
        final var responses = employees
                .stream()
                .map(EmployeeResponse::fromEmployee)
                .collect(Collectors.toList());
        return new SuccessResponse<>(responses);
    }


//    @PreAuthorize("hasRole('Student')")
//    @GetMapping
//    public SuccessResponse<List<EmployeeResponse>> getEmployeesByStudent() {
//        final var employees = employeeRepository
//                .getAll()
//                .stream()
//                .map(EmployeeResponse::fromEmployee)
//                .collect(Collectors.toList());
//        return new SuccessResponse<>(employees);
//    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @GetMapping("/{userId}")
    public SuccessResponse<EmployeeResponse> getEmployee(@PathVariable("userId") int userId) {
        return employeeRepository
                .getByUserId(userId)
                .map(EmployeeResponse::fromEmployee)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an employee."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<EmployeeResponse> addEmployee(@RequestBody AddEmployeeRequest request) {
        return addEmployeeService
                .addEmployee(request)
                .map(EmployeeResponse::fromEmployee)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add an employee."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{userId}")
    public SuccessResponse<Void> updateEmployee(
            @PathVariable("userId") int userId,
            @RequestBody UpdateEmployeeRequest request) {
        return employeeRepository
                .getByUserId(userId)
                .map(employee -> {
                    final var user = request.user();
                    final var address = request.address();

                    final var userUpdated = userRepository.updateUserById(
                            employee.user().userId(),
                            user.email());
                    final var addressUpdated = addressRepository.updateAddressById(
                            employee.address().addressId(),
                            address.street(),
                            address.houseNumber(),
                            address.flatNumber(),
                            address.postcode(),
                            address.city(),
                            address.country());
                    final var employeeUpdated = employeeRepository.updateEmployeeById(
                            employee.employeeId(),
                            request.firstName(),
                            request.lastName(),
                            DateTimeUtils.parseDate(request.birthDate()),
                            request.pesel(),
                            request.phoneNumber(),
                            Set.of());
                    return true;
                })
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to add an employee."));
    }
}
