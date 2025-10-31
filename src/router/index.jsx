import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const ChallengePage = lazy(() => import("@/components/pages/ChallengePage"));
const MiniGames = lazy(() => import("@/components/pages/MiniGames"));
const Progress = lazy(() => import("@/components/pages/Progress"));
const AvatarCustomization = lazy(() => import("@/components/pages/AvatarCustomization"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const suspenseFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Home />
      </Suspense>
    )
  },
  {
path: "challenges/:subject",
    element: (
      <Suspense fallback={suspenseFallback}>
        <ChallengePage />
      </Suspense>
    )
  },
  {
    path: "challenges/:subject/timed",
    element: (
      <Suspense fallback={suspenseFallback}>
        <ChallengePage />
      </Suspense>
    )
  },
  {
    path: "mini-games/:subject",
    element: (
      <Suspense fallback={suspenseFallback}>
        <MiniGames />
      </Suspense>
    )
  },
  {
    path: "progress",
    element: (
      <Suspense fallback={suspenseFallback}>
        <Progress />
      </Suspense>
    )
  },
  {
    path: "avatar",
    element: (
      <Suspense fallback={suspenseFallback}>
        <AvatarCustomization />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={suspenseFallback}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);