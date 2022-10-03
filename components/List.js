import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';

const List = () => {
  const {mediaArray} = useMedia();

  return (
    <FlatList
      data={mediaArray}
      key={(item) => {
        item.file_id.toString();
      }}
      renderItem={({item}) => <ListItem singleMedia={item} />}
    />
  );
};

export default List;
