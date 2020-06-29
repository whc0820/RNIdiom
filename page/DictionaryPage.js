import React from 'react';
import { StyleSheet, View, TouchableOpacity, SectionList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Searchbar, Divider, Text, List, Paragraph, Button } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';


import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import realm from '../database/darkDBHelper';

import idioms from '../resources/idioms.json';


const Stack = createStackNavigator();

class DictionaryPage extends React.Component {
    constructor(props) {
        super(props);

        const PINYINS = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ',
            'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄤ', 'ㄥ', 'ㄦ'];
        let data = [];
        for (let pinyin of PINYINS) {
            let obj = {
                title: pinyin,
                data: []
            };

            let checkIdiomIsExist = (id) => {
                for (let idiom of obj.data) {
                    if (idiom.id === id) {
                        return true;
                    }
                }
                return false;
            };

            for (let idiom of idioms) {
                let idiomId = idiom.id;
                let idiomPinyin = idiom.pinyin;
                if (idiomPinyin.startsWith(pinyin) && !checkIdiomIsExist(idiomId)) {
                    obj.data.push(idiom);
                }
            }

            if (obj.data.length > 0) {
                data.push(obj);
            }
        }

        this.state = {
            dark: false,
            data: data,
            isFavorite: false
        };

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

    onPressIdiom = (navigation, item) => {
        navigation.navigate('IDIOM_PAGE', item);
        console.log(item.id);
        if (item.id.endsWith('5')) {
            this.setState({ isFavorite: true });
        }
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        let renderSectionHeader = ({ section: { title } }) => {
            return (
                <View style={{
                    padding: 16,
                    backgroundColor: theme.colors.background,
                }}>
                    <Text style={{ color: theme.colors.accent }}>{title}</Text>
                </View>
            );
        };

        let DictionaryMainPage = ({ navigation }) => {
            return (
                <View style={[styles.container]}>
                    <Searchbar theme={theme}
                        style={{ backgroundColor: theme.colors.surface }} />
                    <SectionList
                        sections={this.state.data}
                        keyExtractor={(item, index) => item + index}
                        renderSectionHeader={renderSectionHeader}
                        renderItem={({ item }) => <View>
                            <TouchableOpacity style={{ padding: 16, backgroundColor: theme.colors.surface }}
                                onPress={() => this.onPressIdiom(navigation, item)}>
                                <Text theme={theme}>{item.title}</Text>
                            </TouchableOpacity>
                            <Divider theme={theme} />
                        </View>}
                    />
                </View>
            );
        };

        let IdiomPage = ({ route, navigation }) => {
            const idiom = route.params;
            const IDIOM_PINYIN = idiom['pinyin'];
            const IDIOM_PINYIN_EN = idiom['pinyin-en'];
            const IDIOM_MEANING = idiom['meaning'];
            const IDIOM_SOURCE = idiom['source'];
            const IDIOM_EXAMPLE = idiom['example'];
            const IDIOM_DESCRIPTION = idiom['description'];
            const IDIOM_USAGE = idiom['usage'];

            return (
                <ScrollView style={{ paddingHorizontal: 8 }}>
                    <List.Item title='注音' theme={theme}
                        right={props => <Text theme={theme} style={{ alignSelf: 'center' }}>{IDIOM_PINYIN}</Text>} />
                    <Divider theme={theme} />
                    <List.Item title='漢語拼音' theme={theme}
                        right={props => <Text theme={theme} style={{ alignSelf: 'center' }}>{IDIOM_PINYIN_EN}</Text>} />
                    <Divider theme={theme} />
                    <List.Item title='釋義' theme={theme} />
                    <Paragraph theme={theme} style={{ paddingHorizontal: 16, paddingBottom: 8 }}>{IDIOM_MEANING}</Paragraph>
                    <Divider theme={theme} />
                    <List.Item title='用法說明' theme={theme} />
                    <Paragraph theme={theme} style={{ paddingHorizontal: 16, paddingBottom: 8 }}>{IDIOM_USAGE}</Paragraph>
                    <Divider theme={theme} />
                    <List.Item title='例句' theme={theme} />
                    <Paragraph theme={theme} style={{ paddingHorizontal: 16, paddingBottom: 8 }}>{IDIOM_EXAMPLE}</Paragraph>
                    <Divider theme={theme} />
                    <List.Item title='典故說明' theme={theme} />
                    <Paragraph theme={theme} style={{ paddingHorizontal: 16, paddingBottom: 8 }}>{IDIOM_SOURCE}</Paragraph>
                </ScrollView>
            )
        };

        return (
            <Stack.Navigator>
                <Stack.Screen name="DICTIONAY_MAIN"
                    component={DictionaryMainPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name="IDIOM_PAGE"
                    component={IdiomPage}
                    options={({ route }) => ({
                        title: route.params.title,
                        headerStyle: { backgroundColor: theme.colors.surface },
                        headerRight: () => (<TouchableOpacity>
                            <Icon name={this.state.isFavorite ? 'heart' : 'heart-outline'}
                                size={24}
                                style={{ marginRight: 16 }}
                                color={theme.colors.accent}
                                onPress={() => {
                                    this.setState({ isFavorite: !this.state.isFavorite });
                                }} />
                        </TouchableOpacity>)
                    })}
                />
            </Stack.Navigator>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default DictionaryPage;