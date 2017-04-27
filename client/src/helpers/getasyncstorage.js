import { AsyncStorage } from 'react-native';
import _ from 'lodash';

// 4 different cases for type:
// case 1 is Not liked => liked
// case 2 is Not liked => disliked
// case 3 is liked => disliked
// case 4 is disliked => liked
// case 5 is liked => notliked
// case 6 is disliked => notdisliked

const saveVote = async (type, id) => {
  try {
    if (type === 1) {
      let object = await AsyncStorage.getItem('liked');
      object = JSON.parse(object);
      if (!object) object = [];
      object.push(id);
      await AsyncStorage.setItem('liked', JSON.stringify(object));
    } else if (type === 2) {
        let object = await AsyncStorage.getItem('disliked');
        object = JSON.parse(object);
        if (!object) object = [];
        object.push(id);
        await AsyncStorage.setItem('disliked', JSON.stringify(object));
    } else if (type === 3) {
        let object = await AsyncStorage.getItem('liked');
        let object2 = await AsyncStorage.getItem('disliked');
        object = JSON.parse(object);
        object2 = JSON.parse(object2);
        if (!object) object = [];
        if (!object2) object2 = [];
        object = _.remove(object, (objId) => (objId !== id));
        object2.push(id);
        await AsyncStorage.setItem('liked', JSON.stringify(object));
        await AsyncStorage.setItem('disliked', JSON.stringify(object2));
    } else if (type === 4) {
        let object = await AsyncStorage.getItem('disliked');
        let object2 = await AsyncStorage.getItem('liked');
        object = JSON.parse(object);
        object2 = JSON.parse(object2);
        if (!object) object = [];
        if (!object2) object2 = [];
        object = _.remove(object, (objId) => (objId !== id));
        object2.push(id);
        await AsyncStorage.setItem('disliked', JSON.stringify(object));
        await AsyncStorage.setItem('liked', JSON.stringify(object2));
    } else if (type === 5) {
        let object = await AsyncStorage.getItem('liked');
        object = JSON.parse(object);
        if (!object) object = [];
        object = _.remove(object, (objId) => (objId !== id));
        await AsyncStorage.setItem('liked', JSON.stringify(object));
    } else if (type === 6) {
        let object = await AsyncStorage.getItem('disliked');
        object = JSON.parse(object);
        if (!object) object = [];
        object = _.remove(object, (objId) => (objId !== id));
        await AsyncStorage.setItem('disliked', JSON.stringify(object));
    }
  } catch (error) {
    // console.log(error); // Should eventually be used to notify user.
  }
};

export default saveVote;
