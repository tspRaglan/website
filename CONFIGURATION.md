# thanksgary - Configuration & Settings

This document stores the essential settings for the website's hosting, domain, and version control.

---

## 📂 Project Info
- **Local Folder:** `C:\tsp\Website\website apr26`
- **Default Landing:** `/tsp/katherine/`

## 🔗 Version Control (GitHub)
- **Repository:** [tspRaglan/thanksgary](https://github.com/tspRaglan/thanksgary)
- **Primary Branch:** `master`
- **Sync Tool:** GitHub Desktop & TortoiseGit (Windows Explorer)

## 🌐 Hosting (GitHub Pages)
- **Platform:** GitHub Pages (auto-deploys from `master` branch)
- **Custom Domain:** [raglan.au](https://raglan.au) (and www.raglan.au)
- **CNAME file:** `CNAME` in repo root contains `raglan.au`

## 🛠️ DNS Settings (GoDaddy)
These records are required in GoDaddy DNS Management for the site to function:

| Type | Name | Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | Points main domain to GitHub Pages |
| **A** | `@` | `185.199.109.153` | Points main domain to GitHub Pages |
| **A** | `@` | `185.199.110.153` | Points main domain to GitHub Pages |
| **A** | `@` | `185.199.111.153` | Points main domain to GitHub Pages |
| **CNAME** | `www` | `tspraglan.github.io.` | Points www subdomain to GitHub Pages |
| **CNAME** | `_domainconnect` | `_domainconnect.gd.domaincontrol.com.` | GoDaddy internal (do not delete) |
| **MX** | `@` | `aspmx.l.google.com.` (Priority 1) | Google Workspace Mail |
| **MX** | `@` | `alt1.aspmx.l.google.com.` (Priority 5) | Google Workspace Mail |
| **MX** | `@` | `alt2.aspmx.l.google.com.` (Priority 5) | Google Workspace Mail |
| **MX** | `@` | `alt3.aspmx.l.google.com.` (Priority 10) | Google Workspace Mail |
| **MX** | `@` | `alt4.aspmx.l.google.com.` (Priority 10) | Google Workspace Mail |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | Google Workspace SPF |
| **NS** | `@` | `ns27.domaincontrol.com.` | GoDaddy nameserver (do not delete) |
| **NS** | `@` | `ns28.domaincontrol.com.` | GoDaddy nameserver (do not delete) |

## 🚀 How to Update
1.  Make changes to the code in the local folder.
2.  Open **GitHub Desktop** or **Right-Click** in Windows Explorer.
3.  **Commit** your changes (save them locally).
4.  **Push** your changes (upload them to GitHub).
5.  GitHub Pages will automatically detect the push and update the live website.
