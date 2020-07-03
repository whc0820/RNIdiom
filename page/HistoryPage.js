import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { List, Divider, Text } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import { getAllHistories } from '../database/historyDBHelper';
import darkRealm from '../database/darkDBHelper';
import historyRealm from '../database/historyDBHelper';

class HistoryPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false,
            histories: []
        };

        darkRealm.addListener('change', this.updateDark);
        historyRealm.addListener('change', this.updateHistory);
    };

    componentDidMount() {
        this.updateDark();
        this.updateHistory();
    };

    componentWillUnmount = () => {
        darkRealm.removeAllListeners();
        historyRealm.removeAllListeners();
    };

    updateDark = () => {
        isDark().then((dark) => {
            this.setState({ dark });
        });
    };

    updateHistory = () => {
        getAllHistories().then((allHistories) => {
            let histories = [];
            for (let history of allHistories) {
                let idioms = [];
                for (let d of JSON.parse(history.data)) {
                    idioms.push({
                        'title': d.title,
                        'proficiency': `${d.proficiency * 100}%`
                    });
                }
                histories.push({
                    'date': history.date,
                    'idioms': idioms
                });
            }
            histories = histories.reverse();
            this.setState({ histories });
        });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        return (
            <FlatList
                data={this.state.histories}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => {
                    let idioms = [];
                    for (let idiom of item.idioms) {
                        idioms.push(<>
                            <List.Item theme={theme}
                                title={idiom.title}
                                right={props => <>
                                    <Text theme={theme}
                                        style={{ marginRight: 16, alignSelf: 'center' }}
                                    >{idiom.proficiency}</Text>
                                </>} />
                            <Divider theme={theme} />
                        </>);
                    }
                    return (<>
                        <List.Accordion theme={theme} title={item.date}>
                            {idioms}
                        </List.Accordion>
                        <Divider theme={theme} />
                    </>)
                }}
                style={styles.container} />
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    }
});

export default HistoryPage;