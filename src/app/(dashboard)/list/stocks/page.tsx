"use client";

import { useEffect, useState } from "react";

const getStockPrice = async (symbol: string) => {
  try {
    const response = await fetch(`/api/stocks/${symbol}`);
    if (!response.ok) throw new Error("Failed to fetch stock price");
    const data = await response.json();
    return data.current_price; // Assuming API response structure is { price: number }
  } catch (error) {
    console.error(`[list/stocks/page.tsx]Error fetching stock price for ${symbol}:`, error);
    return "N/A";
  }
};

interface StockPositionsTableProps {
  data: Array<{
    id: string;
    name: string;
    positions: Array<{ symbol: string; quantity: number }>;
  }>;
}

const StockPositionsTable: React.FC<StockPositionsTableProps> = ({ data = [] }) => {
  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      if (data.length === 0) return;
      console.log('StockPositionsTable',data);
      const priceMap: Record<string, string> = {};
      for (const client of data) {
        for (const position of client.positions) {
          priceMap[position.symbol] = await getStockPrice(position.symbol);
        }
      }
      setPrices(priceMap);
    };
    fetchPrices();
  }, [data]);

  return (
    <table className="w-full">
      <tbody>
        {data.map((item) => (
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
        ))}
      </tbody>
    </table>
  );
};

export default StockPositionsTable;