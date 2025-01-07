"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { stringAvatar } from "@/utils/utilFnc";

export default function ProfileMenu({
  username,
}: {
  username: string | null | undefined;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar
          alt={username || ""}
          {...stringAvatar(username || "unknown", 32)}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <MenuItem onClick={() => signOut()}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
