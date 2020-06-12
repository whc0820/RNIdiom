import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Divider, List, Switch } from 'react-native-paper';

import { CustomizedLightTheme, CustomizedDarkTheme } from '../themes';
import { isDark, updateDark } from '../database/darkDBHelper';

import PAGECONFIG from './page-config.json';
import AboutPage from './AboutPage';
import NotificationPage from './NotificationPage';

const Stack = createStackNavigator();

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dark: false };
    };

    componentDidMount() {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    onToggleDarkTheme = () => {
        updateDark(!this.state.dark).then(() => {
            this.setState({ dark: !this.state.dark });
        }).catch((error) => {
            console.log(error);
        });
    };

    render() {
        let settingsPage = ({ navigation }) => {
            const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.navigate(PAGECONFIG.ABOUT.ROUTE)}>
                        <List.Item title='About' theme={theme} />
                    </TouchableOpacity>
                    <Divider theme={theme} />
                    <List.Item title='Dark Theme'
                        theme={theme}
                        right={props => <Switch value={this.state.dark} onValueChange={this.onToggleDarkTheme} />} />
                    <Divider theme={theme} />
                    <TouchableOpacity onPress={() => navigation.navigate(PAGECONFIG.NOTIFICATION.ROUTE)}>
                        <List.Item title='Notification' theme={theme} />
                    </TouchableOpacity>
                    <Divider theme={theme} />
                    <TouchableOpacity>
                        <List.Item title='Reset' theme={theme} />
                    </TouchableOpacity>
                    <Divider theme={theme} />
                </View>
            );
        };

        let aboutPage = ({ navigation }) => {
            return <AboutPage navigation={navigation} dark={this.state.dark} />
        };

        let notificationPage = ({ navigation }) => {
            return <NotificationPage navigation={navigation} dark={this.state.dark} />
        };

        return (
            <Stack.Navigator initialRouteName={PAGECONFIG.SETTINGS.ROUTE}>
                <Stack.Screen name={PAGECONFIG.SETTINGS.ROUTE}
                    component={settingsPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name={PAGECONFIG.ABOUT.ROUTE}
                    component={aboutPage}
                    options={{ headerShown: true, title: PAGECONFIG.ABOUT.TITLE}} />
                <Stack.Screen name={PAGECONFIG.NOTIFICATION.ROUTE}
                    component={notificationPage}
                    options={{ headerShown: true, title: PAGECONFIG.NOTIFICATION.TITLE }} />
            </Stack.Navigator>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: 'column'
    }
});

export default SettingsPage;