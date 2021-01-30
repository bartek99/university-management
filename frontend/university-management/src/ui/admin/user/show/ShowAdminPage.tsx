import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShowUserPage from '../../../ShowUserPage';
import * as user from '../../../../core/user';

export default function ShowAdminPage() {
    const params: any = useParams();

    const adminData = {
        user: {
            'Adres e-mail': ''
        }
    };
    const [data, setData] = useState(adminData);

    useEffect(() => {
        let mounted = true;

        user.getAdmin(params.userId).then((admin) => {
            if (mounted && admin) {
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
    }, [params]);

    return (
        <ShowUserPage data={data} />
    );
}