package universitymanagement.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;
import universitymanagement.core.service.request.AddAddressRequest;
import universitymanagement.core.service.request.AddEmployeeRequest;
import universitymanagement.core.service.request.AddUserRequest;

import java.util.Optional;
import java.util.Set;

@Service
public class AddEmployeeService {

    private final TransactionTemplate transaction;

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public AddEmployeeService(
            PlatformTransactionManager transactionManager,
            UserRepository userRepository,
            AddressRepository addressRepository,
            EmployeeRepository employeeRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.transaction = new TransactionTemplate(transactionManager);
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.employeeRepository = employeeRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public Optional<Employee> addEmployee(AddEmployeeRequest request) {
        return transaction.execute(status -> {
            AddUserRequest userRequest = request.user();
            AddAddressRequest addressRequest = request.address();

            if (!userRequest.password().equals(userRequest.passwordConfirmation())) {
                return Optional.empty();
            }

            final var encryptedPassword = bCryptPasswordEncoder.encode(userRequest.password());
            final var employee = userRepository
                    .addUser(UserType.EMPLOYEE, userRequest.email(), encryptedPassword)
                    .flatMap(user -> addressRepository.addAddress(
                            addressRequest.street(),
                            addressRequest.houseNumber(),
                            addressRequest.flatNumber(),
                            addressRequest.postcode(),
                            addressRequest.city(),
                            addressRequest.country()
                    ).flatMap(address -> employeeRepository.addEmployee(
                            user,
                            address,
                            request.firstName(),
                            request.lastName(),
                            DateTimeUtils.parseDate(request.birthDate()),
                            request.pesel(),
                            request.phoneNumber(),
                            Set.of())
                    ));
            if (employee.isEmpty()) {
                status.setRollbackOnly();
            }
            return employee;
        });
    }
}
