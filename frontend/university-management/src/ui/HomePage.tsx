import { Redirect } from 'react-router';
import * as auth from './../core/auth';

export default function HomePage() {
    if (auth.isLoggedIn()) {
        if (auth.hasRole('Admin')) {
            return <Redirect to="/admin" />
        } else if (auth.hasRole('Employee')) {
            return <Redirect to="/employee" />
        } else if (auth.hasRole('Student')) {
            return <Redirect to="/student" />
        }
    }

    return <Redirect to="/login" />
}
