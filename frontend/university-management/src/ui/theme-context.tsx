import React from 'react';

interface Context {
    classes: any;
}

const defaultContext: Context = { classes: {} };

export const ThemeContext = React.createContext(defaultContext);