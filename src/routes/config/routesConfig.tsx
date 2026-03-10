import MainPage from "../../pages/MainPage/MainPage";
import ConnectionPage from "../../pages/ConnectionPage";
import LiquidGlassPage from "../../pages/LiquidGlassPage";

export const ROUTES = {
    HOME: "/",
    SIMPLE_CONNECT: "/simple-connect",
    LIQUID_GLASS: "/glass",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const routesConfig = [
    { path: ROUTES.HOME, name: "Home", component: MainPage },
    { path: ROUTES.SIMPLE_CONNECT, name: "Simple Connect", component: ConnectionPage },
    { path: ROUTES.LIQUID_GLASS, name: "Glass", component: LiquidGlassPage },
] as const;

export const routes = ROUTES;
