export const sidebarConfig = [

  // SEND MESSAGE
  {
    type: "submenu",
    label: "Send Message",
    icon: "fa fa-paper-plane",
    roles: [],
    items: [
      { label: "Quick Send", href: (routes) => `${routes.cms}/messages/profile`, roles: [] },
      { label: "Send SMS", href: (routes) => `${routes.cms}/messaging/send-sms`, roles: [] },
      { label: "Send Email", href: (routes) => `${routes.cms}/messaging/send-email`, roles: [] },
      { label: "Send WhatsApp", href: (routes) => `${routes.cms}/messaging/send-whatsapp`, roles: [] },
      { label: "Bulk Messaging", href: (routes) => `${routes.cms}/messaging/bulk`, roles: [] },
      { label: "Scheduled Messages", href: (routes) => `${routes.cms}/messaging/scheduled`, roles: [] },
    ],
  },

  // MESSAGE CENTER
  {
    type: "submenu",
    label: "Message Center",
    icon: "fa fa-envelope",
    roles: [],
    items: [
      { label: "All Messages", href: (routes) => `${routes.cms}/messages/list`, roles: [] },
      { label: "Sent Messages", href: (routes) => `${routes.cms}/messages/list`, roles: [] },
      { label: "Pending / Queue", href: (routes) => `${routes.cms}/messaging/pending`, roles: [] },
      { label: "Failed Messages", href: (routes) => `${routes.cms}/messaging/failed`, roles: [] },
      { label: "Read Status", href: (routes) => `${routes.cms}/messaging/read-status`, roles: [] },
    ],
  },

  // MESSAGE TEMPLATES
  {
    type: "submenu",
    label: "Templates",
    icon: "fa fa-clone",
    roles: [],
    items: [
      { label: "All Templates", href: (routes) => `${routes.cms}/messagetemplates/list`, roles: [] },
      { label: "Create Template", href: (routes) => `${routes.cms}/messagetemplates/profile`, roles: [] },
    ],
  },

  // CONTACTS / PHONEBOOK
  {
    type: "submenu",
    label: "Contacts",
    icon: "fa fa-users",
    roles: [],
    items: [
      { label: "Client List", href: (routes) => `${routes.cms}/clients/list`, roles: [] },
      { label: "Add Client", href: (routes) => `${routes.cms}/clients/profile`, roles: [] },
      { label: "Import Contacts", href: (routes) => `${routes.cms}/clients/import`, roles: [] },
    ],
  },

  // CAMPAIGNS (🔥 THIS IS YOUR MONEY MAKER)
  {
    type: "submenu",
    label: "Campaigns",
    icon: "fa fa-bullhorn",
    roles: [],
    items: [
      { label: "All Campaigns", href: (routes) => `${routes.cms}/campaigns/list`, roles: [] },
      { label: "Create Campaign", href: (routes) => `${routes.cms}/campaigns/create`, roles: [] },
      { label: "Campaign Analytics", href: (routes) => `${routes.cms}/campaigns/analytics`, roles: [] },
      { label: "A/B Testing", href: (routes) => `${routes.cms}/campaigns/testing`, roles: [] },
    ],
  },

  // NUDGE SYSTEM (🔥 YOUR SPECIAL FEATURE)
  {
    type: "submenu",
    label: "Nudge System",
    icon: "fa fa-lightbulb-o",
    roles: [],
    items: [
      { label: "All Nudges", href: (routes) => `${routes.cms}/nudges/list`, roles: [] },
      { label: "Create Nudge", href: (routes) => `${routes.cms}/nudges/create`, roles: [] },
      { label: "Automated Nudges", href: (routes) => `${routes.cms}/nudges/automation`, roles: [] },
      { label: "Revenue Suggestions", href: (routes) => `${routes.cms}/nudges/revenue`, roles: [] },
    ],
  },

  // REPORTS & INSIGHTS
  {
    type: "submenu",
    label: "Reports",
    icon: "fa fa-bar-chart",
    roles: [],
    items: [
      { label: "Message Reports", href: (routes) => `${routes.cms}/reports/messages`, roles: [] },
      { label: "SMS Costs", href: (routes) => `${routes.cms}/reports/sms-costs`, roles: [] },
      { label: "Delivery Rates", href: (routes) => `${routes.cms}/reports/delivery`, roles: [] },
      { label: "Engagement", href: (routes) => `${routes.cms}/reports/engagement`, roles: [] },
    ],
  },

  // SETTINGS
  {
    type: "submenu",
    label: "Messaging Settings",
    icon: "fa fa-cogs",
    roles: [],
    items: [
      { label: "SMS Gateway", href: (routes) => `${routes.cms}/settings/sms`, roles: [] },
      { label: "Email SMTP", href: (routes) => `${routes.cms}/settings/email`, roles: [] },
      { label: "WhatsApp API", href: (routes) => `${routes.cms}/settings/whatsapp`, roles: [] },
      { label: "Sender IDs", href: (routes) => `${routes.cms}/settings/sender-id`, roles: [] },
    ],
  },

];