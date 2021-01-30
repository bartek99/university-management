DELETE FROM `university_management`.`user`;
ALTER TABLE `university_management`.`user` AUTO_INCREMENT = 1;

INSERT INTO `university_management`.`user` (`email`, `user_type`, `password`) VALUES(
    'admin@example.com',
    'Admin',
    '$2a$10$n66yM2xWJbRsK2NOHHaqauAKRCMKTWA60TvghEhyN1Gv1dNR0LWkm'
);

INSERT INTO `university_management`.`user` (`email`, `user_type`, `password`) VALUES (
    'pracownik@example.com',
    'Employee',
    '$2a$10$n66yM2xWJbRsK2NOHHaqauAKRCMKTWA60TvghEhyN1Gv1dNR0LWkm'
);

INSERT INTO `university_management`.`user` (`email`, `user_type`, `password`) VALUES (
    'student@example.com',
    'Student',
    '$2a$10$n66yM2xWJbRsK2NOHHaqauAKRCMKTWA60TvghEhyN1Gv1dNR0LWkm'
);

INSERT INTO `university_management`.`address` (
    `street`,
    `house_number`,
    `flat_number`,
    `postcode`,
    `city`, 
    `country`
) VALUES (
    'Basztowa',
    '10',
    '150',
    '31-156',
    'Kraków',
    'Polska'
);

INSERT INTO `university_management`.`address` (
    `street`,
    `house_number`,
    `flat_number`,
    `postcode`,
    `city`, 
    `country`
) VALUES (
    'Szpitalna',
    '1',
    '20',
    '31-024',
    'Kraków',
    'Polska'
);

INSERT INTO `university_management`.`admin` (`user_id`) VALUES (1);

INSERT INTO `university_management`.`employee` (
    `user_id`,
    `address_id`,
    `first_name`,
    `last_name`,
    `birth_date`,
    `pesel`,
    `phone_number`
) VALUES (
    2,
    1,
    'Paweł',
    'Nowak',
    '1984-03-29',
    '84032942138',
    '646353819'
);

INSERT INTO `university_management`.`student` (
    `user_id`,
    `address_id`,
    `first_name`,
    `last_name`,
    `album_number`,
    `birth_date`,
    `pesel`,
    `phone_number`
) VALUES (
    3,
    2,
    'Jan',
    'Kowalski',
    '123456',
    '1998-06-07',
    '98060712434',
    '545345987'
);

INSERT INTO `university_management`.`faculty` (
    `name`
) VALUES (
    'Wydział Inżynierii Elektrycznej i Komputerowej'
);

INSERT INTO `university_management`.`faculty` (
    `name`
) VALUES (
    'Wydział Mechaniczny'
);

INSERT INTO `university_management`.`faculty` (
    `name`
) VALUES (
    'Wydział Inżynierii Lądowej'
);

INSERT INTO `university_management`.`subject` (
    `faculty_id`,
    `name`     
) VALUES (
    1,
    'Informatyka'
);

INSERT INTO `university_management`.`subject` (
    `faculty_id`,
    `name`     
) VALUES (
    1,
    'Elektrotechnika'
);

INSERT INTO `university_management`.`subject` (
    `faculty_id`,
    `name`     
) VALUES (
    2,
    'Automatyka i Robotyka'
);

INSERT INTO `university_management`.`subject` (
    `faculty_id`,
    `name`     
) VALUES (
    2,
    'Inżynieria Biomedyczna'
);

INSERT INTO `university_management`.`subject` (
    `faculty_id`,
    `name`     
) VALUES (
    3,
    'Transport'
);

INSERT INTO `university_management`.`subject` (
    `faculty_id`,
    `name`     
) VALUES (
    3,
    'Budownictwo'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    1,
    'Algorytmy i Struktury Danych'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    1,
    'Matematyka Dyskretna'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    2,
    'Algebra Liniowa'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    2,
    'Elektronika'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    3,
    'Teoria Sygnałów'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    3,
    'Wprowadzenie do Fizyki'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    4,
    'Matematyka'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    4,
    'Biofizyka'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    5,
    'Podstawy Automatyki'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    5,
    'Matematyka Ogólna'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    6,
    'Matematyka'
);

INSERT INTO `university_management`.`course` (
    `subject_id`,
    `name`
) VALUES (
    6,
    'Fizyka'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    1,
    'Algorytmy i Struktury Danych, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    1,
    'Algorytmy i Struktury Danych, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    2,
    'Matematyka Dyskretna, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    2,
    'Matematyka Dyskretna, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    3,
    'Algebra Liniowa, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    3,
    'Algebra Liniowa, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    4,
    'Elektronika, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    4,
    'Elektronika, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    5,
    'Teoria Sygnałów, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    5,
    'Teoria Sygnałów, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    6,
    'Wprowadzenie do Fizyki, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    6,
    'Wprowadzenie do Fizyki, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    7,
    'Matematyka, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    7,
    'Matematyka, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    8,
    'Biofizyka, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    8,
    'Biofizyka, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    9,
    'Podstawy Automatyki, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    9,
    'Podstawy Automatyki, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    10,
    'Matematyka Ogólna, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    10,
    'Matematyka Ogólna, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    11,
    'Matematyka, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    11,
    'Matematyka, gr. 2'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    12,
    'Fizyka, gr. 1'
);

