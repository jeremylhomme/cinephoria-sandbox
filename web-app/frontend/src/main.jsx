import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import LoggedInRoute from "./components/LoggedInRoute.jsx";
import AuthRedirect from "./pages/Auth/AuthRedirect.jsx";

// Visitor Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Movies from "./pages/Visitor/Movies.jsx";
import MoviePage from "./pages/Visitor/MoviePage.jsx";
import CartPage from "./pages/Visitor/CartPage.jsx";
import ContactPage from "./pages/Visitor/ContactPage.jsx";
import Sessions from "./pages/Visitor/Sessions.jsx";

// User Pages
import Profile from "./pages/User/Profile.jsx";
import PaymentPage from "./pages/User/PaymentPage.jsx";
import ThankYou from "./pages/User/ThankYou.jsx";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import CategoryList from "./pages/Admin/CategoryList.jsx";
import CinemaList from "./pages/Admin/CinemaList.jsx";
import CinemaAdd from "./pages/Admin/CinemaAdd.jsx";
import CinemaDetails from "./pages/Admin/CinemaDetails.jsx";
import CinemaUpdate from "./pages/Admin/CinemaUpdate.jsx";
import Cinemas from "./pages/Visitor/Cinemas.jsx";
import CinemaNantes from "./pages/Visitor/CinemaNantes.jsx";
import BookingList from "./pages/Admin/BookingList.jsx";
import BookingUpdate from "./pages/Admin/BookingUpdate.jsx";
import BookingDetails from "./pages/Admin/BookingDetails.jsx";
import BookingSeatsMap from "./components/BookingSeatsMap.jsx";
import IncidentList from "./pages/Admin/IncidentList.jsx";
import IncidentDetails from "./pages/Admin/IncidentDetails.jsx";
import SessionList from "./pages/Admin/SessionList.jsx";
import SessionAdd from "./pages/Admin/SessionAdd.jsx";
import SessionDetails from "./pages/Admin/SessionDetails.jsx";
import SessionUpdate from "./pages/Admin/SessionUpdate.jsx";
import RoomList from "./pages/Admin/RoomList.jsx";
import RoomDetails from "./pages/Admin/RoomDetails.jsx";
import MovieList from "./pages/Admin/MovieList.jsx";
import MovieAdd from "./pages/Admin/MovieAdd.jsx";
import MovieUpdate from "./pages/Admin/MovieUpdate.jsx";
import MovieDetails from "./pages/Admin/MovieDetails.jsx";
import Orders from "./pages/User/Orders.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import FirstLogin from "./pages/Auth/FirstLogin.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Visitor Routes */}
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/cinemas" element={<Cinemas />} />
      <Route path="/cinemas/nantes" element={<CinemaNantes />} />
      <Route path="/movies/:movieId" element={<MoviePage />} />
      <Route path="/sessions/:id" element={<SessionDetails />} />
      <Route
        path="/movie/:movieId/session/:sessionId/auth"
        element={<AuthRedirect />}
      />{" "}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/bookings/:bookingId/payment" element={<PaymentPage />} />
      {/* User Routes */}
      <Route path="/user" element={<LoggedInRoute />}>
        <Route path="/user/:id" element={<LoggedInRoute />}>
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="profile/:id" element={<Profile />} />
        <Route path="thankyou/:id" element={<ThankYou />} />
        <Route path="first-login" element={<FirstLogin />} />
      </Route>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="movielist" element={<MovieList />} />
        <Route path="/admin/movielist" element={<AdminRoute />}>
          <Route path="movieadd" element={<MovieAdd />} />
          <Route path="moviedetails/:id" element={<MovieDetails />} />
          <Route path="movieupdate/:id" element={<MovieUpdate />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="sessionlist" element={<SessionList />} />
        <Route path="/admin/sessionlist" element={<AdminRoute />}>
          <Route path="sessionupdate/:id" element={<SessionUpdate />} />
          <Route path="sessionadd" element={<SessionAdd />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="admindashboard" element={<AdminDashboard />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="cinemalist" element={<CinemaList />} />
        <Route path="cinemaadd" element={<CinemaAdd />} />
        <Route path="cinemadetails/:id" element={<CinemaDetails />} />
        <Route path="cinemaupdate/:id" element={<CinemaUpdate />} />
        <Route path="bookinglist" element={<BookingList />} />
        <Route path="bookingdetails/:id" element={<BookingDetails />} />
        <Route path="bookingupdate/:id" element={<BookingUpdate />} />
        <Route path="bookingseatsmap" element={<BookingSeatsMap />} />
        <Route path="incidentlist" element={<IncidentList />} />
        <Route path="incidentdetails/:id" element={<IncidentDetails />} />
        <Route path="sessionlist" element={<SessionList />} />
        <Route path="sessionadd" element={<SessionAdd />} />
        <Route path="/admin/sessions" element={<AdminRoute />}></Route>
        <Route path="roomlist" element={<RoomList />} />
        <Route path="roomdetails/:id" element={<RoomDetails />} />

        <Route path="userlist" element={<UserList />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
