import Realm from 'realm';
export const HISTORY_SCHEMA = 'History';

export const HistorySchema = {
    name: HISTORY_SCHEMA,
    properties: {
        'date': 'string',
        'data': 'string'
    }
};

const databaseOptions = {
    schema: [HistorySchema]
};

export const isHistoryExist = (dateString) => {
    console.log(isHistoryExist);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let histories = realm.objects(HISTORY_SCHEMA);
            if (histories.filtered(`date == "${dateString}"`).length === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

export const newHistory = (dateString, dataString) => {
    console.log(newHistory);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                realm.create(HISTORY_SCHEMA, {
                    'date': dateString,
                    'data': dataString
                });
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getHistoryData = (dateString) => {
    console.log(getHistoryData);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let histories = realm.objects(HISTORY_SCHEMA);
            let history = histories.filtered(`date == "${dateString}"`)[0];
            resolve(JSON.parse(history.data));
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getAllHistories = () => {
    console.log(getAllHistories);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let histories = realm.objects(HISTORY_SCHEMA);
            histories = Object.values(JSON.parse(JSON.stringify(histories)));
            resolve(histories);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const updateHistory = (dateString, dataString) => {
    console.log(updateHistory);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let histories = realm.objects(HISTORY_SCHEMA);
            let history = histories.filtered(`date == "${dateString}"`)[0];
            realm.write(() => {
                history.data = dataString;
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export default new Realm(databaseOptions);