"use client"

import { useState, useEffect } from "react"

// API ключ для Яндекс Карт
// Создаем глобальные переменные для отслеживания состояния загрузки АПИ
const API_KEY = "c6cdb52a-f5dd-49e9-8419-a2f7edf78c2c"

// Глобальное состояние загрузки АПИ
type ApiState = {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  errorMessage: string | null;
  initPromise: Promise<void> | null;
}

// Синглтон для состояния API
const apiState: ApiState = {
  isLoading: false,
  isLoaded: false,
  isError: false,
  errorMessage: null,
  initPromise: null
};

// Инициализация API карт, возвращает Promise
function initYandexMapsApi(): Promise<void> {
  // Если уже инициализировано или загружается, возвращаем существующий Promise
  if (apiState.initPromise) {
    return apiState.initPromise;
  }

  // Защита от выполнения в SSR
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  // Проверяем, загружен ли уже API
  if (window.ymaps && window.ymaps.ready && typeof window.ymaps.geocode === 'function') {
    console.log("Яндекс Карты API уже полностью загружен");
    apiState.isLoaded = true;
    apiState.isLoading = false;
    return Promise.resolve();
  }

  // Если API частично загружен (ymaps существует, но не полностью инициализирован)
  if (window.ymaps && window.ymaps.ready) {
    console.log("Яндекс Карты API частично загружен, ожидание полной инициализации");
    
    apiState.initPromise = new Promise<void>((resolve, reject) => {
      try {
        window.ymaps.ready(() => {
          console.log("Яндекс Карты API успешно инициализирован");
          apiState.isLoaded = true;
          apiState.isLoading = false;
          resolve();
        });
      } catch (error) {
        console.error("Ошибка при инициализации API:", error);
        apiState.isError = true;
        apiState.errorMessage = `Ошибка инициализации: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`;
        apiState.isLoading = false;
        reject(error);
      }
    });

    return apiState.initPromise;
  }

  // Если API еще не загружен, загружаем его
  console.log("Начало загрузки Яндекс Карты API");
  apiState.isLoading = true;

  // Создаем промис для загрузки API
  apiState.initPromise = new Promise<void>((resolve, reject) => {
    try {
      // Проверяем, есть ли уже скрипт на странице
      const existingScript = document.querySelector(
        `script[src*="api-maps.yandex.ru/2.1/?apikey=${API_KEY}"]`
      );

      if (existingScript) {
        console.log("Скрипт Yandex Maps уже добавлен на страницу, ожидание инициализации");
        
        // Добавляем таймаут на случай, если скрипт уже загружается, но еще не завершился
        const intervalId = setInterval(() => {
          if (window.ymaps && window.ymaps.ready) {
            clearInterval(intervalId);
            window.ymaps.ready(() => {
              console.log("Яндекс Карты API успешно инициализирован из интервала");
              apiState.isLoaded = true;
              apiState.isLoading = false;
              resolve();
            });
          }
        }, 200);

        // Таймаут на случай, если загрузка зависнет
        const timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          console.error("Превышено время ожидания загрузки существующего Яндекс Карты API");
          apiState.isError = true;
          apiState.errorMessage = "Превышено время ожидания загрузки API";
          apiState.isLoading = false;
          apiState.initPromise = null;
          reject(new Error("Превышено время ожидания загрузки API"));
        }, 10000);

        return;
      }

      // Создаем скрипт для загрузки API
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;
      script.async = true;
      script.defer = true;
      script.dataset.ymapsApi = "true"; // Метка для поиска в DOM

      // Добавляем таймаут для обнаружения проблем с загрузкой
      const timeoutId = setTimeout(() => {
        if (!apiState.isLoaded && !apiState.isError) {
          console.error("Превышено время ожидания загрузки Яндекс Карты API");
          apiState.isError = true;
          apiState.errorMessage = "Превышено время ожидания загрузки API";
          apiState.isLoading = false;
          apiState.initPromise = null;
          reject(new Error("Превышено время ожидания загрузки API"));
        }
      }, 10000); // 10 секунд таймаут

      // Обработчики событий загрузки
      script.onload = () => {
        console.log("Скрипт Яндекс Карты загружен, ожидание инициализации API");

        try {
          // Проверяем, доступен ли объект ymaps
          if (!window.ymaps) {
            console.error("Объект ymaps не найден после загрузки скрипта");
            apiState.isError = true;
            apiState.errorMessage = "API не инициализирован корректно";
            apiState.isLoading = false;
            apiState.initPromise = null;
            clearTimeout(timeoutId);
            reject(new Error("API не инициализирован корректно"));
            return;
          }

          // Инициализируем API после загрузки
          window.ymaps.ready(() => {
            console.log("Яндекс Карты API успешно загружен и инициализирован");
            apiState.isLoaded = true;
            apiState.isLoading = false;
            clearTimeout(timeoutId);
            resolve();
          });
        } catch (error) {
          console.error("Ошибка при инициализации API:", error);
          apiState.isError = true;
          apiState.errorMessage = `Ошибка инициализации: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`;
          apiState.isLoading = false;
          apiState.initPromise = null;
          clearTimeout(timeoutId);
          reject(error);
        }
      };

      script.onerror = (error) => {
        console.error("Ошибка загрузки Яндекс Карты API:", error);
        apiState.isError = true;
        apiState.errorMessage = "Не удалось загрузить API";
        apiState.isLoading = false;
        apiState.initPromise = null;
        clearTimeout(timeoutId);
        reject(new Error("Не удалось загрузить API"));
      };

      // Добавляем скрипт на страницу
      document.head.appendChild(script);
    } catch (error) {
      console.error("Непредвиденная ошибка при загрузке API:", error);
      apiState.isError = true;
      apiState.errorMessage = `Непредвиденная ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`;
      apiState.isLoading = false;
      apiState.initPromise = null;
      reject(error);
    }
  });

  return apiState.initPromise;
}

interface YandexMapsHook {
  isLoaded: boolean
  isError: boolean
  errorMessage: string | null
}

export function useYandexMaps(): YandexMapsHook {
  const [isLoaded, setIsLoaded] = useState(apiState.isLoaded);
  const [isError, setIsError] = useState(apiState.isError);
  const [errorMessage, setErrorMessage] = useState<string | null>(apiState.errorMessage);

  useEffect(() => {
    // Защита от выполнения в SSR
    if (typeof window === "undefined") {
      return;
    }

    // Если API уже загружен, просто обновляем состояние
    if (apiState.isLoaded) {
      setIsLoaded(true);
      return;
    }

    // Если есть ошибка, обновляем состояние
    if (apiState.isError) {
      setIsError(true);
      setErrorMessage(apiState.errorMessage);
      return;
    }

    // Инициализируем API
    initYandexMapsApi()
      .then(() => {
        setIsLoaded(true);
        setIsError(false);
        setErrorMessage(null);
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error instanceof Error ? error.message : "Неизвестная ошибка");
      });

    // Функция очистки не нужна, т.к. мы не удаляем скрипт при размонтировании
    // чтобы не вызывать повторную загрузку
  }, []); // Зависимостей нет, мы используем глобальное состояние

  return { isLoaded, isError, errorMessage };
}

// Добавляем типы для глобального объекта window
declare global {
  interface Window {
    ymaps?: any
  }
}
