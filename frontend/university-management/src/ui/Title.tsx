import Typography from '@material-ui/core/Typography';

interface TitleProps {
    style?: any;
    children: React.ReactNode
}

export default function Title(props: TitleProps) {
    return (
        <Typography style={props.style} component="h2" variant="h6" color="primary" gutterBottom>
            {props.children}
        </Typography>
    );
}