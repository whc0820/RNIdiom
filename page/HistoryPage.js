import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { List, Divider, Text } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import realm from '../database/darkDBHelper';

class HistoryPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false,
            data: []
        };

        realm.addListener('change', this.updateUI);
    };

    componentDidMount() {
        isDark().then((dark) => {
            this.setState({ dark });
        });

        let data = [];
        for (let i = 0; i < 5; i++) {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDay();

            if (month < 10) {
                month = `0${month}`
            }
            if (day < 10) {
                day = `0${day}`
            }
            data.push({
                'date': `${year}/${month}/${day}`,
                'idioms': i % 2 == 0 ? [`a${i}`, `b${i}`, `c${i}`, `d${i}`] : [`e${i}`, `f${i}`]
            });
        }

        this.setState({ data });
    };

    componentWillUnmount = () => {
        realm.removeAllListeners();
    };

    updateUI = () => {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        return (
            <ScrollView style={styles.container}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => {
                        let idioms = [];
                        for (let idiom of item.idioms) {
                            idioms.push(<>
                                <List.Item theme={theme} title={idiom} />
                                <Divider theme={theme} />
                            </>);
                        }
                        return (<>
                            <List.Accordion theme={theme} title={item.date}>
                                {idioms}
                            </List.Accordion>
                            <Divider theme={theme} />
                        </>)
                    }} />
            </ScrollView>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default HistoryPage;