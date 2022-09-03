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

















// +++++++++++++++++__________________________________________________
// import './css/styles.css'
// import debounce from 'lodash.debounce'
// import Notiflix from 'notiflix'
// import { fetchCountries } from './js/fetchCountries';

// const DEBOUNCE_DELAY = 300

// const countryInput = document.querySelector('#search-box')
// const countryList = document.querySelector('.country-list')
// const countryInfo = document.querySelector('.country-info')

// countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY))

// function onCountryInput(evt) {
//   evt.preventDefault();
//   const name = countryInput.value.trim()
//     if (name === '') {
//       return
//     // return (countryList.innerHTML = '') && (countryInfo.innerHTML = '')
//   }

//   fetchCountries()
//     .then(countries => {
//       // countryList.innerHTML = ''
//       // countryInfo.innerHTML = ''
//       if (countries.length === 1) {
//         countryList.insertAdjacentHTML('beforeend', renderCountryList(countries))
//         countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries))
//       } else if (countries.length >= 10) {
//         alertTooManyMatches()
//       } else {
//         countryList.insertAdjacentHTML('beforeend', renderCountryList(countries))
//       }
//     })
//     .catch(alertWrongName)
// }

// function renderCountryList(countries) {
//   const markup = countries
//     .map(({ name, flags }) => {
//       return `
//           <li class="country-list__item">
//               <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
//               <h2 class="country-list__name">${name.official}</h2>
//           </li>
//           `
//     })
//     .join('')
//   return markup
// }

// function renderCountryInfo(countries) {
//   const markup = countries
//     .map(({ capital, population, languages }) => {
//       return `
//         <ul class="country-info__list">
//             <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
//             <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
//             <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
//         </ul>
//         `
//     })
//     .join('')
//   return markup
// }

// function alertWrongName() {
//   Notiflix.Notify.failure('Oops, there is no country with that name')
// }

// function alertTooManyMatches() {
//   Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
// }

