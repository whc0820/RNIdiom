import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Divider, List, Text, Switch } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { CustomizedDarkTheme, CustomizedLightTheme } from '../themes';
import { isTimeExist, newTime, getTime, updateTime } from '../database/timeDBHelper';
import { isNotificationExist, newNotification, isNotification, updateNotification } from '../database/notificationDBHelper';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: false,
            notification: false,
            dateTimePicker: false,
            time: ''
        };
        this.onToggleNotification = this.onToggleNotification.bind(this);
        this.onToggleDateTimePicker = this.onToggleDateTimePicker.bind(this);
        this.onDateTimePickerConfirm = this.onDateTimePickerConfirm.bind(this);
        this.onDateTimePickerCancel = this.onDateTimePickerCancel.bind(this);
        this.onDateTimePickerHide = this.onDateTimePickerHide.bind(this);
    };

    componentDidMount() {
        console.log('componenetDidMount');

        this.setState({ dark: this.props.dark });

        isTimeExist().then((value) => {
            if (!value) {
                newTime();
            }

            getTime().then((time) => {
                this.setState({ time })
            });
        });

        isNotificationExist().then((value) => {
            if (!value) {
                newNotification();
            }

            isNotification().then((notification) => {
                this.setState({ notification });
            });
        });
    };

    onToggleNotification() {
        updateNotification(!this.state.notification).then(() => {
            this.setState({ notification: !this.state.notification });
        }).catch((error) => {
            throw (error);
        });
    };

    onToggleDateTimePicker() {
        this.setState({ dateTimePicker: true });
    };

    onDateTimePickerConfirm(selectedTime) {
        let hours = selectedTime.getHours();
        let minutes = selectedTime.getMinutes();
        updateTime(hours, minutes).then(() => {
            this.setState({ dateTimePicker: false });

            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            this.setState({ time: `${hours} : ${minutes}` });
        });
    };

    onDateTimePickerCancel() { };

    onDateTimePickerHide() {
        this.setState({ dateTimePicker: false });
    };

    render() {
        const theme = this.state.dark ? CustomizedDarkTheme : CustomizedLightTheme;
        return (
            <View style={styles.container}>
                <Divider theme={theme} />
                <List.Item title='Notification' theme={theme}
                    right={props =>
                        <Switch value={this.state.notification}
                            onValueChange={this.onToggleNotification} />
                    }
                />
                <Divider theme={theme} />
                <TouchableOpacity onPress={this.onToggleDateTimePicker}>
                    <List.Item title='Time' theme={theme}
                        right={props => <Text style={{ marginRight: 8, alignSelf: 'center', color: theme.colors.accent }}>{this.state.time}</Text>}
                    />
                </TouchableOpacity>
                <DateTimePickerModal isVisible={this.state.dateTimePicker}
                    mode='time'
                    display='spinner'
                    onConfirm={this.onDateTimePickerConfirm}
                    onCancel={this.onDateTimePickerCancel}
                    onHide={this.onDateTimePickerHide}
                />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: 'column'
    }
});

export default Notification;