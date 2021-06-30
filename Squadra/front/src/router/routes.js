const routes = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue"), name: "Home" }
    ]
  },
  {
    path: "/public",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Public.vue"), name: "Public" }
    ]
  },
  {
    path: "/",
    component: () => import("layouts/StartLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Start.vue"), name: "Start" }
    ]
  },
  {
    path: "/user",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Profile.vue") }]
  },
  {
    path: "/msg",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Feedback.vue") }]
  },
  {
    path: "/own",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/OwnMatches.vue") }]
  },
  {
    path: "/create",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Create.vue") }]
  },
  {
    path: "/invite",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Invite.vue") }]
  },
  {
    path: "/teams",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Team.vue") }]
  },
  {
    path: "/team/create",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/CreateTeam.vue") }]
  },
  {
    path: "/tournaments",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/TournamentsArea.vue") }
    ]
  },
  {
    path: "/tournament/create",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/CreateTournament.vue") }
    ]
  },
  {
    path: "/tournament/view/:id",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/TournamentView.vue") }
    ]
  },
  {
    path: "/o2cZUrR8U2mSMv4YKwM7",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Stats.vue") }]
  },
  {
    path: "/p7wPTjIuEP23GAcWF1TD",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Admin.vue") }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
