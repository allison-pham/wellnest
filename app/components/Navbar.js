import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">WellNest</Typography>
        <Stack direction="row" spacing={2}>
          <Button component={Link} href="/" color="inherit">
            Home
          </Button>
          <Button component={Link} href="/inventory" color="inherit">
            Inventory
          </Button>
          <Button component={Link} href="/signup" color="inherit">
            Sign Up
          </Button>
          <Button component={Link} href="/login" color="inherit">
            Login
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
