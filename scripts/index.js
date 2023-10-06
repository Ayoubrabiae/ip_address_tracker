let map;
const input = document.querySelector('input');
const submitBtn = document.querySelector('input+button');
const ipAddressContainer = document.querySelector('.ip-address p');
const locationContainer = document.querySelector('.location p');
const timezoneContainer = document.querySelector('.timezone p');
const zipCodeContainer = document.querySelector('.zipCode p');
const searchContainer = document.querySelector('.search-input');

const fillInfo = (info) => {
  const {
    ip, location, timezone, zipCode,
  } = info;

  ipAddressContainer.textContent = ip;
  locationContainer.textContent = location;
  timezoneContainer.textContent = timezone;
  zipCodeContainer.textContent = zipCode;
};

const createMap = (lat, lon) => {
  if (!map) {
    // eslint-disable-next-line no-undef
    map = L.map('map').setView([lat, lon], 13);

    // eslint-disable-next-line no-undef
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  } else {
    map.setView([lat, lon]);
  }

  map.eachLayer((layer) => {
    // eslint-disable-next-line no-undef
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // eslint-disable-next-line no-undef
  L.marker([lat, lon]).addTo(map);
};

const getLocation = async (ipAddress = '') => {
  try {
    const response = await fetch(`https://freeipapi.com/api/json/${ipAddress}`);
    const locationData = await response.json();
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      ip: locationData.ipAddress,
      location: locationData.cityName,
      timezone: locationData.timeZone,
      zipCode: locationData.zipCode,
    };
  } catch (error) {
    return { latitude: 0, longitude: 0 };
  }
};

getLocation().then((coordinates) => {
  createMap(coordinates.latitude, coordinates.longitude);
  fillInfo(coordinates);
});

const showError = (trueOrFalse) => {
  if (trueOrFalse) {
    searchContainer.classList.add('error');
    input.placeholder = 'Please enter a valid IP address';
    input.value = '';
  } else {
    searchContainer.classList.remove('error');
    input.placeholder = 'Search for any IP address';
  }
};

const getLocationWithIp = () => {
  const value = input?.value;
  getLocation(value).then((coordinates) => {
    createMap(coordinates.latitude, coordinates.longitude);
    fillInfo(coordinates);
  }).catch(() => {
    showError(true);
  });
};
input.addEventListener('keydown', () => showError(false));
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getLocationWithIp();
});
