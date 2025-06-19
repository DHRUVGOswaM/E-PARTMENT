// utils/roleConfig.js
export const roleConfig = {
  SUPER_ADMIN: {
    dashboardLinks: [
      {
        title: "Role & Society Management",
        href: "/role-management",
        description: "Assign and manage roles across societies.",
      },
      {
        title: "Reports",
        href: "/app/Facilities",
        description: "Generate and view financial statements.",
      },
      {
        title: "Visitor Management",
        href: "/app/visitor",
        description: "Log visitor entries and update counts.",
      },
    ],
  },
  SOCIETY_ADMIN: {
    dashboardLinks: [
      {
        title: "Facility Booking",
        href: "/app/Facilities",
        description: "Book the community hall or gym.",
      },
      {
        title: "Visitor Management",
        href: "/app/visitors",
        description: "Log visitor entries and update counts.",
      },
      {
        title: "Payment Reports",
        href: "/billing",
        description: "View & export payment data.",
      },
      {
        title: "Noticeboard Management",
        href: "/notice-board",
        description: "Post and manage notices for residents.",
      },
      {
        title: "Emergency Alerts",
        href: "/Alerts",
        description: "Broadcast urgent notifications to residents.",
      },
      {
        title: "Polls & Voting",
        href: "/Polls",
        description: "Create and manage community polls.",
      },
      {
        title: "File a Complaint",
        href: "/complaints",
        description: "Report issues and concerns within the community.",
      },
    ],
  },
  GUARD: {
    dashboardLinks: [
      {
        title: "Visitor Management",
        href: "/visitors",
        description: "Log visitor entries and update counts.",
      },
    ],
  },
  RESIDENT: {
    dashboardLinks: [
      {
        title: "Facility Booking",
        href: "/Facilities",
        description: "Book the community hall or gym.",
      },
      {
        title: "End-to-End Accounting",
        href: "/Accounting",
        description: "Track income & expenses, manage financials.",
      },
      {
        title: "Emergency Alerts",
        href: "/Alerts",
        description: "Broadcast urgent notifications to residents.",
      },
      {
        title: "Features",
        href: "/Features",
        description: "Explore all tools and features AppSociety offers.",
      },
      {
        title: "Polls & Voting",
        href: "/Polls",
        description: "Create and manage community polls.",
      },
      {
        title: "File a Complaint",
        href: "/complaints",
        description: "Report issues and concerns within the community.",
      },
    ],
  },
};
