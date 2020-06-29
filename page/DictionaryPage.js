import React from 'react';
import { StyleSheet, View, TouchableOpacity, SectionList } from 'react-native';
import { Searchbar, Divider, Text } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import realm from '../database/darkDBHelper';

class DictionaryPage extends React.Component {
    constructor(props) {
        super(props);

        let alphabets = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ',
            'ㄙ', '一', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄤ', 'ㄥ', 'ㄦ'];
        let data = [];
        for (let alphabet of alphabets) {
            let obj = {
                title: alphabet,
                data: [`${alphabet}1`, `${alphabet}2`, `${alphabet}3`]
            }
            data.push(obj);
        }

        this.state = {
            dark: false,
            data: data
        };

        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderItem = this.renderItem.bind(this);

        realm.addListener('change', this.updateUI);
    };

    componentDidMount() {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    componentWillUnmount = () => {
        realm.removeAllListeners();
    };

    updateUI = () => {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    renderSectionHeader = ({ section: { title } }) => {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        return (
            <View style={{
                padding: 16,
                backgroundColor: theme.colors.surface,
            }}>
                <Text style={{ color: theme.colors.accent }}>{title}</Text>
            </View>
        )
    };

    renderItem = ({ item }) => {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        return (
            <>
                <TouchableOpacity style={{ padding: 16 }}
                    onPress={() => {
                        console.log(item);
                    }}>
                    <Text theme={theme}>{item}</Text>
                </TouchableOpacity>
                <Divider theme={theme} />
            </>
        )
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        return (
            <View style={[styles.container]}>
                <Searchbar theme={theme}
                    style={{ backgroundColor: theme.colors.background }} />
                <SectionList
                    sections={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}
                />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default DictionaryPage;