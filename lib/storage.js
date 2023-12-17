// lib/storage.js

export const saveToLocalStorage = (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      console.error("Error saving to local storage", e);
    }
  };
  
  export const loadFromLocalStorage = (key) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return undefined;
      }
      return JSON.parse(serializedValue);
    } catch (e) {
      console.error("Error loading from local storage", e);
      return undefined;
    }
  };
  