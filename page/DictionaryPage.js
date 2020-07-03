import React from 'react';
import { StyleSheet, View, TouchableOpacity, SectionList, Keyboard } from 'react-native';
import { Searchbar, Divider, Text } from 'react-native-paper';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import darkRealm from '../database/darkDBHelper';
import PAGE_CONFIG from '../page/page-config.json';
import Idioms from '../resources/idioms.json';
import IdiomPage from '../page/IdiomPage';

const Stack = createStackNavigator();

let mQuery = '';

class DictionaryPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false,
            pinyinObjs: [],
            sourcePinyinObjs: [],
            isFavorite: false,
        };

        darkRealm.addListener('change', this.updateDark);
        Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
        Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    };

    componentDidMount() {
        this.updateDark();

        const PINYINS = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ',
            'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄤ', 'ㄥ', 'ㄦ'];
        let pinyinObjs = [];
        for (let pinyin of PINYINS) {
            let pinyinObj = {
                title: pinyin,
                data: []
            };

            let checkIdiomIsExist = (id) => {
                for (let idiom of pinyinObj.data) {
                    if (idiom.id === id) {
                        return true;
                    }
                }
                return false;
            };

            for (let idiom of Idioms) {
                let idiomId = idiom.id;
                let idiomPinyin = idiom.pinyin;
                if (idiomPinyin.startsWith(pinyin) && !checkIdiomIsExist(idiomId)) {
                    pinyinObj.data.push(idiom);
                }
            }

            if (pinyinObj.data.length > 0) {
                pinyinObjs.push(pinyinObj);
            }
        }

        this.setState({
            pinyinObjs,
            sourcePinyinObjs: pinyinObjs
        });
    };

    componentWillUnmount = () => {
        darkRealm.removeAllListeners();
    };

    updateDark = () => {
        isDark().then((dark) => {
            this.setState({ dark });
        });
    };

    onKeyboardDidShow = () => {
        mQuery = '';
    };

    onKeyboardDidHide = () => {
        console.log(mQuery);
        if (mQuery === '') {
            this.setState({ pinyinObjs: this.state.sourcePinyinObjs });
        } else {
            let pinyinObjs = [];
            for (let pinyinObj of this.state.pinyinObjs) {
                let newPinyinObj = {
                    'title': pinyinObj.title,
                    'data': []
                };
                for (let idiom of pinyinObj.data) {
                    if (idiom.title.includes(mQuery)) {
                        newPinyinObj.data.push(idiom);
                    }
                }
                if (newPinyinObj.data.length > 0) {
                    pinyinObjs.push(newPinyinObj);
                }
            }
            this.setState({ pinyinObjs });
        }
    };

    onQueryChange = (query) => {
        mQuery = query;
    };

    onPressIdiom = (navigation, item) => {
        navigation.navigate(PAGE_CONFIG.IDIOM.ROUTE, item);
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        const renderSectionHeader = ({ section: { title } }) => {
            return (
                <View style={{
                    padding: 16,
                    backgroundColor: theme.colors.background,
                }}>
                    <Text style={{ color: theme.colors.accent }}>{title}</Text>
                </View>
            );
        };

        const dictionaryMainPage = ({ navigation }) => {
            return (
                <View style={[styles.container]}>
                    <Searchbar
                        onChangeText={this.onQueryChange}
                        theme={theme}
                        style={{ backgroundColor: theme.colors.surface, elevation: 0 }}
                        inputStyle={{ color: theme.colors.onSurface }}
                    />
                    <SectionList
                        sections={this.state.pinyinObjs}
                        keyExtractor={(item, index) => item + index}
                        renderSectionHeader={renderSectionHeader}
                        renderItem={({ item }) => <View>
                            <TouchableOpacity
                                style={{ padding: 16, backgroundColor: theme.colors.surface }}
                                onPress={() => this.onPressIdiom(navigation, item)}>
                                <Text theme={theme}>{item.title}</Text>
                            </TouchableOpacity>
                            <Divider theme={theme} />
                        </View>}
                        stickySectionHeadersEnabled={true}
                    />
                </View>
            );
        };

        const idiomPage = ({ route, navigation }) => <IdiomPage dark={this.state.dark} idiom={route.params} navigation={navigation} />

        return (
            <Stack.Navigator>
                <Stack.Screen name={PAGE_CONFIG.DICTIONARY_MAIN.ROUTE} component={dictionaryMainPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name={PAGE_CONFIG.IDIOM.ROUTE} component={idiomPage}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }} />
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