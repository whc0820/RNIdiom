import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';

class About extends React.Component {
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
                <List.Item title='Author'
                    theme={theme}
                    right={props => <Text theme={theme} style={styles.item}>Jason Chen</Text>} />
                <Divider theme={theme} />
                <List.Item title='Student ID'
                    theme={theme}
                    right={props => <Text theme={theme} style={styles.item}>1086035</Text>} />
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
    },
    item: {
        alignSelf: 'center'
    }
});

export default About;