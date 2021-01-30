import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import * as auth from '../../core/auth';

export default function LogoutPage() {
    const history = useHistory();

    useEffect(() => {
        auth.logout();
        history.push('/');
    });

    return <React.Fragment></React.Fragment>
}
