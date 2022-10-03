import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {doFetch} from '../utils/http';
import {apiUrl, applicationTag} from '../utils/variables';

const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);

  const loadMedia = async () => {
    try {
      if (myFilesOnly) {
        let jsonByTag = await useTag().getFilesByTag(applicationTag);
        console.log('User from ApiHooks', user);
        jsonByTag = jsonByTag.filter((file) => file.user_id === user.user_id);
        const allMediaDataByTag = jsonByTag.map(async (mediaItem) => {
          return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
        });

        setMediaArray(await Promise.all(allMediaDataByTag));
      } else {
        const json = await doFetch(apiUrl + 'media?limit=20');
        const allMediaData = json.map(async (mediaItem) => {
          return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
        });

        setMediaArray(await Promise.all(allMediaData));
      }
    } catch (error) {
      console.log('media fetch failed', error);
      throw new Error('Get media error: ', error);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);

  const postMedia = async (token, formData) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: formData,
    };

    try {
      return await doFetch(apiUrl + 'media', options);
    } catch (error) {
      console.log('postMedia error:', error.message);
    }
  };

  const putMedia = async (token, data, fileId) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };

    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      console.log('putMedia error:', error.message);
    }
  };

  const deleteMedia = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };

    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      console.log('deleteMedia error:', error.message);
    }
  };

  return {mediaArray, postMedia, putMedia, deleteMedia};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(apiUrl + 'login', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const checkUsername = async (username) => {
    try {
      const result = await doFetch(apiUrl + 'users/username/' + username);
      console.log('checkUsername(): ', result);
      return result.available;
    } catch (error) {
      console.log('CheckUsername failed', error.message);
    }
  };

  const getUserByToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      return await doFetch(apiUrl + 'users/user', options);
    } catch (error) {
      console.log('Get user by token failed', error.message);
    }
  };

  const postUser = async (data) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      };
      return await doFetch(apiUrl + 'users', options);
    } catch (error) {
      console.log('Post user failed', error.message);
    }
  };

  const putUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return await doFetch(apiUrl + 'users', options);
  };

  const getUserById = async (userId, token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      return await doFetch(apiUrl + 'users/' + userId, options);
    } catch (error) {
      console.log('Get user by ID failed', error.message);
    }
  };

  return {checkUsername, getUserByToken, postUser, putUser, getUserById};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(apiUrl + 'tags/' + tag);
    } catch (error) {
      console.log('Files by tag fetch failed', error.message);
    }
  };

  const postTag = async (token, tag) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
    };
    try {
      return await doFetch(apiUrl + 'tags', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useFavourite = () => {
  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    return await doFetch(`${apiUrl}favourites`, options);
  };
  const getFavouritesByFileId = async (fileId) => {
    return await doFetch(`${apiUrl}favourites/file/${fileId}`);
  };
  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${apiUrl}favourites/file/${fileId}`, options);
  };
  return {postFavourite, getFavouritesByFileId, deleteFavourite};
};

export {useMedia, useLogin, useUser, useTag, useFavourite};
