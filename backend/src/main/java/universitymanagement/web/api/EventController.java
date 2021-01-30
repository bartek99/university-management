package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.EmployeeRepository;
import universitymanagement.core.data.EventRepository;
import universitymanagement.core.data.GroupRepository;
import universitymanagement.core.data.RoomRepository;
import universitymanagement.core.service.request.AddEventRequest;
import universitymanagement.core.service.request.UpdateEventRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.EventResponse;
import universitymanagement.web.error.RestException;
import universitymanagement.web.security.JwtToken;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EmployeeRepository employeeRepository;
    private final GroupRepository groupRepository;
    private final RoomRepository roomRepository;
    private final EventRepository eventRepository;

    @Autowired
    public EventController(
            EmployeeRepository employeeRepository,
            GroupRepository groupRepository,
            RoomRepository roomRepository,
            EventRepository eventRepository) {
        this.employeeRepository = employeeRepository;
        this.groupRepository = groupRepository;
        this.roomRepository = roomRepository;
        this.eventRepository = eventRepository;
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee') or hasRole('Student')")
    @GetMapping("/{eventId}")
    public SuccessResponse<EventResponse> getEvent(@PathVariable("eventId") int eventId) {
        return eventRepository
                .getById(eventId)
                .map(EventResponse::fromEvent)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an event."));
    }

    @PreAuthorize("hasAnyRole('Admin', 'Employee')")
    @DeleteMapping("/{eventId}")
    public SuccessResponse<Void> deleteEvent(@PathVariable("eventId") int eventId) {
        final var deleted = eventRepository.deleteById(eventId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a user.");
        }
    }
}

