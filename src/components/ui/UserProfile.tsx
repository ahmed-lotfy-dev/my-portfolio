import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User } from "@/global";
import { Card } from "./card";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LoginButton, LogoutButton } from "../dashboardcomponents/auth-buttons";

type UserProps = {
  className?: string;
  user: User | null;
};

function UserProfile({ className, user }: UserProps) {
  return (
    <div className={className}>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                className="w-24  rounded-full aspect-auto bg-gray-400"
                src={user.image}
                alt={`${user.name} Profile Picture`}
              />
              <AvatarFallback>User Image</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex justify-center items-center mt-3">
            <Card className="flex flex-col p-6 gap-4">
              <Image
                className="rounded-full mb-4 m-auto"
                width={80}
                height={80}
                src={user.image}
                alt={`${user.name} Profile Picture`}
              />

              <div className="flex flex-col items-center gap-3">
                <h3 className="text-lg font-bold">{user.name}</h3>
                <h2 className="text-gray-500">{user.email}</h2>
              </div>
              <LogoutButton className="mt-3" />
            </Card>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                className="w-24  rounded-full bg-gray-400"
                src="https://via.placeholder.com/150"
                alt="not logged in profile image placeholder"
              />
              <AvatarFallback>User Image</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Card className="flex flex-col p-6 gap-4">
              <Avatar>
                <AvatarImage
                  className="w-24  rounded-full mb-4"
                  src="https://via.placeholder.com/300"
                  alt="not logged in profile image placeholder"
                />{" "}
              </Avatar>

              <div className="flex flex-col items-start gap-3">
                <h3 className="text-lg font-bold">You are not logged in</h3>
                <LoginButton className="mt-3" />
              </div>
            </Card>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default UserProfile;
