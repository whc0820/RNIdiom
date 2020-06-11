import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Notification extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#fff' }}>Test</Text>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    }
});

export default Notification;