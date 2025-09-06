export const locations = {
  qatar: {
    country: "Qatar",
    cities: [
      { name: "Doha", value: "doha", lat: 25.2854, lng: 51.5310 },
      { name: "Al Rayyan", value: "al-rayyan", lat: 25.2919, lng: 51.4244 },
      { name: "Al Wakrah", value: "al-wakrah", lat: 25.1717, lng: 51.6067 },
      { name: "Al Khor", value: "al-khor", lat: 25.6804, lng: 51.4969 },
      { name: "Umm Salal", value: "umm-salal", lat: 25.4169, lng: 51.4046 },
      { name: "Madinat ash Shamal", value: "madinat-ash-shamal", lat: 26.1298, lng: 51.2008 },
      { name: "Al Daayen", value: "al-daayen", lat: 25.5785, lng: 51.4824 },
      { name: "Lusail", value: "lusail", lat: 25.4542, lng: 51.4908 },
      { name: "The Pearl", value: "the-pearl", lat: 25.3685, lng: 51.5513 },
      { name: "West Bay", value: "west-bay", lat: 25.3264, lng: 51.5266 }
    ]
  },
  uae: {
    country: "United Arab Emirates",
    cities: [
      { name: "Dubai", value: "dubai", lat: 25.2048, lng: 55.2708 },
      { name: "Abu Dhabi", value: "abu-dhabi", lat: 24.4539, lng: 54.3773 },
      { name: "Sharjah", value: "sharjah", lat: 25.3462, lng: 55.4209 }
    ]
  },
  saudi: {
    country: "Saudi Arabia",
    cities: [
      { name: "Riyadh", value: "riyadh", lat: 24.7136, lng: 46.6753 },
      { name: "Jeddah", value: "jeddah", lat: 21.4858, lng: 39.1925 },
      { name: "Dammam", value: "dammam", lat: 26.4207, lng: 50.0888 }
    ]
  }
};

export const getAllCities = () => {
  const allCities = [];
  Object.values(locations).forEach(country => {
    country.cities.forEach(city => {
      allCities.push({
        ...city,
        country: country.country,
        label: `${city.name}, ${country.country}`
      });
    });
  });
  return allCities;
};