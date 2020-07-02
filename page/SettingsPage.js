import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Divider, List, Switch, Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';

import { CustomizedLightTheme, CustomizedDarkTheme } from '../themes';
import { isDark, updateDark } from '../database/darkDBHelper';
import { isDailyIdiomsExist, newDailyIdioms, getDailyIdioms, updateDailyIdioms } from '../database/dailyIdiomsDBHelper';

import PAGECONFIG from './page-config.json';
import AboutPage from './AboutPage';
import NotificationPage from './NotificationPage';

const Stack = createStackNavigator();

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dark: false, dailyIdioms: 1 };
        this.onToggleDarkTheme = this.onToggleDarkTheme.bind(this);
        this.onSlidingComplete = this.onSlidingComplete.bind(this);
    };

    componentDidMount() {
        isDark().then((value) => {
            this.setState({ dark: value });
        });

        isDailyIdiomsExist().then((value) => {
            if (!value) {
                newDailyIdioms();
            }

            getDailyIdioms().then((value) => {
                this.setState({ dailyIdioms: value });
            });
        });
    };

    onToggleDarkTheme = () => {
        updateDark(!this.state.dark).then(() => {
            this.setState({ dark: !this.state.dark });
        }).catch((error) => {
            console.log(error);
        });
    };

    onSlidingComplete = (value) => {
        updateDailyIdioms(value).then(() => {
            this.setState({ dailyIdioms: value });
        });
    };

    aboutPage = ({ navigation }) => {
        return <AboutPage navigation={navigation} dark={this.state.dark} />
    };

    notificationPage = ({ navigation }) => {
        return <NotificationPage navigation={navigation} dark={this.state.dark} />
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
                    <List.Item title='Dark Theme' theme={theme}
                        right={props => <Switch value={this.state.dark} onValueChange={this.onToggleDarkTheme} />} />
                    <Divider theme={theme} />
                    <View style={{ paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text theme={theme} style={{ fontSize: 16 }}>Daily Idioms</Text>
                        <Slider
                            value={this.state.dailyIdioms}
                            minimumValue={0}
                            maximumValue={5}
                            step={1}
                            thumbTintColor={theme.colors.accent}
                            style={{ width: 240 }}
                            onSlidingComplete={value => this.onSlidingComplete(value)}
                        />
                        <Text style={{ color: theme.colors.accent }}>{this.state.dailyIdioms}</Text>
                    </View>
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

        return (
            <Stack.Navigator initialRouteName={PAGECONFIG.SETTINGS.ROUTE}>
                <Stack.Screen name={PAGECONFIG.SETTINGS.ROUTE}
                    component={settingsPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name={PAGECONFIG.ABOUT.ROUTE}
                    component={this.aboutPage}
                    options={{
                        headerShown: true,
                        title: PAGECONFIG.ABOUT.TITLE,
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }} />
                <Stack.Screen name={PAGECONFIG.NOTIFICATION.ROUTE}
                    component={this.notificationPage}
                    options={{
                        headerShown: true,
                        title: PAGECONFIG.NOTIFICATION.TITLE,
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }} />
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