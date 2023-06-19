import { Box, Typography } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#6FA8DC",
          padding: "20px",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <Typography variant="caption" color="textprimary">
          All rights reserved &copy; {currentYear}
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: "#C1C1C1", padding: "20px" }}></Box>
    </>
  );
};

export default Footer;
