"use client";

import React, { useContext } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CircleUser,
  Menu,
  Package2,
  Search,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { AuthContext } from "@/context/auth";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MyConnectButton } from "@/components/my-connect-button";
import { useAccount, ConnectButton } from "@particle-network/connectkit";

const nsLogo = require("@/assets/logo-light.png");
const nsLogoLight = require("@/assets/logo-dark.png");

interface NavbarProps {
  isDark?: boolean;
  showCTA?: boolean;
}

const links: { title: string; href: string; description: string }[] = [
  // {
  //   title: "Transfers",
  //   href: "/transfers",
  //   description: "Transfer history",
  // },
  // {
  //   title: "Contracts",
  //   href: "/contracts",
  //   description: "Contracts",
  // },
  {
    title: "About",
    href: "/about",
    description: "About the project",
  },
];

export function Navbar({ isDark = true, showCTA = false }: NavbarProps) {
  const currentPath = usePathname();
  const { signIn, user } = useContext(AuthContext);
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 bg-transparent flex w-full justify-between h-16 items-center gap-4 px-4 md:px-6 md:mb-12">
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100vw-2em)] ml-4 bg-background"
          align="center"
          sideOffset={20}
        >
          <nav className="grid gap-6 text-lg font-medium">
            {links.map(({ title, href }) => (
              <Link
                key={`main-nav-link-${href}`}
                href={href}
                className={`transition-colors hover:text-primary hover:underline hover:underline-offset-4
                ${
                  currentPath === href
                    ? "text-primary underline underline-offset-4"
                    : "text-muted-foreground"
                }
              `}
              >
                {title}
              </Link>
            ))}
          </nav>
        </PopoverContent>
      </Popover> */}
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image
            src={isDark ? nsLogoLight.default.src : nsLogo.default.src}
            // className="h-6 w-6"
            alt="nethersync logo"
            width={140}
            height={22.7}
          />
          <span className="font-bold text-white shadow-md  uppercase font-display">
            {/* Nethersync */}
          </span>
        </Link>
      </nav>

      {/* <div className="md:hidden">
        {!user ? (
          <Button onClick={signIn} variant="secondary">
            Log In
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="mailto:hello@nethersync.xyz">Get Help</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div> */}

      <div className="w-fit">
        {showCTA ? (
          <Button variant="outline" className="" asChild>
            <Link href={"/transfers/send"}>
              Send Files <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <ConnectButton />
        )}
      </div>

      <div className="md:hidden hidden w-fit px-4 py-2 rounded-md items-center justify-end gap-4 md:ml-auto md:gap-6 bg-background">
        {/* {links.map(({ title, href }) => (
          <Link
            key={href}
            href={href}
            className={`transition-colors text-sm hover:text-primary hover:underline hover:underline-offset-4
                ${
                  currentPath === href
                    ? "text-primary underline underline-offset-4"
                    : "text-muted-foreground"
                }
              `}
          >
            {title}
          </Link>
        ))} */}
        {/* {!user ? (
          <Button onClick={signIn}>Log In</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="mailto:hello@nethersync.xyz">Get Help</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}
      </div>
      {/* <Button variant="outline" asChild>
        <Link
          href={"/about"}
          className={`transition-colors text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4 shrink-0 md:hidden`}
        >
          About
        </Link>
      </Button> */}
    </header>
  );
}
