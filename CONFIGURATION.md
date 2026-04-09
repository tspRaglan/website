# raglan.au - Configuration & Settings

This document stores the essential settings for the website's hosting, domain, and version control.

> ⚠️ **HOSTING: GitHub Pages — NOT Netlify.**
> The Netlify site (`tspraglan.netlify.app`) has been deleted. Do not reconnect it.
> All deployments go via GitHub push to `master` → GitHub Pages auto-deploys.

---

## 📂 Project Info
- **Live folder:** `C:\tsp\Website\website\` — push from here
- **Working folder:** `C:\tsp\Website\website apr26\` — edit here, copy to live when ready
- **Default Landing:** `/tsp/katherine/`

## 🔗 Version Control (GitHub)
- **Repository:** [tspRaglan/website](https://github.com/tspRaglan/website)
- **Live branch:** `master` — GitHub Pages deploys from here
- **Working branches:** monthly (e.g. `apr26`, `may26`) — push regularly as backup
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

## 🚀 How to Deploy
1. Make changes in the working folder (e.g. `website apr26\`)
2. When ready to go live, copy changed files to `website\`
3. Open `website\` in GitHub Desktop or TortoiseGit
4. Commit with a descriptive message
5. Push to `master` — GitHub Pages auto-deploys within ~30 seconds
