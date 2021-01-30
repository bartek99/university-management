package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;
import universitymanagement.core.service.request.AddRoomRequest;
import universitymanagement.core.service.request.UpdateRoomRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.RoomResponse;
import universitymanagement.web.error.RestException;

import java.lang.reflect.Array;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomRepository roomRepository;
    private final BuildingRepository buildingRepository;
    private final EventRepository eventRepository;
    private final ScheduleItemRepository scheduleItemRepository;

    @Autowired
    public RoomController(RoomRepository roomRepository,
                          BuildingRepository buildingRepository,
                          EventRepository eventRepository,
                          ScheduleItemRepository scheduleItemRepository) {
        this.roomRepository = roomRepository;
        this.buildingRepository = buildingRepository;
        this.eventRepository = eventRepository;
        this.scheduleItemRepository = scheduleItemRepository;
    }

    @PreAuthorize("hasAnyRole('Admin', 'Employee')")
    @GetMapping("/available")
    public SuccessResponse<List<RoomResponse>> getAvailableRooms(
            @RequestHeader("Authorization") String token,
            @RequestParam("date") String date,
            @RequestParam("timeFrom") String timeFrom,
            @RequestParam("timeTo") String timeTo
    ) {
        final var parsedDate = DateTimeUtils.parseDate(date);
        final var parsedTimeFrom = DateTimeUtils.parseTime(timeFrom);
        final var parsedTimeTo = DateTimeUtils.parseTime(timeTo);
        final var rooms1 = eventRepository
                .getAllByDateAndTime(
                        parsedDate,
                        parsedTimeFrom,
                        parsedTimeTo)
                .stream()
                .map(Event::room)
                .collect(Collectors.toList());
        final var rooms2 = scheduleItemRepository
                .getAllByDayAndTime(
                        mapDayOfWeek(parsedDate.getDayOfWeek()).get(),
                        parsedTimeFrom,
                        parsedTimeTo)
                .stream()
                .filter(scheduleItem -> {
                    final var weeksBetween = ChronoUnit
                            .DAYS
                            .between(
                                    scheduleItem.term().dateFrom().atStartOfDay(ZoneId.systemDefault()).toInstant(),
                                    parsedDate.atStartOfDay(ZoneId.systemDefault()).toInstant()) / 7;
                    if (scheduleItem.week() == Week.ODD) {
                        return weeksBetween % 2 == 0;
                    } else if (scheduleItem.week() == Week.EVEN) {
                        return weeksBetween % 2 == 1;
                    } else {
                        return true;
                    }
                })
                .map(ScheduleItem::room)
                .collect(Collectors.toList());
        final var notAvailableRooms = Stream
                .concat(rooms1.stream(), rooms2.stream())
                .map(Room::roomId)
                .collect(Collectors.toSet());

        final var rooms = roomRepository
                .getRooms()
                .stream()
                .map(RoomResponse::fromRoom)
                .filter(room -> !notAvailableRooms.contains(room.roomId()))
                .collect(Collectors.toList());
        return new SuccessResponse<>(rooms);
    }

    private static Optional<Day> mapDayOfWeek(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> Optional.of(Day.MONDAY);
            case TUESDAY -> Optional.of(Day.TUESDAY);
            case WEDNESDAY -> Optional.of(Day.WEDNESDAY);
            case THURSDAY -> Optional.of(Day.THURSDAY);
            case FRIDAY -> Optional.of(Day.FRIDAY);
            case SUNDAY -> Optional.of(Day.SATURDAY);
            case SATURDAY -> Optional.of(Day.SUNDAY);
        };
    }

    @PreAuthorize("hasAnyRole('Admin', 'Employee')")
    @GetMapping
    public SuccessResponse<List<RoomResponse>> getRooms() {
        final var rooms = roomRepository
                .getRooms()
                .stream()
                .map(RoomResponse::fromRoom)
                .collect(Collectors.toList());
        return new SuccessResponse<>(rooms);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{roomId}")
    public SuccessResponse<RoomResponse> getRoom(@PathVariable("roomId") int roomId) {
        return roomRepository
                .getRoomById(roomId)
                .map(RoomResponse::fromRoom)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a room."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<RoomResponse> addRoom(@RequestBody AddRoomRequest request) {
        return buildingRepository
                .getBuildingById(request.buildingId())
                .flatMap(building -> roomRepository.addRoom(building, request.number()))
                .map(RoomResponse::fromRoom)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a subject."));
    }


    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{roomId}")
    public SuccessResponse<Void> updateRoom(
            @PathVariable("roomId") int roomId,
            @RequestBody UpdateRoomRequest request) {
        return buildingRepository
                .getBuildingById(request.buildingId())
                .map(building -> roomRepository.updateRoomById(roomId, building, request.number()))
                .filter(updated -> updated)
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update a room."));
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{roomId}")
    public SuccessResponse<Void> deleteSubject(@PathVariable("roomId") int roomId) {
        final var deleted = roomRepository.deleteRoomById(roomId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a room");
        }
    }
}
