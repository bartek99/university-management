import {
    Redirect
} from 'react-router-dom';
import * as auth from './../core/auth';

interface AuthorizedProps {
    role: string;
    children: any;
}

export default function Authorized(props: AuthorizedProps): any {
    if (auth.isLoggedIn() && auth.hasRole(props.role)) {
        return props.children;
    } else {
        return <Redirect to="/login" />;
    }
}
