import Table from "@/components/Table";
import StockPositionsTable from "../stocks/page";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const ClientStockPositionsPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Client Name", accessor: "name" },
    { header: "Stock Positions", accessor: "positions", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ClientWhereInput = {};
  if (queryParams?.search) {
    query.name = { contains: queryParams.search, mode: "insensitive" };
  }

  const [data, count] = await prisma.$transaction([
    prisma.client.findMany({
      where: query,
      include: { positions: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.client.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Clients Stock Positions</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button> */}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={() => null} data={[]} />
      <StockPositionsTable
        data={data.map(client => ({
          id: client.id.toString(),
          name: client.name,
          positions: client.positions.map(position => ({
            symbol: position.symbol,
            quantity: position.quantity ?? 0,
          })),
        }))}
      />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClientStockPositionsPage;