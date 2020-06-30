import React from 'react';
import { StyleSheet, View, TouchableOpacity, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Searchbar, Divider, Text } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import realm from '../database/darkDBHelper';
import PAGE_CONFIG from '../page/page-config.json';
import idioms from '../resources/idioms.json';

import IdiomPage from '../page/IdiomPage';


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
        navigation.navigate(PAGE_CONFIG.IDIOM.ROUTE, item);
        if (item.id.endsWith('5')) {
            this.setState({ isFavorite: true });
        }
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

        const idiomPage = ({ route }) => <IdiomPage route={route} dark={this.state.dark} />

        return (
            <Stack.Navigator>
                <Stack.Screen name={PAGE_CONFIG.DICTIONARY_MAIN.ROUTE}
                    component={dictionaryMainPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name={PAGE_CONFIG.IDIOM.ROUTE}
                    component={idiomPage}
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