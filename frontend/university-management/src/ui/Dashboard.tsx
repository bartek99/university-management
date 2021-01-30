import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ExitToApp, Person, VpnKey } from '@material-ui/icons';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from './styles';
import { ThemeContext } from './theme-context';
interface DashboardProps {
  routePrefix: string;
  title: string;
  menuItems: any;
  children: React.ReactNode;
}

export default function Dashboard(props: DashboardProps) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={RouterLink} to={'/' + props.routePrefix}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Strona główna" />
          </ListItem>
          {props.menuItems}
        </List>
        <List>
          <div>
            <ListSubheader inset>Użytkownik</ListSubheader>
            <ListItem button component={RouterLink} to={'/' + props.routePrefix + '/me'}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Moje dane" />
            </ListItem>
            <ListItem button component={RouterLink} to={'/' + props.routePrefix + '/change-password'}>
              <ListItemIcon>
                <VpnKey />
              </ListItemIcon>
              <ListItemText primary="Zmiana hasła" />
            </ListItem>
            <ListItem button component={RouterLink} to="/logout">
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Wyloguj się" />
            </ListItem>
          </div>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <ThemeContext.Provider value={{ classes }}>
          {props.children}
        </ThemeContext.Provider>
      </main>
    </div>
  );
}