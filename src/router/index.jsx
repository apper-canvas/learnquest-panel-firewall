import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "@/layouts/Root";
import { getRouteConfig } from "./route.utils";
import App from "@/App";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const ChallengePage = lazy(() => import("@/components/pages/ChallengePage"));
const MiniGames = lazy(() => import("@/components/pages/MiniGames"));
const Progress = lazy(() => import("@/components/pages/Progress"));
const AvatarCustomization = lazy(() => import("@/components/pages/AvatarCustomization"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));

const suspenseFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={suspenseFallback}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

const authRoutes = [
  createRoute({
    path: "login",
    element: <Login />
  }),
  createRoute({
    path: "signup",
    element: <Signup />
  }),
  createRoute({
    path: "callback",
    element: <Callback />
  }),
  createRoute({
    path: "error",
    element: <ErrorPage />
  }),
  createRoute({
    path: "prompt-password/:appId/:emailAddress/:provider",
    element: <PromptPassword />
  }),
  createRoute({
    path: "reset-password/:appId/:fields",
    element: <ResetPassword />
  })
];

const mainRoutes = [
  createRoute({
    index: true,
    element: <Home />
  }),
  createRoute({
    path: "challenges/:subject",
    element: <ChallengePage />
  }),
  createRoute({
    path: "challenges/:subject/timed",
    element: <ChallengePage />
  }),
  createRoute({
    path: "mini-games/:subject",
    element: <MiniGames />
  }),
  createRoute({
    path: "progress",
    element: <Progress />
  }),
  createRoute({
    path: "avatar",
    element: <AvatarCustomization />
  }),
  createRoute({
    path: "*",
    element: <NotFound />
  })
];

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      ...authRoutes,
      {
        element: <Layout />,
        children: [
          ...mainRoutes,
          {
            element: <App />
          }
        ]
      }
    ]
  }
];
export const router = createBrowserRouter(routes);