import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = ({navigation, myFilesOnly = false, myFavoritesOnly = false}) => {
  const {mediaArray, loading} = useMedia(myFilesOnly, myFavoritesOnly);
  console.log('List load', loading);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          myFilesOnly={myFilesOnly}
          myFavoritesOnly={myFavoritesOnly}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  myFavoritesOnly: PropTypes.bool,
};

export default List;
