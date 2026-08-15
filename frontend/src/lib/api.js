import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

export const getCategories = () => client.get("/categories").then((r) => r.data);
export const getEventTypes = () => client.get("/event-types").then((r) => r.data);
export const getIdeas = () => client.get("/ideas").then((r) => r.data);
export const getVendors = (params = {}) => client.get("/vendors", { params }).then((r) => r.data);
export const getVendor = (id) => client.get(`/vendors/${id}`).then((r) => r.data);
export const getCities = () => client.get("/vendors/cities").then((r) => r.data);
export const createEvent = (payload) => client.post("/events", payload).then((r) => r.data);
export const createLead = (payload) => client.post("/leads", payload).then((r) => r.data);

export const getAvailability = (vendorId) =>
  client.get(`/vendors/${vendorId}/availability`).then((r) => r.data);
export const createBooking = (payload) => client.post("/bookings", payload).then((r) => r.data);
export const getBooking = (id) => client.get(`/bookings/${id}`).then((r) => r.data);
export const listBookings = (params = {}) =>
  client.get("/bookings", { params }).then((r) => r.data);
export const updateBookingStatus = (id, payload) =>
  client.patch(`/bookings/${id}/status`, payload).then((r) => r.data);

// local (no-auth) tracking of a visitor's booking ids
const LS_KEY = "aw_bookings";
export const rememberBooking = (id) => {
  const ids = getRememberedBookings();
  if (!ids.includes(id)) localStorage.setItem(LS_KEY, JSON.stringify([id, ...ids]));
};
export const getRememberedBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};

export default client;
