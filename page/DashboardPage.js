import React from 'react';
import { StyleSheet, ScrollView, Dimensions, TouchableOpacity, View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Text, Card, Paragraph, List, Divider } from 'react-native-paper';
import { LineChart, ProgressChart, ContributionGraph } from 'react-native-chart-kit';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import { isHistoryExist, newHistory, getHistoryData, getAllHistories } from '../database/historyDBHelper';
import darkRealm from '../database/darkDBHelper';
import historyRealm from '../database/historyDBHelper';
import Idioms from '../resources/idioms.json';
import PAGECONFIG from './page-config.json';
import TestPage from './TestPage';

const randomNumber = (max) => {
    return Math.floor(Math.random() * max);
};

const getIdiomById = (id) => {
    for (let idiom of Idioms) {
        if (id == idiom.id) {
            return idiom;
        }
    }
};

const Stack = createStackNavigator();

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: false,
            idioms: [],
            histories: [],
            dateString: ''
        };

        darkRealm.addListener('change', this.updateDark);
        historyRealm.addListener('change', this.updateIdioms);
    };

    componentDidMount() {
        this.updateDark();

        let date = new Date();
        let dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        this.setState({ dateString });

        isHistoryExist(dateString).then((value) => {
            if (!value) {
                let dataString = [];
                for (let i = 0; i < 5; i++) {
                    let idiom = {};
                    do {
                        idiom = Idioms[randomNumber(Idioms.length)];
                    } while (dataString.includes(idiom));
                    dataString.push({
                        'id': idiom.id,
                        'title': idiom.title,
                        'proficiency': 0
                    });
                }
                newHistory(dateString, JSON.stringify(dataString));
            }

            this.updateIdioms();
        });
    };

    componentWillUnmount() {
        darkRealm.removeAllListeners();
        historyRealm.removeAllListeners();
    };

    updateDark = () => {
        isDark().then((value) => {
            this.setState({ dark: value });
        });
    };

    updateIdioms = () => {
        getHistoryData(this.state.dateString).then((data) => {
            let idioms = [];
            for (let d of data) {
                let idiom = getIdiomById(d.id);
                idiom.proficiency = d.proficiency;
                idioms.push(idiom);
            }
            getAllHistories().then((histories) => {
                this.setState({ idioms, histories });
            });
        });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;

        let idiomViews = [];
        for (let idiom of this.state.idioms) {
            const IDIOM_ID = idiom['id'];
            const IDIOM_TITLE = idiom['title'];
            const IDIOM_PINYIN = idiom['pinyin'];
            const IDIOM_PINYIN_EN = idiom['pinyin-en'];
            const IDIOM_MEANING = idiom['meaning'];
            const IDIOM_SOURCE = idiom['source'];
            const IDIOM_EXAMPLE = idiom['example'];
            const IDIOM_DESCRIPTION = idiom['description'];
            const IDIOM_USAGE = idiom['usage'];

            idiomViews.push(<>
                <List.Accordion theme={theme} title={IDIOM_TITLE} style={{ paddingVertical: 8 }} >
                    <List.Item title='注音' theme={theme}
                        right={props => <Text theme={theme} style={{ alignSelf: 'center' }}>{IDIOM_PINYIN}</Text>} />
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
                </List.Accordion>
                <Divider theme={theme} />
            </>);
        }

        const screenWidth = Dimensions.get("window").width - 32;
        const chartConfig = {
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientFromOpactiy: 1,
            backgroundGradientTo: theme.colors.surface,
            backgroundGradientToOpactiy: 1,
            strokeWidth: 2,
            barPercentage: 0.5,
            color: (opacity = 1) => `rgba(3, 218, 198, ${opacity})`,
        };
        const commitsData = [
            { date: "2017-01-02", count: 1 },
            { date: "2017-01-03", count: 2 },
            { date: "2017-01-04", count: 3 },
            { date: "2017-01-05", count: 4 },
            { date: "2017-01-06", count: 5 },
            { date: "2017-01-30", count: 2 },
            { date: "2017-01-31", count: 3 },
            { date: "2017-03-01", count: 2 },
            { date: "2017-04-02", count: 4 },
            { date: "2017-03-05", count: 2 },
            { date: "2017-02-30", count: 4 }
        ];

        const dashboardView = ({ navigation }) => {
            let progressChartData = {
                labels: [],
                data: []
            };
            for (let idiom of this.state.idioms) {
                progressChartData.labels.push(idiom.title);
                progressChartData.data.push(idiom.proficiency);
            }

            let lineChartView = [];
            let lineChartData = {
                labels: [],
                datasets: [{
                    data: [],
                    color: (opacity = 1) => `rgba(3, 218, 198, ${opacity})`,
                    strokeWidth: 2
                }]
            };

            let histories = JSON.parse(JSON.stringify(this.state.histories));
            for (let history of histories.reverse()) {
                if (lineChartData.labels.length >= 5) {
                    break;
                }
                lineChartData.labels.push(history.date);
                let data = JSON.parse(history.data);
                let sum = 0;
                for (let idiom of data) {
                    sum += idiom.proficiency * 100;
                }
                lineChartData.datasets[0].data.push(sum / data.length);
            }
            lineChartData.labels.reverse();
            lineChartData.datasets[0].data.reverse();

            if (lineChartData.labels.length > 0) {
                lineChartView.push(<>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title='平均熟練度' titleStyle={{ color: theme.colors.onSurface }} />
                        <LineChart
                            data={lineChartData}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig} />
                    </Card>
                </>);
            }

            return (
                <ScrollView style={styles.container}>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title={`今日成語`} titleStyle={{ color: theme.colors.onSurface }} />
                        {idiomViews}
                        <List.Item theme={theme} style={{ padding: 0 }}
                            right={props => <>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => { navigation.navigate(PAGECONFIG.TEST.ROUTE); }}>
                                    <Text theme={theme}>開始測驗</Text>
                                    <List.Icon icon='arrow-right' color={theme.colors.accent} />
                                </TouchableOpacity>
                            </>} />
                    </Card>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title='各成語熟練度' titleStyle={{ color: theme.colors.onSurface }} />
                        <ProgressChart
                            data={progressChartData}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            hideLegend={false} />
                    </Card>
                    {lineChartView}
                    {/* <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title='每日學習量' titleStyle={{ color: theme.colors.onSurface }} />
                        <ContributionGraph
                            values={commitsData}
                            endDate={new Date('2017-04-01')}
                            numDays={100}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig} />
                    </Card> */}
                </ScrollView>
            );
        };

        const testPage = ({ navigation }) => {
            return (
                <TestPage navigation={navigation}
                    dark={this.state.dark}
                    idioms={this.state.idioms}
                    dateString={this.state.dateString} />
            );
        };

        return (
            <Stack.Navigator>
                <Stack.Screen name={PAGECONFIG.DASHBOARD_MAIN.ROUTE}
                    component={dashboardView}
                    options={{
                        headerShown: false,
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }} />
                <Stack.Screen name={PAGECONFIG.TEST.ROUTE}
                    component={testPage}
                    options={{
                        headerShown: false,
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }} />
            </Stack.Navigator>
        );
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
    paragraph: {
        paddingHorizontal: 16,
        paddingBottom: 16
    }
});

export default DashboardPage;