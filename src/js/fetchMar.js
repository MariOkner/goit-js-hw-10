const BASE_URL = 'https://restcountries.com/v3.1/name/';
const FIELDS = 'fields=name,capital,population,flags,languages';

export function fetchMar(country) {
  return fetch(`${BASE_URL}${country}?${FIELDS}`)
      .then((response) => {
      
      if (!response.ok || response.status === 404) {
        throw new Error(response.status);
      }
      return response.json();
    })
};

export default { fetchMar };