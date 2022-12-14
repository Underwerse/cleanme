import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {apiUrl, applicationTag} from '../utils/variables';
import {doFetch} from '../utils/http';

const useMedia = (myFilesOnly, myFavoritesOnly, filterWord) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update, setUpdate, user} = useContext(MainContext);

  const loadMedia = async () => {
    setLoading(true);
    try {
      let json = [];
      let allMediaData = [];

      json = await doFetch(apiUrl + 'media?limit=300');
      json = json.filter(
        (item) => item.description.split('projectLabel')[1] != undefined
      );

      if (myFilesOnly) {
        json = json.filter((item) => item.user_id === user.user_id);
      }
      if (myFavoritesOnly) {
        const token = await AsyncStorage.getItem('userToken');
        const favoritesByUser = await useFavourite().getFavouritesByUser(token);
        json = json.filter((item) =>
          favoritesByUser.some((f) => f.file_id === item.file_id)
        );
      }

      if (filterWord) {
        json = json.filter((item) => {
          const descriptionParsed = JSON.parse(item.description);
          return (
            item.title.toLowerCase().includes(filterWord) ||
            descriptionParsed.description.toLowerCase().includes(filterWord) ||
            descriptionParsed.address.toLowerCase().includes(filterWord)
          );
        });
      }

      allMediaData = json.map(async (mediaItem) => {
        return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
      });

      setMediaArray(await Promise.all(allMediaData));
    } catch (error) {
      console.log('media fetch failed', error.message);
      throw new Error('Get media error: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);

  const postMedia = async (token, formData) => {
    setLoading(true);
    const options = {
      method: 'POST',
      headers: {'x-access-token': token, 'Content-Type': 'multipart/form-data'},
      body: formData,
    };

    try {
      const result = await doFetch(apiUrl + 'media', options);
      result && setLoading(false);
      return result;
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

  return {mediaArray, postMedia, putMedia, deleteMedia, loading};
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
      const response = await doFetch(apiUrl + 'login', options);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const {setIsLoggedIn, user, setUser} = useContext(MainContext);

  const {getUserByToken} = useUser();

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      // setIsLoggedIn(false);
      return;
    }
    try {
      const userData = await getUserByToken(userToken);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  return {postLogin, checkToken};
};

const useUser = () => {
  const checkUsername = async (username) => {
    try {
      const result = await doFetch(apiUrl + 'users/username/' + username);
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

  const getOwner = async (userId, token) => {
    try {
      return await getUserById(userId, token);
    } catch (error) {
      // TODO: how should user be notified?
      console.error('fetch owner error', error.message);
    }
  };

  const getAvatar = async (userId) => {
    try {
      const avatarArray = await useTag().getFilesByTag('avatar_' + userId);
      if (avatarArray.length === 0) {
        return null;
      }
      return avatarArray.pop();
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    checkUsername,
    getUserByToken,
    postUser,
    putUser,
    getOwner,
    getAvatar,
    getUserById,
  };
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

  const getFavouritesByUser = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${apiUrl}favourites`, options);
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

  return {
    postFavourite,
    getFavouritesByFileId,
    getFavouritesByUser,
    deleteFavourite,
  };
};

const useComment = () => {
  const postComment = async (data, token) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      return await doFetch(apiUrl + 'comments', options);
    } catch (error) {
      console.log('Post comment failed', error.message);
    }
  };

  const getCommentsByFile = async (fileId) => {
    try {
      const options = {
        method: 'GET',
      };
      return await doFetch(apiUrl + 'comments/file/' + fileId, options);
    } catch (error) {
      console.log('Get comments by fileID failed', error.message);
    }
  };

  return {
    postComment,
    getCommentsByFile,
  };
};

export {useMedia, useLogin, useUser, useTag, useFavourite, useComment};
