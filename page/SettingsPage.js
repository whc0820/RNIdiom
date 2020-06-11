import * as React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Divider, List, Switch } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

const SettingsPage = () => {
    const theme = useTheme();
    const colors = theme.colors;

    const [dark, setDark] = React.useState(false);
    const [notification, setNotification] = React.useState(false);

    let onToggleDarkTheme = () => {
        setDark(!dark);
    };

    let onToggleNotification = () => {
        setNotification(!notification);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <List.Item title='About' theme={theme} />
            </TouchableOpacity>
            <Divider theme={theme} />
            <List.Item title='Dark Theme'
                theme={theme}
                right={props => <Switch value={dark} onValueChange={onToggleDarkTheme} />} />
            <Divider theme={theme} />
            <TouchableOpacity>
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

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: 'column'
    }
});

export default SettingsPage;