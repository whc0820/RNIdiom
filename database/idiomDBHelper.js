import Realm from 'realm';
export const IDIOM_SCHEMA = 'Idiom';

export const IdiomSchema = {
    name: IDIOM_SCHEMA,
    properties: {
        id: 'string',
        isLearned: 'bool',
        isFavorite: 'bool'
    }
};

const databaseOptions = {
    schema: [IdiomSchema]
};

export const isIdiomExist = (id) => {
    console.log(isIdiomExist);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let idioms = realm.objects(IDIOM_SCHEMA);
            if (idioms.filtered(`id == "${id}"`).length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

export const newIdiom = (id) => {
    console.log(newIdiom);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            realm.write(() => {
                realm.create(IDIOM_SCHEMA, {
                    id: id,
                    isLearned: false,
                    isFavorite: false
                });
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getIdiom = (id) => {
    console.log(getIdiom);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let idioms = realm.objects(IDIOM_SCHEMA);
            let idiom = idioms.filtered(`id == "${id}"`)[0];
            resolve(idiom);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getAllIdioms = () => {
    console.log(getAllIdioms);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let idioms = realm.objects(IDIOM_SCHEMA);
            idioms = Object.values(JSON.parse(JSON.stringify(idioms)));
            resolve(idioms);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const updateIdiom = (id, isLearned, isFavorite) => {
    console.log(updateIdiom);
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions).then((realm) => {
            let idioms = realm.objects(IDIOM_SCHEMA);
            let idiom = idioms.filtered(`id == "${id}"`)[0];
            realm.write(() => {
                idiom.id = id;
                idiom.isLearned = isLearned;
                idiom.isFavorite = isFavorite;
                resolve();
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

export default new Realm(databaseOptions);