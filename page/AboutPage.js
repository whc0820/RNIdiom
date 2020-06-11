import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dark: false };
    };

    componentDidMount() {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    render() {
        console.log(this.state.dark);
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        const colors = theme.colors;

        return (
            <View style={styles.container}>
                <List.Item title='Digital Learning Final Project'
                    theme={theme} />
                <Divider theme={theme} />
                <List.Item title='Jason Chen'
                    theme={theme} />
                <Divider theme={theme} />
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: 'column'
    }
});

export default About;