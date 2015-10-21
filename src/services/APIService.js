/* global FIREBASE_ID */
import fetch from 'isomorphic-fetch';

export const fetchLayout = () => {
  return fetch(`https://${FIREBASE_ID}.firebaseio.com/layout.json`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response');
      }
      return response.json();
    });
};