INSERT INTO `university_management`.`group` (
    `course_id`,
    `name`  
) VALUES (
    12,
    'Fizyka, gr. 2'
);

INSERT INTO `university_management`.`term` (
    `name`,  
    `date_from`,
    `date_to`
) VALUES (
    '2020/21 Zima',
    '2020-10-04',
    '2021-01-31'
);

INSERT INTO `university_management`.`student_group` (
    `student_id`,
    `group_id`
) VALUES (
    1,
    1
);

INSERT INTO `university_management`.`student_group` (
    `student_id`,
    `group_id`
) VALUES (
    1,
    3
);

INSERT INTO `university_management`.`employee_group` (
    `employee_id`,
    `group_id`
) VALUES (
    1,
    1
);

INSERT INTO `university_management`.`address` (
    `street`,
    `house_number`,
    `flat_number`,
    `postcode`,
    `city`, 
    `country`
) VALUES (
    'Warszawska',
    '1',
    '150',
    '31-156',
    'Kraków',
    'Polska'
);

INSERT INTO `university_management`.`building` (
    `address_id`,
    `name`
) VALUES (
    3,
    'A1'
);

INSERT INTO `university_management`.`room`(
    `building_id`,
    `number`
) VALUES (
    1,
    '1'
);

INSERT INTO `university_management`.`room`(
    `building_id`,
    `number`
) VALUES (
    1,
    '2'
);

INSERT INTO `university_management`.`schedule_item` (
    `group_id`,
    `term_id`,
    `room_id`,
    `day`,
    `week`,
    `time_from`,
    `time_to`
) VALUES (
    1,
    1,
    1,
    'Poniedziałek',
    'Parzysty i Nieparzysty',
    '12:00:00',
    '13:30:00'
);

INSERT INTO `university_management`.`schedule_item` (
    `group_id`,
    `term_id`,
    `room_id`,
    `day`,
    `week`,
    `time_from`,
    `time_to`
) VALUES (
    1,
    1,
    1,
    'Wtorek',
    'Parzysty',
    '09:15:00',
    '10:45:00'
);

INSERT INTO `university_management`.`schedule_item` (
    `group_id`,
    `term_id`,
    `room_id`,
    `day`,
    `week`,
    `time_from`,
    `time_to`
) VALUES (
    1,
    1,
    1,
    'Czwartek',
    'Nieparzysty',
    '07:00:00',
    '08:30:00'
);

INSERT INTO `university_management`.`announcement`(
    `user_id`,
    `title`,
    `description`,
    `content`,
    `created_at`
) VALUES (
    2,
    'Litwo! Ojczyzno moja!',
    'Litwo! Ojczyzno moja! Ty jesteś jak zdrowie. Ile cię trzeba cenić, ten zaszczyt należy. Idąc kłaniał się wypyta o śmierci syna. Brał dom i ze śmiechu a w szlacheckim stanie trudno zaradzić wolał z wieczerzą powynosić z łowów wracając trafia się, mówiąc, że polskie ubrani nagotowane z chleba gałeczki trzy z jutrzenką napotka się nieznanej osobie przypomniał, że słuchał zmrużywszy oczy, usta, lica. w żupanie białym w guberskim rządzie.',
    'Litwo! Ojczyzno moja! Ty jesteś jak zdrowie. Ile cię trzeba cenić, ten zaszczyt należy. Idąc kłaniał się wypyta o śmierci syna. Brał dom i ze śmiechu a w szlacheckim stanie trudno zaradzić wolał z wieczerzą powynosić z łowów wracając trafia się, mówiąc, że polskie ubrani nagotowane z chleba gałeczki trzy z jutrzenką napotka się nieznanej osobie przypomniał, że słuchał zmrużywszy oczy, usta, lica. w żupanie białym w guberskim rządzie.\n Wreszcie z łąk, i goście głodni, chodzili daleko na pacierz w grób się sploty. Kolor musiał pochodzić od słońca blasku Świecił się, jak przystało drugich wiek, urodzenie, cnoty, obyczaje swe trzymał pod lasem zwaliska. Po cóż o tem, Że wszyscy siedli i rzekł: Wielmożni Szlachta, Bracia Dobrodzieje! Forum myśliwskiem tylko się wstążkami jaskrawych stokrotek. Grządki widać, że przymiotów jego ramiona i palcami zadzwonił tabakiera ze złota, z rąk muskała włosów pukle nie będziesz przy Bernardynie sędzia u nas starych zmienia czy cieszyć. Tymczasem na urząd wielkie polowanie. I przyjezdny gość, krewny Horeszków daleki przyjechawszy z napisami: gdzie, kiedy do spoczynku. Starsi i opisuję, bo tak wedle dzisiejszej mody odsyłać konie gości.',
    '2021.01.20 12:00:00'
);

INSERT INTO `university_management`.`comment`(
    `announcement_id`,
    `user_id`,
    `content`,
    `created_at`
) VALUES (
    1,
    3,
    'Początek traktatu czasu być może? Tak stworzony był w głupstwa. A komuż on na owo twierdzenie niektórych słuchaczów z przyczyny koniecznego ograniczenia natury naszej mocy Jego wpływ wywierać; Dobro miałby w cnotę, tak też nieuczuwa braku zasobów lub myśli, które ja teraz spolszczone szanownej.',
    '2021.01.21 19:00:00'
);
