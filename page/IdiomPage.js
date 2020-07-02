import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, Text, List, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isIdiomExist, newIdiom, getIdiom, updateIdiom } from '../database/idiomDBHelper';

class IdiomPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false,
            idiom: {
                'id': '',
                'title': '',
                'pinyin': '',
                'pinyin-en': '',
                'meaing': '',
                'source': '',
                'example': '',
                'description': '',
                'usage': ''
            },
            isFavorite: false,
            isLearned: false
        };

        this.onPressFavorite = this.onPressFavorite.bind(this);
    };

    componentDidMount() {
        this.setState({
            dark: this.props.dark,
            idiom: this.props.idiom,
        });

        let id = this.props.idiom.id;
        isIdiomExist(id).then((value) => {
            if (value) {
                getIdiom(id).then((idiom) => {
                    this.setState({
                        isFavorite: idiom.isFavorite,
                        isLearned: idiom.isLearned
                    });
                });
            } else {
                newIdiom(id);
                this.setState({
                    isFavorite: false,
                    isLearned: false
                });
            }
        });
    };

    onPressFavorite = () => {
        let id = this.state.idiom.id;
        updateIdiom(id, this.state.isLearned, !this.state.isFavorite).then(() => {
            this.setState({ isFavorite: !this.state.isFavorite, snackbar: true });
        });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        const IDIOM_ID = this.state.idiom['id'];
        const IDIOM_TITLE = this.state.idiom['title'];
        const IDIOM_PINYIN = this.state.idiom['pinyin'];
        const IDIOM_PINYIN_EN = this.state.idiom['pinyin-en'];
        const IDIOM_MEANING = this.state.idiom['meaning'];
        const IDIOM_SOURCE = this.state.idiom['source'];
        const IDIOM_EXAMPLE = this.state.idiom['example'];
        const IDIOM_DESCRIPTION = this.state.idiom['description'];
        const IDIOM_USAGE = this.state.idiom['usage'];

        this.props.navigation.setOptions({
            title: IDIOM_TITLE,
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTitleStyle: { color: theme.colors.accent },
            headerRight: () => (
                <TouchableOpacity>
                    <Icon name={this.state.isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        style={{ marginRight: 16 }}
                        color={theme.colors.accent}
                        onPress={this.onPressFavorite} />
                </TouchableOpacity>)
        });

        return (
            <ScrollView style={styles.container}>
                <List.Item title='注音' theme={theme}
                    right={props => <Text theme={theme} style={{ alignSelf: 'center' }}>{IDIOM_PINYIN}</Text>} />
                <Divider theme={theme} />
                <List.Item title='漢語拼音' theme={theme}
                    right={props => <Text theme={theme} style={{ alignSelf: 'center' }}>{IDIOM_PINYIN_EN}</Text>} />
                <Divider theme={theme} />
                <List.Item title='釋義' theme={theme} />
                <Paragraph theme={theme} style={styles.paragraph}>{IDIOM_MEANING}</Paragraph>
                <Divider theme={theme} />
                <List.Item title='用法說明' theme={theme} />
                <Paragraph theme={theme} style={styles.paragraph}>{IDIOM_USAGE}</Paragraph>
                <Divider theme={theme} />
                <List.Item title='例句' theme={theme} />
                <Paragraph theme={theme} style={styles.paragraph}>{IDIOM_EXAMPLE}</Paragraph>
                <Divider theme={theme} />
                <List.Item title='典故說明' theme={theme} />
                <Paragraph theme={theme} style={styles.paragraph}>{IDIOM_SOURCE}</Paragraph>
            </ScrollView>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    },
    paragraph: {
        paddingHorizontal: 16,
        paddingBottom: 16
    }
});

export default IdiomPage;