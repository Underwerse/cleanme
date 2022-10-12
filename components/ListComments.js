import {useEffect} from 'react';
import {FlatList, LogBox} from 'react-native';
import PropTypes from 'prop-types';
import ListCommentsItem from './ListCommentsItem';

const ListComments = ({commentsArray, navigation}) => {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <FlatList
      data={commentsArray}
      keyExtractor={(item) => item.comment_id.toString()}
      renderItem={({item}) => (
        <ListCommentsItem navigation={navigation} singleMedia={item} />
      )}
      scrollEnabled={false}
    />
  );
};

ListComments.propTypes = {
  navigation: PropTypes.object,
  commentsArray: PropTypes.array,
};

export default ListComments;
