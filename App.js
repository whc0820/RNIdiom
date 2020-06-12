/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { CustomizedLightTheme, CustomizedDarkTheme } from './themes';
import { isDarkExist, isDark, newDark } from './database/darkDBHelper';
import realm from './database/darkDBHelper';

import PAGECONFIG from './page/page-config.json';
import DashboardPage from './page/DashboardPage';
import DictionaryPage from './page/DictionaryPage';
import FavoritePage from './page/FavoritePage';
import HistoryPage from './page/HistoryPage';
import SettingsPage from './page/SettingsPage';
const dashboardPage = () => <DashboardPage />
const dictionaryPage = () => <DictionaryPage />
const favoritePage = () => <FavoritePage />
const historyPage = () => <HistoryPage />
const settingsPage = () => <SettingsPage />

const Tab = createMaterialBottomTabNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dark: false };
    realm.addListener('change', this.updateUI);
  }

  componentDidMount = () => {
    console.log('componenetDidMount');
    this.updateUI();
  };

  componentWillUnmount = () => {
    console.log('componentWillUnmount');
    realm.removeAllListeners();
  };

  updateUI = () => {
    console.log(this.updateUI);
    isDarkExist().then((value) => {
      if (!value) {
        newDark();
      }

      isDark().then((value) => {
        this.setState({ dark: value });
      });
    });
  };

  render() {
    const barStyle = this.state.dark ? 'light-content' : 'dark-content';
    const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
    return (
      <NavigationContainer theme={theme} >
        <StatusBar barStyle={barStyle}
          backgroundColor={theme.colors.surface} />

        <Tab.Navigator
          activeColor={theme.colors.accent}
          barStyle={{ backgroundColor: theme.colors.surface }}
          backBehavior='none'>
          <Tab.Screen
            name={PAGECONFIG.DASHBOARD.ROUTE}
            component={dashboardPage}
            options={{
              tabBarLabel: PAGECONFIG.DASHBOARD.TITLE,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name='view-dashboard' color={color} size={26} />
              )
            }}
          />

          <Tab.Screen
            name={PAGECONFIG.DICTIONARY.ROUTE}
            component={dictionaryPage}
            options={{
              tabBarLabel: PAGECONFIG.DICTIONARY.TITLE,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name='book' color={color} size={26} />
              )
            }}
          />

          <Tab.Screen
            name={PAGECONFIG.FAVORITE.ROUTE}
            component={favoritePage}
            options={{
              tabBarLabel: PAGECONFIG.FAVORITE.TITLE,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name='heart' color={color} size={26} />
              )
            }}
          />

          <Tab.Screen
            name={PAGECONFIG.HISTORY.ROUTE}
            component={historyPage}
            options={{
              tabBarLabel: PAGECONFIG.HISTORY.TITLE,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name='history' color={color} size={26} />
              )
            }}
          />

          <Tab.Screen
            name={PAGECONFIG.SETTINGS.ROUTE}
            component={settingsPage}
            options={{
              tabBarLabel: PAGECONFIG.SETTINGS.TITLE,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name='settings' color={color} size={26} />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
