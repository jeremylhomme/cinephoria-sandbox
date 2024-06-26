import { useSelector } from "react-redux";
import React from "react";
import AdminMenu from "../pages/Admin/AdminMenu";
import UserMenu from "../pages/User/UserMenu";
import VisitorMenu from "../pages/Visitor/VisitorMenu";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header className="">
      {userInfo?.userRole === "admin" ? (
        <AdminMenu />
      ) : userInfo?.userRole === "customer" ? (
        <UserMenu />
      ) : (
        <VisitorMenu />
      )}
    </header>
  );
};

export default Header;
