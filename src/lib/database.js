import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data');
const hostsFile = path.join(dbPath, 'hosts.json');
const propertiesFile = path.join(dbPath, 'properties.json');
const bookingsFile = path.join(dbPath, 'bookings.json');

// Initialize database files
function initDB() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }
  
  if (!fs.existsSync(hostsFile)) {
    fs.writeFileSync(hostsFile, JSON.stringify({ hosts: [] }, null, 2));
  }
  
  if (!fs.existsSync(propertiesFile)) {
    fs.writeFileSync(propertiesFile, JSON.stringify({ properties: [] }, null, 2));
  }
  
  if (!fs.existsSync(bookingsFile)) {
    fs.writeFileSync(bookingsFile, JSON.stringify({ bookings: [] }, null, 2));
  }
}

// Host operations
export function getAllHosts() {
  initDB();
  const data = fs.readFileSync(hostsFile, 'utf8');
  return JSON.parse(data).hosts;
}

export function saveHost(host) {
  initDB();
  const data = JSON.parse(fs.readFileSync(hostsFile, 'utf8'));
  data.hosts.push(host);
  fs.writeFileSync(hostsFile, JSON.stringify(data, null, 2));
  return host;
}

export function findHostByEmail(email) {
  initDB();
  const hosts = getAllHosts();
  return hosts.find(h => h.email === email);
}

// Property operations
export function getAllProperties() {
  initDB();
  const data = fs.readFileSync(propertiesFile, 'utf8');
  return JSON.parse(data).properties;
}

export function saveProperty(property) {
  initDB();
  const data = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
  data.properties.push(property);
  fs.writeFileSync(propertiesFile, JSON.stringify(data, null, 2));
  return property;
}

export function getPropertiesByHostId(hostId) {
  const properties = getAllProperties();
  return properties.filter(p => p.hostId === hostId);
}

export function getAvailableProperties(checkIn, checkOut, city) {
  const properties = getAllProperties();
  
  return properties.filter(property => {
    // Filter by city if provided
    if (city && property.city !== city) return false;
    
    // Check availability
    const dates = getDatesBetween(checkIn, checkOut);
    for (let date of dates) {
      if (property.availability[date]?.available === false) {
        return false;
      }
    }
    
    return property.status === 'active';
  });
}

export function updatePropertyAvailability(propertyId, dates, available = false) {
  initDB();
  const data = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
  const propertyIndex = data.properties.findIndex(p => p.id === propertyId);
  
  if (propertyIndex !== -1) {
    dates.forEach(date => {
      if (!data.properties[propertyIndex].availability) {
        data.properties[propertyIndex].availability = {};
      }
      data.properties[propertyIndex].availability[date] = { available };
    });
    
    fs.writeFileSync(propertiesFile, JSON.stringify(data, null, 2));
    return true;
  }
  return false;
}

// Booking operations
export function saveBooking(booking) {
  initDB();
  const data = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
  data.bookings.push(booking);
  fs.writeFileSync(bookingsFile, JSON.stringify(data, null, 2));
  
  // Update property availability
  const dates = getDatesBetween(booking.checkIn, booking.checkOut);
  updatePropertyAvailability(booking.propertyId, dates, false);
  
  return booking;
}

export function getBookingsByTenant(tenantId) {
  initDB();
  const data = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
  return data.bookings.filter(b => b.tenantId === tenantId);
}

export function getBookingsByHost(hostId) {
  initDB();
  const data = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
  const properties = getPropertiesByHostId(hostId);
  const propertyIds = properties.map(p => p.id);
  return data.bookings.filter(b => propertyIds.includes(b.propertyId));
}

// Helper functions
function getDatesBetween(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}