export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/client(.*)": ["admin","client"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
  "/list/clients": ["admin"],
  "/list/margin": ["admin"],
  "/list/positions": ["admin"],
};