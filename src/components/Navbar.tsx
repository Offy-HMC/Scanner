import { AppBar, Toolbar, Box, Stack } from "@mui/material";
import ProfileMenu from "./ProfileMenu";

interface NavbarProps {
  username: string | null | undefined;
}

export default function Navbar({ username }: NavbarProps) {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        // boxShadow: "none",
      }}
    >
      <Toolbar>
        <Stack
          direction={"row"}
          flexGrow={1}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box
            ml={1.5}
            color={"var(--foreground)"}
            fontSize={18}
            fontWeight={"medium"}
          >
            {username}
          </Box>
          <ProfileMenu username={username} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
