# NexHook Agency — React Website

Premium black & blue agency website for NexHook built with React 18.

---

## 🚀 Quick Start

```bash
# 1. Unzip and enter the folder
cd nexhook-agency

# 2. Install dependencies
npm install

# 3. Start dev server
npm start
# Opens at http://localhost:3000

# 4. Build for production
npm run build
```

---

## 📧 Set Up Form → Email (REQUIRED)

Every time someone fills the contact/audit form, you'll get an email.

**Steps (takes 2 minutes):**

1. Go to **https://formspree.io** and sign up free
2. Click **"+ New Form"**
3. Enter **your email address**
4. Copy the **Form ID** (looks like `xpwzabcd`)
5. Open `src/sections/AuditContact.js`
6. Find line:  `const FORMSPREE_ID = 'YOUR_FORM_ID';`
7. Replace `YOUR_FORM_ID` with your actual ID

✅ Done! Every form submission will land in your inbox instantly.

---

## 📊 Form → Google Sheets (Optional)

To also save submissions in a Google Sheet automatically:

1. Go to **https://zapier.com** (free plan)
2. Create a new Zap:
   - **Trigger:** Formspree → New Submission
   - **Action:** Google Sheets → Create Row
3. Map the fields (name, email, phone, etc.)
4. Turn on the Zap

Every form fill now adds a row to your spreadsheet automatically.

---

## 🎬 Add Real Client Video Testimonials

1. Upload your client testimonial video to YouTube (unlisted or public)
2. Copy the Video ID from the URL: `youtube.com/watch?v=VIDEO_ID_HERE`
3. Open `src/sections/VideoTestimonials.js`
4. Replace the `embedId` values in the `VIDEOS` array

---

## 📁 Project Structure

```
nexhook-agency/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Cursor.js         Custom animated cursor
│   │   ├── Navbar.js + CSS   Fixed nav with mobile menu
│   │   └── useReveal.js      Scroll-reveal hook
│   ├── sections/
│   │   ├── Hero.js + CSS
│   │   ├── Marquee.js
│   │   ├── Services.js + CSS
│   │   ├── Process.js + CSS
│   │   ├── Portfolio.js + CSS  (with live links)
│   │   ├── Team.js + CSS       (5 members)
│   │   ├── VideoTestimonials.js + CSS
│   │   ├── Reviews.js + CSS    (6 text reviews)
│   │   ├── AuditContact.js + CSS  ← FORM IS HERE
│   │   ├── FAQ.js + CSS
│   │   └── Footer.js + CSS
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css   (global tokens, cursor, utilities)
└── package.json
```

---

## 🎨 Customise

### Change Agency Name
Search & replace `NexHook` across all files.

### Change Colours
Edit CSS variables in `src/index.css`:
```css
:root {
  --blue:  #2459e7;   /* main blue  */
  --cyan:  #38bdf8;   /* accent     */
  --bg:    #04050a;   /* background */
}
```

### Update Team Members
Edit the `TEAM` array in `src/sections/Team.js`

### Update Projects
Edit the `PROJECTS` array in `src/sections/Portfolio.js` — update `link` to your real URLs.

### Update Pricing / Contact Details
Edit `src/sections/Footer.js` for email, phone, address.

---

## 🛠 Tech Stack
- React 18
- Plain CSS per component (no UI library)
- Google Fonts — Bricolage Grotesque + Inter
- Formspree for form submissions
- IntersectionObserver for scroll animations
