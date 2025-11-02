"use client"; // enable Next.js client-side rendering for this component

import { // import specific hooks and utilities from @tanstack/react-table to handle table logic and state
  getPaginationRowModel, // import function to manage pagination row model for table
  ColumnDef, // import type defining structure of a column
  flexRender, // import function to render flexible cell or header content dynamically
  getCoreRowModel, // import function to compute core row model for rendering
  useReactTable, // import main hook to create and manage table instance
} from "@tanstack/react-table";
import Image from "next/image"; // import optimized Next.js image component for icons
import { redirect } from "next/navigation"; // import redirect function to navigate programmatically
import { useEffect } from "react"; // import React hook to perform side effects like auth checks

import { Button } from "@/components/ui/button"; // import custom Button UI component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // import reusable table UI components
import { decryptKey } from "@/lib/utils"; // import custom utility function to decrypt stored keys

interface DataTableProps<TData, TValue> { // define a generic interface for DataTable props with flexible data and value types
  columns: ColumnDef<TData, TValue>[]; // specify an array of column definitions describing table structure
  data: TData[]; // specify an array of data entries that will populate the table
}

// define a functional component named 'DataTable' to render a secure, paginated data table which takes following props
export function DataTable<TData, TValue>({
  columns, // array of column definitions for table rendering
  data, // array of data entries displayed in table
}: DataTableProps<TData, TValue>) {
  const encryptedKey = // get encrypted admin key from browser storage for authentication
    typeof window !== "undefined" // check if running on client side before accessing localStorage
      ? window.localStorage.getItem("accessKey") // retrieve the stored encrypted key
      : null; // set to null if running on server to prevent reference error

  useEffect(() => { // execute authentication check when component mounts or key changes
    const accessKey = encryptedKey && decryptKey(encryptedKey); // decrypt stored key only if available

    if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) { // compare decrypted key with valid admin key to validate access
      redirect("/"); // redirect unauthorized users to home page for security
    }
  }, [encryptedKey]); // re-run effect when encryptedKey changes to keep auth updated

  const table = useReactTable({ // create table instance to manage data, columns, and models
    data, // pass provided dataset for rendering
    columns, // pass column definitions to configure table layout
    getCoreRowModel: getCoreRowModel(), // initialize core row model for base data rendering
    getPaginationRowModel: getPaginationRowModel(), // initialize pagination model for managing page changes
  });

  return (
    <div className="data-table">
      <Table className="shad-table">
        <TableHeader className=" bg-dark-200">
          {table.getHeaderGroups().map((headerGroup) => ( // iterate over header groups to render grouped column headers dynamically
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {headerGroup.headers.map((header) => { // iterate through each header within group to render table headers
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder // check if header is placeholder before rendering
                      ? null // skip rendering for placeholder headers
                      : flexRender( // dynamically render header content using provided render function
                          header.column.columnDef.header, // render header definition
                          header.getContext() // provide context for rendering logic
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? ( // check if there are any rows to display
            table.getRowModel().rows.map((row) => ( // render each row using visible cells
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"} // set data attribute if row is selected for styling
                className="shad-table-row"
              >
                {row.getVisibleCells().map((cell) => ( // render all visible cells of each row
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())} {/* dynamically render cell content with context */}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results. {/* display fallback message when no rows exist */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="table-actions">
        <Button
          variant="outline" // apply outlined button style
          size="sm" // use small button size for compact UI
          onClick={() => table.previousPage()} // trigger function to navigate to previous page in pagination
          disabled={!table.getCanPreviousPage()} // disable button when no previous page exists
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow"
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()} // trigger function to move to next page
          disabled={!table.getCanNextPage()} // disable button if no further pages available
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow "
            className="rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}
