import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

const DashboardPage = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container]}>
            <Text style={{color: colors.accent}}>Dashboard</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DashboardPage;