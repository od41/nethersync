"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const links: { title: string; href: string; description: string }[] = [
  {
    title: "About",
    href: "/about",
    description: "About the project",
  },
];

export function Navbar() {
  const currentPath = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6 mb-12">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {/* <Package2 className="h-6 w-6" /> */}
          <span className="font-bold text-primary uppercase">Nethersync</span>
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              {/* <Package2 className="h-6 w-6" /> */}
              <span className="font-bold text-primary uppercase">Keeper</span>
            </Link>
            {links.map(({ title, href, description }) => (
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
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {links.map(({ title, href, description }) => (
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
        <span>Profile</span>
        {/* <div>{formatUnits(kusdBalance as bigint, 18)}KUSD</div> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </header>
  );
}
