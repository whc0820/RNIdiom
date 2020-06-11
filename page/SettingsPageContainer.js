import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ROUTE from '../routes.json';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import NotificationPage from './NotificationPage';

let settingsPage = ({ navigation }) => {
    return <SettingsPage navigation={navigation} />
};

let aboutPage = ({ navigation }) => {
    return <AboutPage navigation={navigation} />
};

let notificationPage = ({ navigation }) => {
    return <NotificationPage navigation={navigation} />
};

const Stack = createStackNavigator();

class SettingsPageContainer extends React.Component {
    render() {
        return (
            <Stack.Navigator initialRouteName={ROUTE.MAIN}>
                <Stack.Screen name={ROUTE.MAIN}
                    component={settingsPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name={ROUTE.ABOUT}
                    component={aboutPage}
                    options={{ headerShown: true, title: 'About' }} />
                <Stack.Screen name={ROUTE.NOTIFICATION}
                    component={notificationPage}
                    options={{ headerShown: true, title: 'Notification' }} />
            </Stack.Navigator>
        );
    }
};

export default SettingsPageContainer;