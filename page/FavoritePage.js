import React from 'react';
import { StyleSheet, View, TouchableOpacity, SectionList } from 'react-native';
import { Searchbar, Divider, Text } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import darkRealm from '../database/darkDBHelper';
import { getAllIdioms } from '../database/idiomDBHelper';
import idiomRealm from '../database/idiomDBHelper';
import PAGE_CONFIG from '../page/page-config.json';
import IdiomPage from '../page/IdiomPage';
import mIdioms from '../resources/idioms.json';

const Stack = createStackNavigator();

class FavoritePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false,
            data: [],
            isFavorite: false
        };

        darkRealm.addListener('change', this.updateDark);
        idiomRealm.addListener('change', this.updateData);
    };

    componentDidMount() {
        this.updateDark();
        this.updateData();
    };

    componentWillUnmount = () => {
        darkRealm.removeAllListeners();
        idiomRealm.removeAllListeners();
    };

    updateDark = () => {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    updateData = () => {
        getAllIdioms().then((idioms) => {
            const PINYINS = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ',
                'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄤ', 'ㄥ', 'ㄦ'];
            let data = [];
            for (let pinyin of PINYINS) {
                let obj = {
                    title: pinyin,
                    data: []
                };

                let getIdiomById = (id) => {
                    for (let idiom of mIdioms) {
                        if (idiom.id === id) {
                            return idiom;
                        }
                    }
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
                    if (idiom.isFavorite) {
                        idiom = getIdiomById(idiom.id);
                        let idiomId = idiom.id;
                        let idiomPinyin = idiom.pinyin;
                        if (idiomPinyin.startsWith(pinyin) && !checkIdiomIsExist(idiomId)) {
                            obj.data.push(idiom);
                        }
                    }
                }

                if (obj.data.length > 0) {
                    data.push(obj);
                }
            }

            this.setState({ data });
        });
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

        const favoriteMainPage = ({ navigation }) => {
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

        const idiomPage = ({ route, navigation }) => <IdiomPage dark={this.state.dark} idiom={route.params} navigation={navigation} />

        return (
            <Stack.Navigator>
                <Stack.Screen name={PAGE_CONFIG.FAVORITE_MAIN.ROUTE} component={favoriteMainPage}
                    options={{ headerShown: false }} />
                <Stack.Screen name={PAGE_CONFIG.IDIOM.ROUTE} component={idiomPage} />
            </Stack.Navigator>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default FavoritePage;