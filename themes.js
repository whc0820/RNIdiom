import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomizedLightTheme = {
    ...DefaultTheme,
    colors: {
        primary: '#03dac6',
        accent: '#03dac6',
        background: '#fafafa',
        surface: '#ffffff',
        onBackground: '#000000',
        onSurface: '#000000',
        text: '#000000',
        success: '#00c853',
        error: '#b00020',
        caution: '#ffab00'
    }
};

export const CustomizedDarkTheme = {
    ...DarkTheme,
    colors: {
        primary: '#03dac6',
        accent: '#03dac6',
        background: '#000000',
        surface: '#121212',
        onBackground: '#ffffff',
        onSurface: '#ffffff',
        text: '#ffffff',
        success: '#00c853',
        error: '#b00020',
        caution: '#ffab00'
    }
};
