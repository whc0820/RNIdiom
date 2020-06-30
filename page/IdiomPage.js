import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, Text, List, Paragraph } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';

class IdiomPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false
        };
    };

    componentDidMount() {
        this.setState({ dark: this.props.dark });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        const idiom = this.props.route.params;
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
    paragraph: {
        paddingHorizontal: 16,
        paddingBottom: 8
    }
});

export default IdiomPage;