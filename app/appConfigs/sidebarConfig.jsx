import { hiveRoutes } from "../appConfigs/hiveRoutes";

export const sidebarConfig = [

  // SEND MESSAGE
  {
    type: "submenu",
    label: "Send Message",
    icon: "fa fa-paper-plane",
    roles: [],
    items: [
      { label: "Quick Send", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messages/profile`, roles: [] },
      { label: "Send SMS", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/send-sms`, roles: [] },
      { label: "Send Email", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/send-email`, roles: [] },
      { label: "Send WhatsApp", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/send-whatsapp`, roles: [] },
      { label: "Bulk Messaging", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/bulk`, roles: [] },
      { label: "Scheduled Messages", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/scheduled`, roles: [] },
    ],
  },

  // MESSAGE CENTER
  {
    type: "submenu",
    label: "Message Center",
    icon: "fa fa-envelope",
    roles: [],
    items: [
      { label: "All Messages", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messages/list`, roles: [] },
      { label: "Sent Messages", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messages/list`, roles: [] },
      { label: "Pending / Queue", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/pending`, roles: [] },
      { label: "Failed Messages", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/failed`, roles: [] },
      { label: "Read Status", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messaging/read-status`, roles: [] },
    ],
  },

  // MESSAGE TEMPLATES
  {
    type: "submenu",
    label: "Templates",
    icon: "fa fa-clone",
    roles: [],
    items: [
      { label: "All Templates", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messagetemplates/list`, roles: [] },
      { label: "Create Template", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/messagetemplates/profile`, roles: [] },
    ],
  },

  // CONTACTS / PHONEBOOK
  {
    type: "submenu",
    label: "Contacts",
    icon: "fa fa-users",
    roles: [],
    items: [
      { label: "Client List", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/clients/list`, roles: [] },
      { label: "Add Client", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/clients/profile`, roles: [] },
      { label: "Import Contacts", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/clients/import`, roles: [] },
    ],
  },

  // CAMPAIGNS (🔥 THIS IS YOUR MONEY MAKER)
  {
    type: "submenu",
    label: "Campaigns",
    icon: "fa fa-bullhorn",
    roles: [],
    items: [
      { label: "All Campaigns", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/campaigns/list`, roles: [] },
      { label: "Create Campaign", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/campaigns/create`, roles: [] },
      { label: "Campaign Analytics", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/campaigns/analytics`, roles: [] },
      { label: "A/B Testing", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/campaigns/testing`, roles: [] },
    ],
  },

  // NUDGE SYSTEM (🔥 YOUR SPECIAL FEATURE)
  {
    type: "submenu",
    label: "Nudge System",
    icon: "fa fa-lightbulb-o",
    roles: [],
    items: [
      { label: "All Nudges", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/nudges/list`, roles: [] },
      { label: "Create Nudge", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/nudges/create`, roles: [] },
      { label: "Automated Nudges", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/nudges/automation`, roles: [] },
      { label: "Revenue Suggestions", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/nudges/revenue`, roles: [] },
    ],
  },

  // REPORTS & INSIGHTS
  {
    type: "submenu",
    label: "Reports",
    icon: "fa fa-bar-chart",
    roles: [],
    items: [
      { label: "Message Reports", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/reports/messages`, roles: [] },
      { label: "SMS Costs", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/reports/sms-costs`, roles: [] },
      { label: "Delivery Rates", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/reports/delivery`, roles: [] },
      { label: "Engagement", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/reports/engagement`, roles: [] },
    ],
  },

  // SETTINGS
  {
    type: "submenu",
    label: "Messaging Settings",
    icon: "fa fa-cogs",
    roles: [],
    items: [
      { label: "SMS Gateway", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/settings/sms`, roles: [] },
      { label: "Email SMTP", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/settings/email`, roles: [] },
      { label: "WhatsApp API", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/settings/whatsapp`, roles: [] },
      { label: "Sender IDs", href: (routes) => `${hiveRoutes.hiveBaseRoute}/${routes.cms}/settings/sender-id`, roles: [] },
    ],
  },

];