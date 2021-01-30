import React, { useEffect, useState } from 'react';
import ShowUserPage from '../../ShowUserPage';
import * as user from './../../../core/user';

export default function AdminMePage() {
    const adminData = {
        user: {
            'Adres e-mail': ''
        }
    };
    const [data, setData] = useState(adminData);

    useEffect(() => {
        let mounted = true;
        user.getMeAdmin().then((admin) => {
            if (mounted && admin !== null) {
                setData({
                    user: {
                        'Adres e-mail': admin.user.email
                    }
                })
            }
        });

        return () => {
            mounted = false;
        }
    }, []);

    return (
        <ShowUserPage data={data} />
    );
}