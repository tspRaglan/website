# thanksgary - Configuration & Settings

This document stores the essential settings for the website's hosting, domain, and version control.

---

## 📂 Project Info
- **Local Folder:** `C:\tsp\Website\website mar26`
- **Main Subpage:** `/tsp/thanksgary/`

## 🔗 Version Control (GitHub)
- **Repository:** [tspRaglan/thanksgary](https://github.com/tspRaglan/thanksgary)
- **Primary Branch:** `master`
- **Sync Tool:** GitHub Desktop & TortoiseGit (Windows Explorer)

## 🌐 Hosting (Netlify)
- **Site Name:** `tspraglan`
- **Netlify URL:** [tspraglan.netlify.app](https://tspraglan.netlify.app)
- **Custom Domain:** [raglan.au](https://raglan.au) (and www.raglan.au)

## 🛠️ DNS Settings (GoDaddy)
These records are required in GoDaddy DNS Management for the site to function:

| Type | Name | Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `75.2.60.5` | Points main domain to Netlify |
| **CNAME** | `www` | `tspraglan.netlify.app` | Points www subdomain to Netlify |
| **TXT** | `verified-for-netlify` | `tspraglan.netlify.app` | Proves domain ownership to Netlify |
| **MX** | `@` | `ASPMX.L.GOOGLE.COM` (Priority 1) | Google Workspace Mail |
| **MX** | `@` | `ALT1.ASPMX.L.GOOGLE.COM` (Priority 5) | Google Workspace Mail |
| **MX** | `@` | `ALT2.ASPMX.L.GOOGLE.COM` (Priority 5) | Google Workspace Mail |
| **MX** | `@` | `ALT3.ASPMX.L.GOOGLE.COM` (Priority 10) | Google Workspace Mail |
| **MX** | `@` | `ALT4.ASPMX.L.GOOGLE.COM` (Priority 10) | Google Workspace Mail |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | Google Workspace SPF |

## 🚀 How to Update
1.  Make changes to the code in the local folder.
2.  Open **GitHub Desktop** or **Right-Click** in Windows Explorer.
3.  **Commit** your changes (save them locally).
4.  **Push** your changes (upload them to GitHub).
5.  Netlify will automatically detect the push and update the live website within seconds.
