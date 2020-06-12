import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dark: false };
    };

    componentDidMount() {
        this.setState({ dark: this.props.dark });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        return (
            <View style={styles.container}>
                <Divider theme={theme} />
                <List.Item title='Notification'
                    theme={theme} />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: 'column'
    }
});

export default Notification;