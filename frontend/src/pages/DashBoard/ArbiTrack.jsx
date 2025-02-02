import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ArbiTrack = ({ data, loading, error, onRefresh }) => {
    

  

    const columns = [
        { Header: "Coin", accessor: "coin1" },
        { Header: "Exchange A", accessor: "minExchange" },
        { Header: "Coin Price @ Exchange A", accessor: "minPrice1" },
        { Header: "Exchange B", accessor: "maxExchange" },
        { Header: "Coin Price @ Exchange B", accessor: "maxPrice1" },
        { 
          Header: "Profit %", 
          accessor: (row) => `${Number(row.profitPercentage || 0).toFixed(2)}%` 
        },
    ];

    return (
        <div className="w-full">
            

            {error && <div className="text-red-500 mb-4">Error: {error}</div>}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, colIdx) => (
                                <TableHead key={colIdx} className="font-bold">
                                    {column.Header}
                                    {column.sortDescFirst && (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((column, colIdx) => (
                                        <TableCell key={colIdx}>
                                            {typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {loading ? "Loading data..." : "No results available."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ArbiTrack;
