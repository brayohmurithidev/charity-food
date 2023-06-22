import axios from "axios";
import { toast } from "react-toastify";

export const get_coordinates_by_city = async (city, country) => {
  if (city === "" || country === "") {
    toast.error("Please provide a city and country");
  }
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city},+${country}&key=1efa19709b0c466bb6e64d0c5e6acb49&language=en&pretty=1`;
    const res = await axios.get(url);
    const cords = res.data.results[0].geometry;
    return [cords.lat, cords.lng];
  } catch (error) {
    toast.error("City not found");
  }
};

export const calculateCoordinates = (lat, lon, radius) => {
  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Convert radius from kilometers to radians
  const radiusInRadians = radius / earthRadius;

  // Calculate the circumference of the circle within the radius
  // const circumference = 2 * Math.PI * earthRadius * radiusInRadians;

  // Number of points to generate within the circumference
  const numPoints = 360;

  // Calculate the angular distance between each point
  const angularDistance = 360 / numPoints;

  // Calculate the coordinates within the range
  const coordinates = [];
  for (let angle = 0; angle < 360; angle += angularDistance) {
    const theta = angle * (Math.PI / 180);
    const dx = radiusInRadians * Math.cos(theta);
    const dy = radiusInRadians * Math.sin(theta);

    const newLat = lat + dy * (180 / Math.PI);
    const newLon =
      lon + (dx * (180 / Math.PI)) / Math.cos(lat * (Math.PI / 180));

    coordinates.push({ lat: newLat, lon: newLon });
  }

  // Find the minimum and maximum latitude and longitude
  let minLat = coordinates[0].lat;
  let maxLat = coordinates[0].lat;
  let minLon = coordinates[0].lon;
  let maxLon = coordinates[0].lon;

  coordinates.forEach(({ lat, lon }) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
  });

  return { minLat, maxLat, minLon, maxLon };
};

// CALCULATE DISTANCE BETWEEN 2 POINTS
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371; // Earth's radius in kilometers

  // Convert latitude and longitude to radians
  const lat1Rad = (Math.PI / 180) * lat1;
  const lon1Rad = (Math.PI / 180) * lon1;
  const lat2Rad = (Math.PI / 180) * lat2;
  const lon2Rad = (Math.PI / 180) * lon2;

  // Calculate the differences between the coordinates
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Calculate the distance using the Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  const roundedDistance = distance.toFixed(1);
  return roundedDistance;
};
