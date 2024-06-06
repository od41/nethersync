import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export const PreviewSheet = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            Preview
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>File title</SheetTitle>
            <SheetDescription>Message...</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
