import React, { useEffect, useState } from 'react';
import ShowUserPage from '../../ShowUserPage';
import * as user from './../../../core/user';

export default function EmployeeMePage() {
    const employeeData = {
        user: {
            'Adres e-mail': ''
        },
        personalData: {
            'Imię': '',
            'Nazwisko': '',
            'Data urodzenia': '',
            'PESEL': '',
            'Numer telefonu': ''
        },
        address: {
            'Ulica': '',
            'Numer domu': '',
            'Numer mieszkania': '',
            'Kod pocztowy': '',
            'Miasto': '',
            'Kraj': ''
        }
    };
    const [data, setData] = useState(employeeData);

    useEffect(() => {
        let mounted = true;
        user.getMeEmployee()
            .then((employee) => {
                if (mounted && employee !== null) {
                    setData({
                        user: {
                            'Adres e-mail': employee.user.email,
                        },
                        personalData: {
                            'Imię': employee.firstName,
                            'Nazwisko': employee.lastName,
                            'Data urodzenia': employee.birthDate,
                            'PESEL': employee.pesel,
                            'Numer telefonu': employee.phoneNumber,
                        },
                        address: {
                            'Ulica': employee.address.street,
                            'Numer domu': employee.address.houseNumber,
                            'Numer mieszkania': employee.address.flatNumber,
                            'Kod pocztowy': employee.address.postcode,
                            'Miasto': employee.address.city,
                            'Kraj': employee.address.country
                        }
                    });
                }
            })
            .catch((error) => { });

        return () => {
            mounted = false;
        }
    }, []);

    return (
        <ShowUserPage data={data} />
    );
}