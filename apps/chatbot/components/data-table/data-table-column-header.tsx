"use client";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<"button"> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <button
      className={cn(
        "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      type="button"
      {...props}
    >
      {label}
      {column.getIsSorted() === "desc" ? (
        <ChevronDown />
      ) : column.getIsSorted() === "asc" ? (
        <ChevronUp />
      ) : (
        <ChevronsUpDown />
      )}
    </button>
  );
}
