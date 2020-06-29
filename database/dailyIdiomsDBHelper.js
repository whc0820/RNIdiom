import Realm from 'realm';
export const DAILY_IDIOMS_SCHEMA = 'Daily_Idioms_Schema';

export const DailyIdiomsSchema = {
    name: DAILY_IDIOMS_SCHEMA,
    properties: {
        value: 'int'
    }
};

const databaseOptions = {
    schema: [DailyIdiomsSchema]
};

export const isDailyIdiomsExist = () => {
    console.log(isDailyIdiomsExist);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let dailyIdioms = realm.objects(DAILY_IDIOMS_SCHEMA);
            if (dailyIdioms.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((error) => {
            reject(error);
        });
    })
};

export const newDailyIdioms = () => {
    console.log(newDailyIdioms);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                realm.create(DAILY_IDIOMS_SCHEMA, { 
                    value: 2
                 });
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getDailyIdioms = () => {
    console.log(getDailyIdioms);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let dailyIdioms = realm.objects(DAILY_IDIOMS_SCHEMA)[0].value;
            resolve(dailyIdioms);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const updateDailyIdioms = (value) => {
    console.log(updateDailyIdioms);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                let dailyIdioms = realm.objects(DAILY_IDIOMS_SCHEMA)[0];
                dailyIdioms.value = value;
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export default new Realm(databaseOptions);