import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import R from "ramda";
import { Button, Avatar } from "@nextui-org/react";

import { CameraIcon } from "../../../assets/icons/CameraIcon";
import { GalleryIcon } from "../../../assets/icons/icons";

import Navbar from "react-bulma-companion/lib/Navbar";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";

import "@fontsource/ubuntu";

import UserDropdown from "_components/molecules/UserDropdown";
import styles from "./styles.module.css";

export default function Navigation() {
  const { pathname } = useLocation();
  const { user } = useSelector(R.pick(["user"]));

  const [auth, setAuth] = useState(!R.isEmpty(user));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAuth(!R.isEmpty(user));
  }, [user]);

  const toggleDropdown = () => setOpen(!open);

  const closeDropdown = () => setOpen(false);

  const isHome = pathname.length === 5 ? pathname === "/home" : R.slice(0, 6, pathname) === "/home/";

  const isTodo = pathname.length === 5 ? pathname === "/todo" : R.slice(0, 6, pathname) === "/todo/";

  const isSettings = pathname.length === 9 ? pathname === "/settings" : R.slice(0, 10, pathname) === "/settings/";

  return (
    <Navbar fixed="top" className={styles.navbar_root}>
      <Container className={styles.container}>
        <Navbar.Brand>
          <Navbar.Item to={auth ? "/home" : "/"} aria-label="main navigation" component={Link}>
            <Title>
              <img src="/images/logo.png" alt="logo" height={90} />
            </Title>
          </Navbar.Item>
          <div className="navbar-brand-right">
            {!auth && (
              <Navbar.Item className="is-hidden-desktop " to="/login" component={Link}>
                <Title size="6">Login</Title>
              </Navbar.Item>
            )}
            {!auth && (
              <Navbar.Item className="is-hidden-desktop" to="/register" component={Link}>
                <Button auto css={{ px: "$12", fontSize: "19px", fontFamily: "Ubuntu", backgroundColor: "#4361ED" }} rounded>
                  {" "}
                  Sign Up{" "}
                </Button>
              </Navbar.Item>
            )}
            {auth && (
              <Navbar.Item className="is-hidden-desktop" onClick={toggleDropdown} onKeyPress={toggleDropdown} hoverable component="a">
                <Avatar src={user.profilePic || "/images/default-profile.png"} color="primary" bordered />
                <span className="dropdown-caret" />
              </Navbar.Item>
            )}
          </div>
        </Navbar.Brand>

        {auth ? (
          <Navbar.Menu>
            <Navbar.Start>
              <Navbar.Item className="is-hidden-mobile" to="/home" active={isHome} tab component={Link}>
                <Title size="6">Home</Title>
              </Navbar.Item>
              <Navbar.Item className="is-hidden-mobile" to="/todo" active={isTodo} tab component={Link}>
                <Title size="6">Todo</Title>
              </Navbar.Item>
              <Navbar.Item className="is-hidden-mobile" to="/settings" active={isSettings} tab component={Link}>
                <Title size="6">Settings</Title>
              </Navbar.Item>
            </Navbar.Start>
            <Navbar.End>
              <Navbar.Item to="/gallery" component={Link}>
                <Button color="gradient" icon={<GalleryIcon width={25} height={25} />} auto css={{ fontFamily: "Ubuntu", boxShadow: "$sm" }}>
                  My Gallery
                </Button>
              </Navbar.Item>
              <Navbar.Item to="/selfies" component={Link}>
                <Button auto color="gradient" icon={<CameraIcon fill="currentColor" />} css={{ fontFamily: "Ubuntu", boxShadow: "$sm" }}>
                  My Selfies
                </Button>
              </Navbar.Item>
              <Navbar.Item onClick={toggleDropdown} onKeyPress={toggleDropdown} component="a">
                <Avatar src={user.profilePic || "/images/default-profile.png"} color="primary" bordered />
                <span className="dropdown-caret" />
              </Navbar.Item>
            </Navbar.End>
          </Navbar.Menu>
        ) : (
          <Navbar.Menu>
            <Navbar.End>
              <Navbar.Item to="/login" component={Link}>
                <Title style={{ fontSize: "19px", color: "#000", fontFamily: "Ubuntu", paddingRight: "8px" }}>Sign in</Title>
              </Navbar.Item>
              <Navbar.Item to="/register" component={Link}>
                <Button auto css={{ px: "$12", fontSize: "19px", fontFamily: "Ubuntu", backgroundColor: "#4361ED" }} rounded>
                  Sign Up
                </Button>
              </Navbar.Item>
            </Navbar.End>
          </Navbar.Menu>
        )}
        <UserDropdown open={open} closeDropdown={closeDropdown} />
      </Container>
    </Navbar>
  );
}
