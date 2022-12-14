const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      // http status code 401 or 404
      // throw new Error(data.message);
      return null;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export {doFetch};
