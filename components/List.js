import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = ({navigation, myFilesOnly = false, favorites = false}) => {
  const {mediaArray, loading} = useMedia(myFilesOnly);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          myFilesOnly={myFilesOnly}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  favorites: PropTypes.bool,
};

export default List;
