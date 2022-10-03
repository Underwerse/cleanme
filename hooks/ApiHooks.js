import {useEffect, useState} from 'react';

const apiUrl = 'http://media.mw.metropolia.fi/wbma/';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const loadMedia = async () => {
    try {
      const response = await fetch(apiUrl + 'media?limit=7');
      const json = await response.json();
      // console.log(json);
      const allMediaData = json.map(async (mediaItem) => {
        const response = await fetch(apiUrl + 'media/' + mediaItem.file_id);
        return await response.json();
      });

      setMediaArray(await Promise.all(allMediaData));

      console.table(mediaArray);
    } catch (error) {
      console.log('media fetch failed', error);
    }
  };

  useEffect(() => {
    loadMedia();
  });

  return {mediaArray};
};

const useUser = () => {
  // #TODO do that later
};

export {useMedia, useUser};
