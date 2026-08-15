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

export default client;
