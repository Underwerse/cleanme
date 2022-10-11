import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = ({
  navigation,
  myFilesOnly = false,
  myFavoritesOnly = false,
  filterWord = '',
}) => {
  const {mediaArray, loading} = useMedia(
    myFilesOnly,
    myFavoritesOnly,
    filterWord
  );
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
          filterWord={filterWord}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  myFavoritesOnly: PropTypes.bool,
  filterWord: PropTypes.string,
};

export default List;
