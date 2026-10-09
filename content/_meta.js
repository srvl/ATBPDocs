// Folders with type 'page' are the tabs along the top. The last four are
// hidden from the desktop tab row by app/atbp.css and reached from the Guides
// menu instead. Folder names are the
// page URLs, so never rename or move them.
export default {
  "index": {
    "title": "Home",
    "type": "page",
    "theme": {
      "layout": "full",
      "sidebar": false,
      "toc": false,
      "breadcrumb": false,
      "pagination": false,
      "timestamp": false
    }
  },
  "plans": { "title": "Plans", "type": "page" },
  "billing": { "title": "Account & Billing", "type": "page" },
  "games": { "title": "Games", "type": "page" },
  "using_the_panel": { "title": "Server Panel", "type": "page" },
  "guides": {
    "title": "Guides",
    "type": "menu",
    "items": {
      "running_a_server": { "title": "Running a Server", "href": "/running_a_server/updating" },
      "plugins_and_modifications": { "title": "Plugins & Mods", "href": "/plugins_and_modifications/installing-plugins" },
      "other-servers": { "title": "Other Servers", "href": "/other-servers/ark" },
      "extras": { "title": "Extras", "href": "/extras/ping-issues" }
    }
  },
  "general": { "title": "About ATBP", "type": "page" },
  "running_a_server": { "title": "Running a Server", "type": "page" },
  "plugins_and_modifications": { "title": "Plugins & Mods", "type": "page" },
  "other-servers": { "title": "Other Servers", "type": "page" },
  "extras": { "title": "Extras", "type": "page" }
}
