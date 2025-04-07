"use client";

import { useEffect, useState } from "react";

const getStockPrice = async (symbol: string) => {
  try {
    const response = await fetch(`/api/stocks/${symbol}`);
    if (!response.ok) throw new Error("Failed to fetch stock price");
    const data = await response.json();
    return data.current_price; // Assuming API response structure is { current_price: number }
  } catch (error) {
    console.error(`[StockPositionTable]Error fetching stock price for ${symbol}:`, error);
    return "N/A";
  }
};

const StockPositionsTable = ({ data }: { data: any[] }) => {
  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      const priceMap: Record<string, string> = {};
      for (const client of data) {
        for (const position of client.positions) {
          priceMap[position.symbol] = await getStockPrice(position.symbol);
        }
      }
      console.log("StockPositionsTable", data);
      console.log("PriceMap", priceMap);
      setPrices(priceMap);
    };
    fetchPrices();
  }, [data]);

  const renderRow = (item: {
    id: React.Key;
    name: string;
    positions: any[];
  }) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        {item.positions
          .map(
            (position) =>
              `${position.symbol} (${position.quantity}) - $${
                prices[position.symbol] || "Loading..."
              }`
          )
          .join(", ")}
      </td>
      <td></td>
    </tr>
  );

  return (
    <table className="w-full">
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  );
};

export default StockPositionsTable;