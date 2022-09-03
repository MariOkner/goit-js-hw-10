import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchMar } from './js/fetchMar';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchCountryInput = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list'); 
const countryInfoEl = document.querySelector('.country-info');
    
searchCountryInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(evt) {
  evt.preventDefault();
  
  let searchName = searchCountryInput.value.trim();
  if (!searchName) {
    cleanCountryList();
    cleanCountryInfo();
    return 
  };

  fetchMar(searchName)
    .then((response) => {
      if (!response.ok || response.status === 404) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((country) => {
      if (country.length > 10) {
        Notify.success(`Too many matches found. Please enter a more specific name.`);
      }
      
      if (country.length >= 2 && country.length <= 10) {
        cleanCountryInfo();
        console.log(country)
        renderCardCountry(country);
      }

      if (country.length === 1) {
        cleanCountryList();
        renderInfoCountries(country);
      }
    })
    .catch((error) => {
    cleanCountryList();
    cleanCountryInfo();
    onInputError();
  });
};


function renderCardCountry(country) {
  const markup = country
    .map(({ flags, name }) => {
      return `
        <li class="country-item">
          <img class="country-svg" src = "${flags.svg}" alt = "Флаг ${name.official}" width = 40px height = 20px />
          <h1 class="country-title">${name.official}</h1>
        </li>
      `
    })
    .join('');
  countryListEl.insertAdjacentHTML('afterbegin', markup)
};


function renderInfoCountries(country) {
  const markups = country
    .map(({name, flags, capital, population, languages }) => {
      return `
        <ul class="cards-list">
          <li class="country-item">
            <img class="country-svg" src = "${flags.svg}" alt = "Флаг ${name.official}" width = 40px height = 20px />
            <h1 class="country-title">${name.official}</h1>
          </li>
          <li class="countries-item"><b>Capital:</b> ${capital}</li>
          <li class="countries-item"><b>Population:</b> ${population}</li>
          <li class="countries-item"><b>Languages:</b> ${Object.values(languages).join(', ')}</li>
        </ul>   
      `
    })
    .join('');
  countryInfoEl.insertAdjacentHTML('afterbegin', markups)
};

function onInputError(error) {
    Notify.failure(`Oops, there is no country with that name`);
};

function cleanCountryList() {
  countryListEl.innerHTML = '';
};

function cleanCountryInfo() {
  countryInfoEl.innerHTML = '';
};


// Додала клас для формлення input
searchCountryInput.classList.add('backlight-frame');