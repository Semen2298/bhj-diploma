/**
 * Константы для удобства использования
 */
const JSON_RESPONSE_TYPE = 'json';
const GET_METHOD = 'GET';

/**
 * Проверяет, является ли метод GET
 */
const isGetMethod = (method) => method.toUpperCase() === GET_METHOD;

/**
 * Формирует строку запроса для GET-запроса
 */
const buildQueryString = (data = {}) => Object
  .entries(data)
  .reduce((queryStringParams, [key, val]) => { 
    queryStringParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    return queryStringParams;
  }, [])
  .join('&');

/**
 * Формирует объект FormData для методов, отличных от GET
 */
const buildFormData = (data = {}) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, val]) => {
    formData.append(key, val);
  });

  return formData;
};

/**
 * Определяет данные запроса в зависимости от метода
 */
const getRequestDataByMethod = (method, data) => {
  if (isGetMethod(method)) {
    return {
      queryString: buildQueryString(data),
      formData: null,
    };
  }

  return {
    queryString: '',
    formData: buildFormData(data),
  };
};

/**
 * Проверяет, является ли callback корректной функцией
 */
const isCorrectCallback = (callback) => callback && typeof callback === 'function';

/**
 * Основная функция для совершения запросов на сервер
 */
const createRequest = (options = {}) => {
  const { url, method, data, callback, responseType } = options;

  // Проверка параметров
  if (!url) {
    throw new Error('Не указан URL запроса');
  }

  if (!method) {
    throw new Error('Не указан метод запроса');
  }

  const { queryString, formData } = getRequestDataByMethod(method, data);
  const requestUrl = `${url}${queryString.length > 0 ? '?' + queryString : ''}`;

  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType ?? JSON_RESPONSE_TYPE;

  // Обработка завершения запроса
  xhr.onload = function () {
    if (!isCorrectCallback(callback)) {
      return;
    }

    try {
      if (xhr.status >= 200 && xhr.status < 300) {
        callback(null, xhr.response);
      } else {
        callback(new Error(`Ошибка: ${xhr.status} - ${xhr.statusText}`), null);
      }
    } catch (error) {
      callback(new Error(error), null);
    }
  };

  // Обработка ошибок сети
  xhr.onerror = function () {
    if (isCorrectCallback(callback)) {
      callback(new Error('Ошибка сети'), null);
    }
  };

  xhr.open(method, requestUrl);

  // Отправка запроса в зависимости от метода
  if (isGetMethod(method)) {
    xhr.send();
  } else {
    xhr.send(formData);
  }
};
