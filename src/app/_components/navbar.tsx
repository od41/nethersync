"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
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
const nsLogo = require("@/assets/logo-dark.png");

const links: { title: string; href: string; description: string }[] = [
  {
    title: "Transfers",
    href: "/transfers",
    description: "Transfer history",
  },
  {
    title: "Contracts",
    href: "/contracts",
    description: "Contracts",
  },
  {
    title: "About",
    href: "/about",
    description: "About the project",
  },
];

export function Navbar() {
  const currentPath = usePathname();
  const { signIn, user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 flex w-full justify-between h-16 items-center gap-4 px-4 md:px-6 md:mb-12">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image
            src={nsLogo.default.src}
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
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src={nsLogo.default.src}
                // className="h-6 w-6"
                alt="nethersync logo"
                width={140}
                height={22.7}
              />
            </Link>
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
            {!user ? (
              <Button onClick={signIn}>Signin</Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
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
          </nav>
          <SheetClose className="right-0 hidden" />
        </SheetContent>
      </Sheet>
      <div className="md:flex hidden   w-fit px-4 py-2 rounded-md items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-6 bg-background">
        {links.map(({ title, href }) => (
          <Link
            key={href}
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
        {!user ? (
          <Button onClick={signIn}>Signin</Button>
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
      </div>
    </header>
  );
}
