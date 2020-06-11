import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomizedLightTheme = {
    ...DefaultTheme,
    colors: {
        primary: '#bb86fc',
        accent: '#03dac6',
        background: '#ffffff',
        surface: '#fafafa',
        error: 'b00020',
        onBackground: '#000000',
        onSurface: '#000000',
        text: '#000000',
    }
};

export const CustomizedDarkTheme = {
    ...DarkTheme,
    colors: {
        primary: '#bb86fc',
        accent: '#03dac6',
        background: '#000000',
        surface: '#121212',
        error: '#cf6679',
        onBackground: '#ffffff',
        onSurface: '#ffffff',
        text: '#ffffff',
    }
};
