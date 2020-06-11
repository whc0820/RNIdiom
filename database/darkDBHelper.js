import Realm from 'realm';
export const DARK_SCHEMA = 'Dark';

export const DarkSchema = {
    name: DARK_SCHEMA,
    properties: {
        value: 'bool'
    }
};

const databaseOptions = {
    schema: [DarkSchema]
};

export const isDarkExist = () => {
    console.log(isDarkExist);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let dark = realm.objects('Dark');
            if (dark.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((error) => {
            reject(error);
        });
    })
};

export const newDark = () => {
    console.log(newDark);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                realm.create('Dark', { value: false });
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export const isDark = () => {
    console.log(isDark);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            resolve(realm.objects('Dark')[0].value);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const updateDark = (value) => {
    console.log(updateDark);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                let dark = realm.objects('Dark')[0];
                dark.value = value;
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export default new Realm(databaseOptions);