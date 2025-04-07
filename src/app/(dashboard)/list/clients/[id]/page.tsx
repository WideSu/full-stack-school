import Performance from "@/components/Performance";
// import ClientPositionCard from "@/components/ClientPositionCard"; // Component to display positions
// import ClientMarginCard from "@/components/ClientMarginCard"; // Component to display margin status
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Client, Position, Margin } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const SingleClientPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const client: Client | null = await prisma.client.findUnique({
    where: { id: parseInt(id) },
    include: {
      positions: true,
      margins: true,
    },
  });

  if (!client) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* CLIENT INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="/clientAvatar.png" // Default client image
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{client.name}</h1>
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
          {/* POSITION & MARGIN STATUS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* Positions */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singlePosition.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* <Suspense fallback="loading...">
                <ClientPositionCard positions={client.positions} />
              </Suspense> */}
            </div>
            {/* Margin Status */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleMargin.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* <Suspense fallback="loading...">
                <ClientMarginCard margins={client.margins} />
              </Suspense> */}
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/positions?clientId=${client.id}`}
            >
              Client&apos;s Positions
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/margins?clientId=${client.id}`}
            >
              Client&apos;s Margins
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/transactions?clientId=${client.id}`}
            >
              Client&apos;s Transactions
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/activity?clientId=${client.id}`}
            >
              Client&apos;s Activity
            </Link>
          </div>
        </div>
        <Performance />
      </div>
    </div>
  );
};

export default SingleClientPage;
