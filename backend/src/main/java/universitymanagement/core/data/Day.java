package universitymanagement.core.data;

import java.util.Optional;

public enum Day {

    MONDAY("Poniedziałek"),
    TUESDAY("Wtorek"),
    WEDNESDAY("Środa"),
    THURSDAY("Czwartek"),
    FRIDAY("Piątek"),
    SATURDAY("Sobota"),
    SUNDAY("Niedziela");

    private final String value;

    Day(String value) {
        this.value = value;
    }

    public static Optional<Day> from(String value) {
        return switch (value) {
            case "Poniedziałek" -> Optional.of(Day.MONDAY);
            case "Wtorek" -> Optional.of(Day.TUESDAY);
            case "Środa" -> Optional.of(Day.WEDNESDAY);
            case "Czwartek" -> Optional.of(Day.THURSDAY);
            case "Piątek" -> Optional.of(Day.FRIDAY);
            case "Sobota" -> Optional.of(Day.SATURDAY);
            case "Niedziela" -> Optional.of(Day.SUNDAY);
            default -> Optional.empty();
        };
    }

    public String value() {
        return value;
    }
}
