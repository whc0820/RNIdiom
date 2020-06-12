import Realm from 'realm';
export const NOTIFICATION_SCHEMA = 'Notification';

export const NotificationSchema = {
    name: NOTIFICATION_SCHEMA,
    properties: {
        value: 'bool'
    }
};

const databaseOptions = {
    schema: [NotificationSchema]
};

export const isNotificationExist = () => {
    console.log(isNotificationExist);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let notification = realm.objects(NOTIFICATION_SCHEMA);
            if (notification.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((error) => {
            reject(error);
        });
    })
};

export const newNotification = () => {
    console.log(newNotification);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                realm.create(NOTIFICATION_SCHEMA, { value: false });
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export const isNotification = () => {
    console.log(isNotification);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            resolve(realm.objects(NOTIFICATION_SCHEMA)[0].value);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const updateNotification = (value) => {
    console.log(updateNotification);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                let notification = realm.objects(NOTIFICATION_SCHEMA)[0];
                notification.value = value;
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export default new Realm(databaseOptions);