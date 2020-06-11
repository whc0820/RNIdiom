import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Divider, List, Switch } from 'react-native-paper';

import { isDark, updateDark } from '../database/darkDBHelper';
import { CustomizedLightTheme, CustomizedDarkTheme } from '../themes';
import ROUTE from '../routes.json';


class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dark: false };
    };

    componentDidMount() {
        isDark().then((value) => {
            this.setState({ dark: value });
        })
    };

    onPressAbout = () => {
        this.props.navigation.navigate(ROUTE.ABOUT);
    };

    onPressNotification = () => {
        this.props.navigation.navigate(ROUTE.NOTIFICATION);
    };

    onToggleDarkTheme = () => {
        updateDark(!this.state.dark).then(() => {
            this.setState({ dark: !this.state.dark });
        }).catch((error) => {
            console.log(error);
        });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.onPressAbout}>
                    <List.Item title='About' theme={theme} />
                </TouchableOpacity>
                <Divider theme={theme} />
                <List.Item title='Dark Theme'
                    theme={theme}
                    right={props => <Switch value={this.state.dark} onValueChange={this.onToggleDarkTheme} />} />
                <Divider theme={theme} />
                <TouchableOpacity onPress={this.onPressNotification}>
                    <List.Item title='Notification' theme={theme} />
                </TouchableOpacity>
                <Divider theme={theme} />
                <TouchableOpacity>
                    <List.Item title='Reset' theme={theme} />
                </TouchableOpacity>
                <Divider theme={theme} />
            </View>
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