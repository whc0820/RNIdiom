import Realm from 'realm';
export const TIME_SCHEMA = 'Time';

export const TimeSchema = {
    name: TIME_SCHEMA,
    properties: {
        hours: 'int',
        minutes: 'int'
    }
};

const databaseOptions = {
    schema: [TimeSchema]
};

export const isTimeExist = () => {
    console.log(isTimeExist);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let time = realm.objects(TIME_SCHEMA);
            if (time.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((error) => {
            reject(error);
        });
    })
};

export const newTime = () => {
    console.log(newTime);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                realm.create(TIME_SCHEMA, { 
                    hours: 0,
                    minutes: 0
                 });
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getTime = () => {
    console.log(getTime);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let time = realm.objects(TIME_SCHEMA)[0];
            resolve(`${time.hours} : ${time.minutes}`);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const updateTime = (hours, minutes) => {
    console.log(updateTime);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                let time = realm.objects(TIME_SCHEMA)[0];
                time.hours = hours;
                time.minutes = minutes;
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export default new Realm(databaseOptions);