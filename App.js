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

const App = () => {
  const theme = CustomizedLightTheme;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar barStyle="dark-content"
        backgroundColor={theme.colors.surface} />

      <Tab.Navigator
        activeColor={theme.colors.accent}
        barStyle={{ backgroundColor: theme.colors.surface }}>
        <Tab.Screen
          name="DashboardPage"
          component={dashboardPage}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='view-dashboard' color={color} size={26} />
            )
          }}
        />

        <Tab.Screen
          name="DictionaryPage"
          component={dictionaryPage}
          options={{
            tabBarLabel: 'Dictionary',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='book' color={color} size={26} />
            )
          }}
        />

        <Tab.Screen
          name="FavoritePage"
          component={favoritePage}
          options={{
            tabBarLabel: 'Favorite',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='heart' color={color} size={26} />
            )
          }}
        />

        <Tab.Screen
          name="HistoryPage"
          component={historyPage}
          options={{
            tabBarLabel: 'History',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='history' color={color} size={26} />
            )
          }}
        />

        <Tab.Screen
          name="SettingsPage"
          component={settingsPage}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='settings' color={color} size={26} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
