import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShowUserPage from '../../../ShowUserPage';
import * as user from '../../../../core/user';

export default function StudentMePage() {
    const params: any = useParams();

    const studentData = {
        user: {
            'Adres e-mail': ''
        },
        personalData: {
            'Imię': '',
            'Nazwisko': '',
            'Data urodzenia': '',
            'PESEL': '',
            'Numer telefonu': '',
            'Numer albumu': ''
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
    const [data, setData] = useState(studentData);

    useEffect(() => {
        let mounted = true;

        user.getStudent(params.userId).then((student) => {
            if (mounted && student) {
                setData({
                    user: {
                        'Adres e-mail': student.user.email,
                    },
                    personalData: {
                        'Imię': student.firstName,
                        'Nazwisko': student.lastName,
                        'Data urodzenia': student.birthDate,
                        'PESEL': student.pesel,
                        'Numer telefonu': student.phoneNumber,
                        'Numer albumu': student.albumNumber
                    },
                    address: {
                        'Ulica': student.address.street,
                        'Numer domu': student.address.houseNumber,
                        'Numer mieszkania': student.address.flatNumber,
                        'Kod pocztowy': student.address.postcode,
                        'Miasto': student.address.city,
                        'Kraj': student.address.country
                    }
                });
            }
        });
    }, [params]);

    return (
        <React.Fragment>
            <ShowUserPage data={data} />
        </React.Fragment>
    );
}