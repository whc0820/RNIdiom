import React from 'react';
import { StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Text, Card, Paragraph, List, Divider } from 'react-native-paper';
import { LineChart, ProgressChart, ContributionGraph } from 'react-native-chart-kit';

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isDark } from '../database/darkDBHelper';
import realm from '../database/darkDBHelper';
import Idioms from '../resources/idioms.json';
import PAGECONFIG from './page-config.json';
import TestPage from './TestPage';

let randomNumber = (max) => {
    return Math.floor(Math.random() * max);
};

const Stack = createStackNavigator();

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: false,
            idioms: []
        };

        realm.addListener('change', this.updateUI);
    };

    componentDidMount() {
        isDark().then((value) => {
            this.setState({ dark: value });
        });

        let idioms = [];
        for (let i = 0; i < 5; i++) {
            let idiom = {};
            do {
                idiom = Idioms[randomNumber(100)];
            } while (idioms.includes(idiom));
            idioms.push(idiom);
        }
        this.setState({ idioms });
    };

    componentWillUnmount() {
        realm.removeAllListeners();
    };

    updateUI = () => {
        isDark().then((value) => {
            this.setState({ dark: value });
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

        const data = {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                {
                    data: [1, 2, 3, 5, 3, 2, 2],
                    color: (opacity = 1) => `rgba(3, 218, 198, ${opacity})`,
                    strokeWidth: 2
                }
            ]
        };

        const screenWidth = Dimensions.get("window").width - 32;
        const chartConfig = {
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientFromOpactiy: 1,
            backgroundGradientTo: theme.colors.surface,
            backgroundGradientToOpactiy: 1,
            strokeWidth: 2,
            barPercentage: 0.5,

            color: (opacity = 1) => `rgba(3, 218, 198, ${opacity})`,
            barPercentage: 0.5,
        };

        const progressData = {
            labels: ["Swim", "Bike", "Run"],
            data: [0.4, 0.6, 0.8]
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
            return (
                <ScrollView style={styles.container}>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title={`今日成語`} titleStyle={{ color: theme.colors.onSurface }} />
                        {idiomViews}
                        <List.Item theme={theme} style={{ padding: 0 }}
                            right={props => <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => { navigation.navigate(PAGECONFIG.TEST.ROUTE); }}>
                                <Text theme={theme}>開始測驗</Text>
                                <List.Icon icon='arrow-right' color={theme.colors.accent} />
                            </TouchableOpacity>}

                        />
                    </Card>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title='Correctness' titleStyle={{ color: theme.colors.onSurface }} />
                        <LineChart
                            data={data}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                        />
                    </Card>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title='Progress' titleStyle={{ color: theme.colors.onSurface }} />
                        <ProgressChart
                            data={progressData}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            hideLegend={false}
                        />
                    </Card>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Card.Title title='Day' titleStyle={{ color: theme.colors.onSurface }} />
                        <ContributionGraph
                            values={commitsData}
                            endDate={new Date('2017-04-01')}
                            numDays={105}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                        />

                    </Card>
                </ScrollView>
            );
        };

        const testPage = ({ navigation }) => {
            return (
                <TestPage navigation={navigation}
                    dark={this.state.dark}
                    idioms={this.state.idioms} />
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