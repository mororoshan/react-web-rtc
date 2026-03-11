import MainPage from "../../pages/MainPage/MainPage";
import ConnectionPage from "../../pages/ConnectionPage";
import LiquidGlassPage from "../../pages/LiquidGlassPage";
import UiShowcasePage from "../../pages/UiShowcasePage/UiShowcasePage";

export const ROUTES = {
    HOME: "/",
    SIMPLE_CONNECT: "/simple-connect",
    LIQUID_GLASS: "/glass",
    UI_SHOWCASE: "/ui-showcase",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const routesConfig = [
    { path: ROUTES.HOME, name: "Home", component: MainPage },
    { path: ROUTES.SIMPLE_CONNECT, name: "Simple Connect", component: ConnectionPage },
    { path: ROUTES.LIQUID_GLASS, name: "Glass", component: LiquidGlassPage },
    { path: ROUTES.UI_SHOWCASE, name: "UI Showcase", component: UiShowcasePage },
] as const;

export const routes = ROUTES;
