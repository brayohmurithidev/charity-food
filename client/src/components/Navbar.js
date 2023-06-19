import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const pages = [
  { name: "Home", path_to: "/" },
  { name: "About", path_to: "/about" },
  { name: "Donate", path_to: "/donate" },
  { name: "Find Food Banks", path_to: "/find_foodbanks" },
  { name: "Contact", path_to: "/contact" },
];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  // const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // const handleOpenUserMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", marginBottom: "30px" }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <VolunteerActivismIcon
              sx={{
                color: "#2B78E4",
                fontSize: "30px",
                marginRight: "20px",
                display: { xs: "none", md: "flex" },
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 900,
                letterSpacing: ".3rem",
                color: "#2B78E4",
                fontSize: "30px",
                textDecoration: "none",
              }}
            >
              Charity Food
            </Typography>
          </Box>

          {/* MOBILE DEVICE MENU */}

          <VolunteerActivismIcon
            sx={{
              color: "#2B78E4",
              fontSize: "30px",
              marginRight: "20px",
              display: { xs: "flex", md: "none" },
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#2B78E4",
              textDecoration: "none",
            }}
          >
            Charity Food
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: "#333",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link className="navbar-links" to={page.path_to}>
                    {page.name}
                  </Link>
                  {/* <Typography sx={{
                    color: '#333',
                    fontSize: '20px'
                  }} 
                  textAlign="center">{page}</Typography> */}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              display: { md: "flex", xs: "none" },
              justifyContent: "flex-end",
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link className="navbar-links" to={page.path_to}>
                  {page.name}
                </Link>
              </Button>
            ))}
            {/* <Box sx={{  display: { md: "flex" }, marginLeft: '20px' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{
                    color: '#333',
                    fontSize: '20px'
                  }}  textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
