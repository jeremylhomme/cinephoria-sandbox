import dotenv from "dotenv";

dotenv.config();

export const BASE_URL = process.env.VITE_BASE_URL;
export const USER_URL = `${BASE_URL}/api/users`;
export const BOOKING_URL = `${BASE_URL}/api/bookings`;
export const CATEGORY_URL = `${BASE_URL}/api/categories`;
export const CINEMA_URL = `${BASE_URL}/api/cinemas`;
export const INCIDENT_URL = `${BASE_URL}/api/incidents`;
export const MOVIE_URL = `${BASE_URL}/api/movies`;
export const PROFILE_URL = `${USER_URL}/profile`;
export const PUBLISHING_STATE_URL = `${BASE_URL}/api/publishingstates`;
export const ROOM_URL = `${BASE_URL}/api/rooms`;
export const SEAT_URL = `${BASE_URL}/api/seats`;
export const SESSION_URL = `${BASE_URL}/api/sessions`;
export const UPLOAD_URL = `${BASE_URL}/api/uploads`;
