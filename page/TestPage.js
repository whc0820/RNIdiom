import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Paragraph, List, Divider, Text, Snackbar } from 'react-native-paper';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import PAGE_CONFIG from './page-config.json';
import idioms from '../resources/idioms.json';
import { updateHistory } from '../database/historyDBHelper';

const SNACKBAR_DURATION = 1000;

let randomIdiom = () => {
    return idioms[Math.floor(Math.random() * idioms.length)];
};

class TestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dark: false,
            snackbar: false,
            snackbarMsg: '',
            snackbarColor: '',
            idioms: [],
            questions: [],
        };

        this.onPressOption = this.onPressOption.bind(this);
        this.onPressDone = this.onPressDone.bind(this);
        this.onDismissSnackbar = this.onDismissSnackbar.bind(this);
    };

    componentDidMount() {
        let questions = [];
        for (let idiom of this.props.idioms) {
            let question = {};
            question.id = idiom.id;
            question.title = idiom.title;
            question.wrongCount = 0;
            question.options = [];
            question.options.push({
                'description': idiom.description,
                'selected': false,
                'isAnswer': true,
                'isError': false
            });
            for (let i = 0; i < 3; i++) {
                question.options.push({
                    'description': randomIdiom().description,
                    'selected': false,
                    'isAnswer': false,
                    'isError': false
                });
            }
            question.options.sort(() => Math.random() - 0.5);
            questions.push(question);
        }
        this.setState({
            dark: this.props.dark,
            idioms: this.props.idioms,
            questions
        });
    };

    onDismissSnackbar = () => {
        this.setState({
            snackbar: false
        });
    };

    onPressOption = (questionIndex, optionIndex) => {
        let questions = this.state.questions;
        for (let question of questions) {
            if (questions.indexOf(question) === questionIndex) {
                let options = question.options;
                for (let option of options) {
                    if (options.indexOf(option) === optionIndex) {
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                }
            }
        }
        this.setState({ questions });
    };

    onPressDone = () => {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        let questions = this.state.questions;

        for (let question of questions) {
            let isDone = false;
            for (let option of question.options) {
                if (option.selected === true) {
                    isDone = true;
                    break;
                }
            }
            if (!isDone) {
                this.setState({
                    snackbar: true,
                    snackbarColor: theme.colors.caution,
                    snackbarMsg: '測驗尚未完成!'
                });
                return;
            }
        }

        for (let question of questions) {
            for (let option of question.options) {
                if (option.selected === true && !option.isAnswer) {
                    option.isError = true;
                    question.wrongCount += 1;
                    this.setState({
                        questions,
                        snackbar: true,
                        snackbarColor: theme.colors.error,
                        snackbarMsg: `${question.title} 答案錯誤!`
                    });
                    return;
                }
            }
        }

        let dataString = [];
        for (let question of questions) {
            let proficiency;
            switch (question.wrongCount) {
                case 0:
                    proficiency = 1;
                    break;
                case 1:
                    proficiency = 0.66;
                    break;
                case 2:
                    proficiency = 0.33;
                    break;
                default:
                    proficiency = 0;
                    break;
            }
            dataString.push({
                'id': question.id,
                'title': question.title,
                'proficiency': proficiency
            });
        }

        let dateString = this.props.dateString;
        dataString = JSON.stringify(dataString);
        updateHistory(dateString, dataString).then(() => {
            this.setState({
                snackbar: true,
                snackbarColor: theme.colors.success,
                snackbarMsg: `恭喜全部答案正確!`
            });

            setTimeout(() => {
                this.props.navigation.navigate(PAGE_CONFIG.DASHBOARD_MAIN.ROUTE);
            }, 1000);
        });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        let questionsView = [];
        for (let question of this.state.questions) {
            let optionsView = [];
            for (let option of question.options) {
                let optionView = <>
                    <TouchableOpacity style={styles.option}
                        onPress={() => this.onPressOption(this.state.questions.indexOf(question), question.options.indexOf(option))}>
                        <Paragraph theme={theme}
                            style={{ color: option.isError ? theme.colors.error : option.selected ? theme.colors.accent : theme.colors.onSurface }}>
                            {option.description}
                        </Paragraph>
                    </TouchableOpacity>
                    {
                        question.options.indexOf(option) !== 3 ?
                            <Divider theme={theme} /> : <></>
                    }

                </>
                optionsView.push(optionView);
            }

            let questionView = <>
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Card.Title title={question.title} titleStyle={{ color: theme.colors.onSurface }} />
                    <Card.Content>
                        {optionsView}
                    </Card.Content>
                </Card>
            </>

            questionsView.push(questionView);
        }

        return (<>
            <List.Item title={'請選出正確的釋義'}
                theme={theme}
                style={{ paddingHorizontal: 8 }}
                right={props => <>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.onPressDone(); }}>
                        <Text theme={theme}>完成</Text>
                        <List.Icon icon='arrow-right'
                            color={theme.colors.accent}
                            style={{ marginHorizontal: 0 }} />
                    </TouchableOpacity>
                </>} />
            <ScrollView style={styles.container}>
                {questionsView}
            </ScrollView>
            <Snackbar visible={this.state.snackbar}
                onDismiss={this.onDismissSnackbar}
                duration={SNACKBAR_DURATION}
                style={{ backgroundColor: this.state.snackbarColor }}>
                {this.state.snackbarMsg}
            </Snackbar>
        </>);
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    },
    card: {
        marginVertical: 8,
        padding: 4,
    },
    option: {
        flex: 1,
        paddingVertical: 8,
    }
});

export default TestPage;