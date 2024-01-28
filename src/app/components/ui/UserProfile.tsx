import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User } from "@/global";
import { Card } from "./card";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogoutButton } from "../dashboardcomponents/auth-buttons";

type UserProps = {
  user: User;
};
function UserProfile({ user }: UserProps) {
  const { name, email, image } = user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={image} alt={`${name} Profile Picture`} />
          <AvatarFallback>User Image</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Card className="flex px-5 py-8 mt-2 mr-[15rem] gap-6">
          <AvatarImage
            className="w-24 rounded-full"
            src={image}
            width={10}
            height={10}
            alt={`${name} Profile Picture`}
          />
          <div className="flex flex-col items-start gap-3">
            <h3>Name : {name}</h3>
            <h2>Email : {email}</h2>
            <LogoutButton className="mt-3" />
          </div>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserProfile;
