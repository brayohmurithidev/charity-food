import { Container, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{ textAlign: "center", paddingTop: "100px", minHeight: "85vh" }}
    >
      <Typography variant="h1" sx={{ fontSize: "48px", marginBottom: "16px" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontSize: "24px", marginBottom: "32px" }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "16px" }}>
        The page you are looking for does not exist.
      </Typography>
    </Container>
  );
};

export default NotFound;
