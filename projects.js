/* ============================================================
   projects.js — project data. Data only: no markup, no DOM.
   ------------------------------------------------------------
   render.js turns these objects into HTML; index.html, archive.html
   and project.html only choose which ones to show. Adding a project
   means adding one object here and nothing else.

   Every entry has:
     group    'product' | 'data' | 'design'
              (also sets the next-project order at the foot of a case study)
     layout   'technical' | 'case'                (picks the template)
     category short line above the page title
     title    full title, used as the page h1
     card     { chip, blurb, image, title? }      (how it looks in a grid;
              title is an optional shorter label for the card)
     meta     four label/value pairs for the header row

   A 'case' entry then has:
     hero, heroCaption, background, challenge, solution, result, gallery[]

   A 'technical' entry has: lede[], sections[], links[]
     A section can include any of: heading, body, note,
     code {file, src}, image {src, alt, caption}

   An entry may also carry a `feature` block, which is the large
   two-column card the homepage builds for it. See render.js →
   featureCard for the shape.
   ============================================================ */

const projectData = {

  /* ══════════════════════════════════════════════════════════
     PART 01 — PRODUCT
     ══════════════════════════════════════════════════════════ */

  "brushfactory": {
    group: "product",
    layout: "technical",
    category: "Product · Design & Build",
    title: "Brushfactory",
    card: {
      chip: "Live Product",
      blurb: "A converter for brush files between Photoshop, Procreate, Clip Studio Paint and Krita, alongside the test harness I built to check that a brush still behaves the same after it moves. Live now, with a published report on what carries over per format.",
      image: "images/brushfactory-home.jpg"
    },
    meta: [
      { label: "Type",  value: "Live product" },
      { label: "Role",  value: "Design & build" },
      { label: "Stack", value: "Python, SQLite, Stripe" },
      { label: "Status", value: "In development" }
    ],
    feature: {
      mediaSide: "left",
      height: "card-lg",
      media: {
        type: "image",
        fit: "contain",
        src: "images/brushfactory-home.jpg",
        alt: "The Brushfactory home page: the four supported formats, and a table showing which brush settings carry over exactly between Photoshop, Procreate, Clip Studio and Krita"
      },
      heading: "Your brushes, wherever you draw.",
      body: "Brushes do not move between drawing apps. Every app stores them in its own undocumented binary format, and most converters get around that by flattening the brush into a stamp, which loses the pressure settings and the grain. Brushfactory writes real settings for the target app instead, and the site carries a table showing which settings come across exactly and which ones get matched as closely as the target app allows.",
      actions: [
        { href: "https://brushfactory.co", label: "Visit brushfactory.co", style: "primary", external: true, icon: "fa-arrow-right", iconTurn: true },
        { project: "brushfactory", label: "How I built it", style: "secondary" }
      ]
    },
    lede: [
      { label: "The Problem", text: "If you switch drawing apps, your brushes do not come with you. Every app stores them in its own binary format, none of which are documented, and the settings do not line up one to one. Most converters get around this by flattening the brush tip into a stamp, but there is a growing need for artists to keep their brushes when moving between programs, I built this site to try and remedy this issue!" },
      { label: "What It Is",  text: "Brushfactory reads a brush into a universal format and then writes real settings for the target app instead of faking them. It handles Photoshop, Procreate, Clip Studio Paint and Krita in any direction. It is live now with three free conversions a month and a paid tier for unlimited use and batch conversion." }
    ],
    sections: [
      {
        heading: "Four formats, none of them documented",
        body: "Each app stores brushes differently. Working out what each field does meant writing a file, opening it in the real app, and seeing what changed. I did that a lot, while also putting the engine behind a small CLI so I could run conversions without going through the site, which made the testing much faster. MyPaint and Affinity are listed as upcoming on the site, but they are not wired up yet.",
        code: {
          file: "Terminal",
          src: `python main.py inspect  some.brushset
python main.py convert  some.abr --to kpp -o out/
python main.py batch    packs/ --to sut -o bundle.zip`
        }
      },
      {
        heading: "The hard part is feel, not settings",
        body: "Copying the numbers across is the easy half. Two brushes can have the same size, spacing and opacity and still feel nothing alike. Each app interprets those numbers differently, and the grain and pressure response carry most of the character. I was checking this by eye at first, but I could not stay consistent across four formats and a few hundred conversions. So, I started measuring it instead."
      },
      {
        heading: "Measuring drift instead of eyeballing it",
        body: "I built a harness that takes a brush, converts it to every other format, reads each one back through the real codecs, and compares them to the source. It reports size, spacing, opacity, grain and dynamics for each format and flags anything that moved more than 2%. It also renders a sheet with the tip, the grain and a test stroke for every format. All of this is drawn by the same renderer, so anything I can see in it is real mapping drift and not just one app's brush engine looking different from another's.",
        code: {
          file: "test_brushes/converted/<brush>/",
          src: `cohesion_sheet.png     tip, grain and a test stroke per format
cohesion_report.txt    size / spacing / opacity / grain / dynamics
                       with a warning on anything >2% from source
<format>/              the converted files, ready to import and
                       feel-test on a real canvas`
        }
      },
      {
        heading: "Saying plainly what doesn't work",
        body: "The home page carries a table of what carries over, marked either as exact or as matched as closely as the app allows. Behind it, there is a longer fidelity report with the support status of each format and the limits written out. Wet media between Procreate and Clip Studio is approximated, tilt and speed dynamics only partly map onto Krita, and Clip Studio resamples textures over 1024 pixels. This probably costs me some conversions since people can see the rough edges up front. I would rather do that than have someone find out after importing fifty brushes.",
        note: "The table on the home page, the fidelity report behind it and the support status shown in the converter are three views of the same information, so a fix has to land in three places. I put cross-references in each file to keep them from drifting apart."
      },
      {
        heading: "Building for the future",
        body: "What is set up right now is a really solid foundation that proves cross-platform brush parity is actually possible. My focus moving forward will be refining those edge cases and adding support for even more design software to the ecosystem."
      }
    ],
    links: [
      { label: "brushfactory.co", href: "https://brushfactory.co", icon: "link" },
      { label: "Fidelity report", href: "https://brushfactory.co/fidelity", icon: "link" }
    ]
  },

  "dmarc": {
    group: "data",
    layout: "technical",
    category: "Data Pipeline & Modeling",
    title: "DMARC Network Analysis",
    card: {
      chip: "R Pipeline",
      blurb: "A reproducible R pipeline for cleaning visitor logs from 90+ food pantry locations. It joins logs with ACS Census data, maps them geographically, and forecasts future demand.",
      image: "images/dmarc4.png"
    },
    meta: [
      { label: "Organization", value: "DMARC Food Pantry" },
      { label: "Role",         value: "Predictive Modeling" },
      { label: "Tech Stack",   value: "R, Tidyverse, GIS" },
      { label: "Focus",        value: "Methodology" }
    ],
    feature: {
      mediaSide: "right",
      height: "card-lg",
      media: {
        type: "image",
        fit: "cover",
        src: "images/dmarc4.png",
        alt: "A map of the Des Moines metro shaded by pantry visitor density per zip code"
      },
      heading: "DMARC Network Analysis",
      body: "Leveraging R and geospatial analysis (leaflet) to uncover service gaps in the DMARC Food Pantry Network. By merging transaction logs with ACS Census data, I mapped visitor density to identify high-need areas and utilized predictive modeling to forecast a 2025 surge in demand within specific demographic groups.",
      actions: [
        { project: "dmarc", label: "View Case Study", style: "primary", icon: "fa-arrow-right" }
      ]
    },
    lede: [
      { label: "The Challenge", text: "The DMARC Food Pantry Network generates a massive dataset of transactional visitor logs. However, the data was unstructured and lacked the demographic context needed to make informed decisions about resource allocation and new pantry locations." },
      { label: "The Solution",  text: "I built a reproducible data pipeline in R that cleaned raw logs, enriched them with ACS Census data, and utilized predictive modeling. This analysis provided DMARC with actionable insights into seasonal trends, shifting demographics, and geographic service gaps." }
    ],
    sections: [
      {
        heading: "Data Standardization Pipeline",
        body: "The first step involved ingesting raw transaction logs from over 90 pantry locations. I wrote a cleaning script to standardize variables, calculate visitor ages from birthdates, and bucket income levels according to Federal Poverty Guidelines. This created a universal dataset ready for downstream analysis. I calculated age against the service date rather than trusting a stored age field, since the same visitor shows up across several years of logs.",
        code: {
          file: "clean_dmarc_data.R",
          src: `# 3c: Fixing age from DOB
data <- data %>%
  mutate(
    dob = ymd(dob),
    served_date = ymd(served_date),
    age = round(as.numeric(difftime(served_date, dob, units = "days")) / 365.25)
  ) %>%
  filter(age > -0.1, age <= 102)

# 4a: Binning Income into Federal Poverty Brackets
data <- data %>%
  mutate(
    fed_bracket = case_when(
      poverty_level == 0   ~ "0",
      poverty_level <= 25  ~ "0 - 25",
      poverty_level <= 50  ~ "25 - 50",
      poverty_level <= 100 ~ "50 - 100",
      TRUE                 ~ "Over 100"
    )
  )`
        }
      },
      {
        heading: "Geographic Visit Density",
        body: "I used Leaflet to map the density of repeat visitors across Central Iowa. The analysis revealed that while Des Moines proper has high engagement, reaching up to 8.2% of the population in certain zip codes, there is significant variation in the suburbs. Areas like Urbandale and Windsor Heights showed distinct utilization patterns. Zip codes with no data are labelled that way rather than drawn as zero, which would have made coverage look artificially poor.",
        code: {
          file: "zip_map_final.R",
          src: `# Create the Leaflet map
leaflet_map <- leaflet(iowa_map_data) %>%
  addPolygons(
    fillColor   = ~pal(individual_density * 100),
    color       = "grey80",
    weight      = 0.4,
    fillOpacity = 0.3,
    label = ~paste0(
      ifelse(individual_density > 0,
             sprintf("%.1f%%", individual_density * 100),
             "No Data")
    )
  ) %>%
  addProviderTiles(providers$CartoDB.Positron)`
        },
        image: { src: "images/dmarc1.png", alt: "Visitor density map by zip code" }
      },
      {
        heading: "Time-Series Forecasting",
        body: "To help DMARC prepare for future demand, I developed a Poisson regression model combined with Generalized Additive Models to forecast monthly visits. The model accounts for seasonal trends and predicts a continued rise in pantry usage. It estimates a new peak of approximately 40,000 monthly visits by late 2025. I built the prediction intervals on the link scale and transformed them back afterwards, which keeps them from dipping below zero visits.",
        code: {
          file: "predictive_modelling.R",
          src: `# Fit GLM with seasonal factors
glm_fit <- glm(
  total_visits ~ time_index + factor(month) + avg_age + avg_household,
  data   = monthly_data,
  family = poisson()
)

pred <- predict(glm_fit, newdata = future_df, type = "link", se.fit = TRUE)

future_df <- future_df %>%
  mutate(
    predicted_visits = exp(pred$fit),
    lower            = exp(pred$fit - 1.96 * pred$se.fit),
    upper            = exp(pred$fit + 1.96 * pred$se.fit)
  )`
        },
        image: { src: "images/dmarc2.png", alt: "Predictive model graph" }
      },
      {
        heading: "Analyzing Demographic Shifts",
        body: "By comparing visitor data from 2018 to 2024, I identified the fastest-growing demographic groups accessing DMARC services. The data shows that Hispanic families have nearly doubled their visit share, rising from roughly 4% to 8% of the total visitor base. Both years had to be recoded onto matching ACS categories first. Otherwise, the comparison would have partly been measuring changes in how the data was recorded.",
        code: {
          file: "acs_compatible_demographics.R",
          src: `# Recode demographics for comparison
current_recode <- current %>%
  mutate(
    acs_demo_ext = paste(acs_age_group, acs_race, acs_snap,
                         acs_poverty, acs_household_structure, sep = " | ")
  )

top_growth <- type_changes %>%
  slice_max(order_by = change, n = 5)

ggplot(top_growth, aes(x = reorder(acs_demo_ext, change), y = change)) +
  geom_col() +
  coord_flip()`
        },
        image: { src: "images/dmarc3.png", alt: "Demographic growth chart" }
      },
      {
        heading: "Strategic Gap Analysis",
        body: "Finally, I performed a gap analysis by overlaying ACS Census data onto the pantry network map. I calculated the density of the target demographic per zip code. This revealed underserved hotspots, particularly in the River Bend area, where the target population density is high but pantry coverage is low. The density is a chain of separate proportions, which assumes those characteristics are independent within a zip code. That isn't exactly true, but the joint distribution isn't published at that level and it was enough to rank zip codes against each other.",
        code: {
          file: "acs_zipmap.R",
          src: `# Calculate Target Group Density
acs <- acs %>%
  mutate(
    target_group_count = round(
      total_pop * combined_adult_prop * hispanic_prop *
      (1 - snap_rate) * poverty_rate
    ),
    target_group_density = target_group_count / total_pop
  )

iowa_map_data <- iowa_zips %>%
  left_join(acs, by = c("zip" = "ZIP")) %>%
  filter(!is.na(target_group_density))`
        },
        image: { src: "images/dmarc4.png", alt: "Target demographic map" }
      }
    ],
    links: []
  },

  "site-build": {
    group: "data",
    layout: "technical",
    category: "Web Development",
    title: "Personal Site Build",
    card: {
      chip: "Static Site",
      blurb: "The story behind how I created this website. I used HTML and Tailwind CSS for the layout, plus a CI/CD pipeline via GitHub and Cloudflare for easy updates from my laptop.",
      image: null
    },
    meta: [
      { label: "Project Type", value: "Static Website" },
      { label: "Role",         value: "Development" },
      { label: "Stack",        value: "HTML, Tailwind, Git" },
      { label: "Deployment",   value: "Cloudflare Pages" }
    ],
    feature: {
      mediaSide: "left",
      height: "card-lg",
      media: {
        type: "code",
        file: "projects.js — project data",
        src: `const projectData = {
  "mainframe": {
    group:  "design",
    layout: "case",
    title:  "Mainframe Studios"
  },
  "dmarc": {
    group:  "data",
    layout: "technical"
  }
};`
      },
      heading: "Personal Site Build",
      body: "The story behind how I created this website. I used both HTML5 and Tailwind CSS to build this site's aesthetic and established a CI/CD pipeline via GitHub and Cloudflare for updates on my laptop. Every case study on the site, including this one, comes out of the data file shown on the left.",
      actions: [
        { project: "site-build", label: "View Process", style: "primary", icon: "fa-arrow-right" }
      ]
    },
    lede: [
      { label: "The Goal",     text: "For the last few years I have made several attempts to create a website for myself that I could easily access and update. I had already tried both Wordpress and Canva, but I was not satisfied with the limited customization available and was left paying monthly subscription fees." },
      { label: "The Solution", text: "So, I decided to build a static site from scratch using standard HTML and Tailwind CSS. It was a good opportunity to get more comfortable with code and set up a proper development workflow. This enabled me to have full control over the domain and hosting without the overhead of a website builder." }
    ],
    sections: [
      {
        heading: "Escaping the Builder Trap",
        body: "The main driver for this project was cost and flexibility. Website builders are convenient, but they lock you into their ecosystem. By switching to HTML, I could create the exact minimalist layout I wanted. I used Tailwind CSS to handle the styling because it keeps the file small, manageable, and easy to update. The color palette lives in one CSS file as variables, and the Tailwind config points at those variables instead of repeating the hex codes. Changing a color is a single edit in a single place.",
        code: {
          file: "tailwind.config.cjs",
          src: `module.exports = {
  darkMode: 'class',
  content: ['../*.html', '../*.js'],
  theme: {
    extend: {
      colors: {
        page:    'var(--color-page)',
        surface: 'var(--color-surface)',
        ink:     'var(--color-text-primary)',
        muted:   'var(--color-text-muted)',
        accent:  'var(--color-accent-text)'
      }
    }
  }
}`
        }
      },
      {
        heading: "Getting Off the CDN",
        body: "For a while I loaded Tailwind straight from their CDN script. That is the fastest way to get started, but it compiles the stylesheet in the visitor's browser on every page load, and their own docs say not to ship it that way. So I moved the build onto my laptop. The browser now downloads about 22KB of finished CSS and nothing else. The one catch is that adding a new Tailwind class means I have to remember to rebuild before I push.",
        code: {
          file: "Terminal",
          src: `cd tailwind-build
npm run build:css      # writes ../assets/tailwind.css

# then the usual three
git add .
git commit -m "Rebuild stylesheet"
git push origin main`
        }
      },
      {
        heading: "The Deployment Workflow",
        body: "I wanted the site to be as easy to update as possible. To do this, I set up a continuous deployment pipeline using GitHub and Cloudflare Pages. Now, when I want to add a new project or fix a typo, I just edit the code on my laptop and push the changes with my command Terminal to the repository. Cloudflare detects the commit and rebuilds the site automatically in seconds.",
        code: {
          file: "Terminal",
          src: `# The entire update process takes three commands
git add .
git commit -m "Added new case study"
git push origin main

# Cloudflare automatically builds and deploys to https://olivertwilliams.com`
        }
      },
      {
        heading: "My Project Update System",
        body: "Early on, I used a custom HTML page for each individual project. I quickly realized this was wasteful with repetitive code and extremely time consuming. Every time I wanted to change the layout, I would have to edit twenty different files. After some research, I managed to build a single reusable template and a central JavaScript file to pull information from. Every case study on the site now comes out of this one file.",
        code: {
          file: "projects.js",
          src: `const projectData = {
  "mainframe": {
    group:  "design",
    layout: "case",
    title:  "Mainframe Studios First Friday",
    card:   { chip: "Advertising", blurb: "..." },
    background: "...", challenge: "...",
    solution:   "...", result:    "...",
    gallery: [ /* images with captions */ ]
  },

  "dmarc": {
    group:  "data",
    layout: "technical",
    title:  "DMARC Network Analysis",
    sections: [ /* headings, text, code panels, figures */ ]
  }
};`
        }
      },
      {
        heading: "How the Template Picks a Project",
        body: "Each project is an object, and a set of functions turn it into HTML. Which function runs depends on a layout field. Design projects get the case study format with the image gallery, while data and product pages get a version with code panels and figures next to them. I kept those functions free of anything browser-specific, which turned out to matter more than I expected. It means the build can run the same code on my laptop and write each finished page out to its own file. So I still only maintain one template, but what gets deployed is a real HTML page per project.",
        code: {
          file: "prerender.js",
          src: `// the same renderers the browser would use,
// run at build time instead

for (const id of Object.keys(projectData)) {
  const data = projectData[id];
  const page = fill(template, {
    head: metaFor(id, data),
    body: projectLayout(data)
  });
  write('projects/' + id + '.html', page);
}`
        }
      }
    ],
    links: [
      { label: "Source on GitHub", href: "https://github.com/olivertw12", icon: "github" }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     PART 03 — DESIGN
     ══════════════════════════════════════════════════════════ */

  "mainframe": {
    group: "design", layout: "case",
    category: "Advertising & Typography",
    title: "Mainframe Studios First Friday",
    card: { title: "Mainframe Studios", chip: "Advertising", blurb: "Unique typeface and poster for a non-profit art studio.", image: "images/mainframe2.png" },
    meta: [
      { label: "Client", value: "Mainframe Studios" },
      { label: "Role", value: "Visual Design" },
      { label: "Year", value: "2023" },
      { label: "Deliverables", value: "Poster, Typeface" }
    ],
    hero: "images/mainframe2.png",
    heroCaption: "The final poster design displayed in the Anderson Gallery.",
    background: "Mainframe Studios is one of the largest non-profit art studios in the nation, providing permanent and affordable workspaces for hundreds of artists in Des Moines. They are known for their vibrant creative community and their visually iconic building.",
    challenge: "The studio needed a unique poster design to advertise their First Friday event, which is a monthly opportunity for locals to tour the facility and view art. We needed to capture the essence of their most recognizable asset, the colorful geometric-painted exterior, without simply resorting to photography.",
    solution: "The design process began with an in-depth analysis of the studio's exterior to deconstruct its geometric patterns and bold color palette. These core shapes and angles were then abstracted and systematized to build the letterforms of a new custom display typeface.",
    result: "The resulting poster provided Mainframe Studios with a powerful and original piece of visual communication that served as a true extension of its physical identity. The design was highly successful and won an award at the 52nd Annual Juried Student Exhibition.",
    gallery: [
      { src: "images/mainframe3.png", caption: "View of Mainframe Studios in Des Moines." },
      { src: "images/mainframe4.png", caption: "Conceptual merchandise with the custom typography." },
      { src: "images/mainframe5.png", caption: "Mockup of the poster in a studio environment." }
    ]
  },

  "forged": {
    group: "design", layout: "case",
    category: "Brand Identity",
    title: "The Forged Group",
    card: { chip: "Branding", blurb: "Visual identity system for a financial consultation firm.", image: "images/forged2.png" },
    meta: [
      { label: "Client", value: "Forged Consulting" },
      { label: "Role", value: "Brand Strategy" },
      { label: "Year", value: "2024" },
      { label: "Deliverables", value: "Identity System, Print" }
    ],
    hero: "images/forged2.png",
    heroCaption: "Business cards showcasing the primary brand identity.",
    background: "The Forged Group is a financial consultation firm based in North Carolina specializing in business consulting and human resources optimization. As a firm dealing with high-level corporate strategy, they required a brand image that conveyed strength, stability, and professional reliability to their diverse clientele.",
    challenge: "We needed to create a brand identity flexible enough to house multiple distinct sub-brands without fracturing the overall image. The system had to feel unified and monolithic while allowing each division its own clear designation on business cards and digital assets.",
    solution: "We developed a visual system anchored by a stylized anvil icon to act as a symbol of craftsmanship and durability. This icon serves as the unifying element across all collateral. A clean typographic hierarchy was established to clearly differentiate the sub-brands.",
    result: "The final deliverable was a comprehensive brand identity suite including logo variations for each sub-brand along with a stationery package and merchandise assets. The result is a cohesive professional visual language that projects authority and trust.",
    gallery: [
      { src: "images/forged3.png", caption: "Branded notebooks featuring the unified Anvil icon." },
      { src: "images/forged4.png", caption: "Merchandise application demonstrating the logo's versatility." },
      { src: "images/forged5.png", caption: "The visual system applied in a business environment." }
    ]
  },

  "relays": {
    group: "design", layout: "case",
    category: "Event Branding",
    title: "Drake Relays 2025",
    card: { chip: "Event", blurb: "Relays event logo and theme for Drake University.", image: "images/relays2.png" },
    meta: [
      { label: "Client", value: "Drake University" },
      { label: "Role", value: "Visual Design" },
      { label: "Year", value: "2025" },
      { label: "Deliverables", value: "Logo, Merch, Signage" }
    ],
    hero: "images/relays2.png",
    heroCaption: "Primary visual logo featured on a keychain.",
    background: "The Drake Relays is a premier athletic event held annually at Drake University. Each year a student is selected through a competitive process to design the official logo and visual theme to ensure the event maintains a fresh and student-centric identity.",
    challenge: "The mandated theme for the 2025 Relays was \"Racing Through Time.\" I needed to interpret this broad concept into a cohesive visual brand that felt energetic and athletic while honoring the history of the event. The design also had to scale flawlessly across everything from massive campus banners to small merchandise items.",
    solution: "I developed a logo and visual system anchored in a retro-futurist aesthetic and used a neon-inspired color palette to evoke the speed and energy of the event. A key component of the design was the integration of the Des Moines city skyline to ground the concept in the specific location of the city.",
    result: "The final design was implemented successfully across the entire event ecosystem. The logo was placed prominently around the Drake University campus to create an immersive atmosphere for attendees.",
    gallery: [
      { src: "images/relays3.png", caption: "Merchandise application on steel cups handed out at events." },
      { src: "images/relays4.png", caption: "Raffle prize given at reveal event." },
      { src: "images/relays5.png", caption: "Banner displayed on Drake campus grounds." }
    ]
  },

  "brushfactory-identity": {
    group: "design", layout: "case",
    category: "Brand Identity",
    title: "Brushfactory Identity",
    card: { title: "Brushfactory Identity", chip: "Branding", blurb: "The complete brand identity, logo, and wordmark for the Brushfactory converter. Designed to adapt across both light and dark interfaces while clearly communicating its purpose to digital artists.", image: "images/bfid-lockup-light.png" },
    meta: [
      { label: "Client", value: "Self-initiated" },
      { label: "Role", value: "Brand Design" },
      { label: "Year", value: "2026" },
      { label: "Deliverables", value: "Logo, wordmark, palette" }
    ],
    hero: "images/bfid-lockup-light.png",
    heroCaption: "The primary Brushfactory logo and wordmark lockup displayed in its light mode variant.",
    background: "Brushfactory needed a distinct visual identity before its public launch. The product is a highly technical tool that converts proprietary brush files between different drawing apps. I needed a brand that looked approachable to artists while still feeling like a reliable piece of software. The identity had to live outside the application interface to drive marketing and user signups.",
    challenge: "The main hurdle was designing a mark that clearly communicated \"digital art tool\" without relying on a literal paintbrush cliché. The logo needed to remain perfectly legible at tiny favicon sizes. It also had to be versatile enough to survive on both the dark application interface and a light marketing page. I restricted the design to solid colors without any gradients to ensure it would scale flawlessly across the web architecture.",
    solution: "I designed a geometric, stylized fountain pen nib as the primary icon. A vibrant orange ink stroke flows horizontally from the tip to ground the mark and add a sense of movement. I paired this icon with a heavy, rounded serif typeface for the wordmark. To create a cohesive feel, the corners of the pen nib are slightly rounded to perfectly match the soft curves of the typography. To accommodate the dual-mode environment, the identity shifts seamlessly. The text renders in a deep charcoal for light backgrounds and a stark white for dark mode, while the vivid orange acts as the constant anchor.",
    result: "The final identity system shipped alongside the Brushfactory product launch in August 2026. The vivid orange branding cuts through both the dark UI of the app chrome and the bright marketing pages. The solid vector mark scales perfectly down to a browser tab icon and looks incredibly sharp on social media preview cards.",
    gallery: [
      { src: "images/bfid-mark-scales.png", caption: "The geometric pen nib mark shown at varying scales." },
      { src: "images/bfid-palette-modes.png", caption: "The core solid color palette adapting to light and dark themes." }
    ]
  },

  "dessa": {
    group: "design", layout: "case",
    category: "Social Media Design",
    title: "Dessa 2026 East Coast Tour",
    card: { title: "Dessa Tour", chip: "Advertising", blurb: "Poster announcing a new tour for a Minnesota singer-songwriter.", image: "images/dessa1.png" },
    meta: [
      { label: "Client", value: "Becky Hoffmann Mgmt" },
      { label: "Role", value: "Graphic Design" },
      { label: "Year", value: "2026" },
      { label: "Deliverables", value: "Social Assets (4:5, 9:16)" }
    ],
    hero: "images/dessa1.png",
    heroCaption: "Teaser preview of tour.",
    background: "Dessa was preparing to announce a March 2026 tour run with stops in Boston, Philadelphia, Brooklyn, and D.C. Management needed a suite of digital assets optimized for Instagram feeds and stories to support the announcement.",
    challenge: "The visual direction needed to pivot mid-project. The initial concept used moody photography and the client felt it was too somber for the tour's energy. The goal shifted to matching the specific pink-hued aesthetic of a recent EP cover.",
    solution: "I manually recreated the specific pink color grade to align with the EP's branding. To complement the new visual tone, I introduced a fresh font pairing that balanced the atmosphere with clear legibility.",
    result: "The final designs were approved by the team and successfully rolled out for the tour announcement in mid-January 2026.",
    gallery: [
      { src: "images/dessa2.png", caption: "Original Concept: Darker, moody photographic direction." },
      { src: "images/dessa3.png", caption: "After Feedback: Revised with pink treatment and updated typography." }
    ]
  },

  "jeremy": {
    group: "design", layout: "case",
    category: "Event Promotion",
    title: "Songwriting Workshop & Performance",
    card: { title: "Jeremy Messersmith Performance", chip: "Advertising", blurb: "Flyers announcing appearances from a Minnesota singer-songwriter.", image: "images/jeremy1.png" },
    meta: [
      { label: "Client", value: "Becky Hoffmann Mgmt" },
      { label: "Role", value: "Art Direction & Design" },
      { label: "Year", value: "2026" },
      { label: "Deliverables", value: "Digital Posters (1:1, 4:5)" }
    ],
    hero: "images/jeremy1.png",
    heroCaption: "Final promotional poster for PILLLAR songwriting workshop.",
    background: "Jeremy Messersmith was hosting two related events in February 2026: a free songwriting workshop and a songwriter circle performance. The project required two distinct digital flyers that felt cohesive as a series but clearly differentiated the nature of each event.",
    challenge: "I needed to develop a design that would feel inviting and organic. It had to reflect the intimate nature of the events and capture the specific whimsy associated with Jeremy's brand.",
    solution: "I conceptualized a scrapbook aesthetic to mirror the hands-on and constructive nature of a songwriting workshop. To distinguish the events, I used unique colorways for the workshop versus the show. I also integrated cats into the collage as a nod to Jeremy's hit song Everybody Gets a Kitten.",
    result: "The final posters were praised for capturing his aesthetic and effectively communicating the distinct vibe of the events. The flyers were used successfully across social media channels and ticketing platforms.",
    gallery: [
      { src: "images/jeremy2.png", caption: "Original draft of planned layout." },
      { src: "images/jeremy3.png", caption: "Alternate colorway and layout for the performance flyer." }
    ]
  },

  "xmas": {
    group: "design", layout: "case",
    category: "Map Design & Illustration",
    title: "Christmas in Excelsior",
    card: { chip: "Illustration", blurb: "Event map design for a local holiday market.", image: "images/xmas2.png" },
    meta: [
      { label: "Client", value: "International Lions Club" },
      { label: "Role", value: "Map Illustration" },
      { label: "Year", value: "2024" },
      { label: "Deliverables", value: "Event Map, Pamphlet" }
    ],
    hero: "images/xmas2.png",
    heroCaption: "Overview of the event map designed for the first-ever Christmas Market in Excelsior.",
    background: "The International Lions Club organized the first-ever Christmas Market in Excelsior as a major community initiative. It aimed at bringing residents and visitors together for the holiday season with an anticipated attendance of 50,000 people.",
    challenge: "With such a significant influx of visitors to a new event layout, clarity and navigation were critical safety concerns. Attendees needed to intuitively find specific vendor zones, food areas, and restrooms.",
    solution: "I volunteered to design a comprehensive area map that prioritized readability and functional navigation. The design clearly highlighted efficient walking routes, distinct vendor zones, and key landmarks optimized for print.",
    result: "The map became a central piece of the visitor experience. It was distributed in printed pamphlets to the estimated audience of 50,000, successfully directing foot traffic and reducing bottlenecks.",
    gallery: []
  },

  "pyrkia": {
    group: "design", layout: "case",
    category: "Brand Identity",
    title: "Pyrkia Health",
    card: { chip: "Branding", blurb: "Brand identity and logo for a nature-focused health program.", image: "images/pyrkia2.png" },
    meta: [
      { label: "Client", value: "Pyrkia Health Services" },
      { label: "Role", value: "Logo Design" },
      { label: "Year", value: "2024" },
      { label: "Deliverables", value: "Logo, Brand Assets" }
    ],
    hero: "images/pyrkia2.png",
    heroCaption: "Primary brand visual emphasizing balance and nature.",
    background: "Pyrkia Health Services is a nature-focused health program dedicated to holistic wellness. Their mission is to integrate physical health with the restorative power of the natural world to foster a sense of unity between the individual and their environment.",
    challenge: "The health and wellness sector is crowded with generic imagery. The client needed a logo that was distinct yet immediately recognizable as a symbol of care and unity. It had to feel organic and human-centered without relying on clichéd health tropes.",
    solution: "I developed the client's vision by focusing on an abstract figure that symbolizes the human element within the natural world. To reinforce the concepts of completeness and self-emphasis, I integrated this figure with a prominent abstract circle representing the cycle of health and unity.",
    result: "The final design is a clean modern logo that successfully bridges the gap between professional healthcare and organic wellness. The abstract circle and figure create a memorable icon that anchors the brand's visual identity.",
    gallery: [
      { src: "images/pyrkia3.png", caption: "Digital application on the Pyrkia webpage." },
      { src: "images/pyrkia4.png", caption: "Icon shown in yoga environment." }
    ]
  },

  "citymap": {
    group: "design", layout: "case",
    category: "Illustration & Product Design",
    title: "City of Shorewood Map",
    card: { title: "Shorewood City Map", chip: "Illustration", blurb: "Illustrated rug map to help children navigate their community.", image: "images/citymap2.png" },
    meta: [
      { label: "Client", value: "Community Prototype" },
      { label: "Role", value: "Illustrator" },
      { label: "Year", value: "2024" },
      { label: "Deliverables", value: "Rug Design, Map" }
    ],
    hero: "images/citymap2.png",
    heroCaption: "A custom illustrated rug designed to help children visualize their community.",
    background: "This project began as a university initiative to design a functional prototype that would benefit a local community. The goal was to create an educational tool that fostered a sense of place and belonging for younger residents.",
    challenge: "Learning city layouts and navigation can be abstract and difficult for children when relying on traditional 2D maps or digital screens. I needed to translate complex geographic data into a format that was intuitive, playful, and physically interactive.",
    solution: "I developed a custom illustrated rug that functions as a large-scale play mat with a stylized yet accurate map of Shorewood. Key landmarks were illustrated with distinct icons and roads were designed wide enough for toy cars.",
    result: "The final prototype effectively depicts Shorewood along with its real city landmarks and surrounding townships. It successfully bridges the gap between a toy and an educational resource.",
    gallery: [
      { src: "images/citymap3.png", caption: "View of the rug at eye-level." },
      { src: "images/citymap4.png", caption: "2nd view of the rug at eye-level." }
    ]
  },

  "cityintern": {
    group: "design", layout: "case",
    category: "Editorial & UI Design",
    title: "Shorewood Internship",
    card: { title: "Shorewood Government", chip: "UI/UX Design", blurb: "Modernized fillable PDF forms for city government.", image: "images/cityintern2.png" },
    meta: [
      { label: "Client", value: "City of Shorewood" },
      { label: "Role", value: "Graphic Design Intern" },
      { label: "Year", value: "2024" },
      { label: "Deliverables", value: "Fillable Forms, PDFs" }
    ],
    hero: "images/cityintern2.png",
    heroCaption: "A selection of standardized, fillable PDF forms created for the city government.",
    background: "The City of Shorewood manages a wide variety of administrative processes that require documentation from permits to internal HR forms. I joined the team as a Graphic Design Intern to assist in modernizing their communication materials.",
    challenge: "Many of the city's existing documents were outdated, visually inconsistent, and difficult to use. My goal was to audit these legacy documents and transform them into a cohesive system that aligned with the Shorewood Branding Kit while drastically improving usability.",
    solution: "I utilized Adobe Acrobat and InDesign to redesign and engineer a suite of fillable PDFs. I strictly applied the Shorewood Branding Kit and focused on user experience by adding interactive form fields, dropdown menus, and a clear instructional hierarchy.",
    result: "The project resulted in a library of modernized and user-friendly documents that streamlined administrative workflows. The shift to fillable PDFs successfully reduced paper waste and data entry errors.",
    gallery: []
  },

  "art": {
    group: "design", layout: "case",
    category: "Fine Art",
    title: "Traditional Artwork",
    card: { chip: "Fine Art", blurb: "Mixed media fine art studies exploring texture and composition.", image: "images/art1.jpg" },
    meta: [
      { label: "Client", value: "Personal" },
      { label: "Role", value: "Artist" },
      { label: "Year", value: "2021-2024" },
      { label: "Deliverables", value: "Mixed Media Studies" }
    ],
    hero: "images/art1.jpg",
    heroCaption: "Cloth Vignette, Drawing cloth from sight using charcoal paints reductively. [18 x 25 in.]. Featured at the Drake University Anderson Gallery 52nd Annual Juried Student Exhibition in March 2023.",
    background: "While my professional work focuses on digital design and analytics, I maintain a dedicated practice in traditional fine art. This collection represents a compilation of studies created between 2021 and 2024.",
    challenge: "The main challenge in traditional media is the lack of an undo button. Working with charcoal and ink requires total commitment to every stroke and a deep understanding of the physical materials.",
    solution: "I primarily work with a variety of charcoals and pastels. My studies focus on recreating form in high-contrast lighting scenarios by relying on value and texture to communicate volume and emotion.",
    result: "This ongoing practice keeps my fundamental artistic skills sharp. The discipline required for traditional drawing directly translates to my digital work by constantly improving my eye for composition and balance.",
    gallery: [
      { src: "images/art2.jpg", caption: "Marble, Drawn from sight using oil pastels. [18 x 25 in.]" },
      { src: "images/art4.jpg", caption: "Untitled, 30 minute photo study w/ charcoal. [8.5 x 11 in.]" },
      { src: "images/art6.jpg", caption: "Untitled, 30 minute photo study w/ oil pastel. [11 x 8.5 in.]" },
      { src: "images/art3.jpg", caption: "C.M.Y.K., Psychological space w/ mixed media. [12 x 18 in.]" },
      { src: "images/art5.jpg", caption: "Dissonance, Oil pastel. [18 x 25 in.]" },
      { src: "images/art7.png", caption: "25 Fruits, Color & abstraction w/ mixed media. [4 x 4 in.]" }
    ]
  },

  "data": {
    group: "design", layout: "case",
    category: "Event Branding & Print Design",
    title: "Save the Data: Ransomware Event",
    card: { title: "Save the Data Event", chip: "Advertising", blurb: "3-hour university exercise simulating a cybersecurity crisis.", image: "images/data1.png" },
    meta: [
      { label: "Client", value: "DATA Club & Tech Association of Iowa" },
      { label: "Role", value: "President & Lead Designer" },
      { label: "Year", value: "2025" },
      { label: "Deliverables", value: "Flyers, Social, Signage" }
    ],
    hero: "images/data1.png",
    heroCaption: "Promotional flyers designed for the 'Save the Data' cybersecurity event.",
    background: "I partnered with the Tech Association of Iowa as President of the DATA Club to organize a tabletop ransomware exercise demonstrating business responses to cybersecurity crises for students and industry professionals.",
    challenge: "The workshop needed a visual identity to attract students and professionals to a three-hour morning session. It required a really clear theme to distinguish it from standard academic lectures.",
    solution: "I created a retro-computing visual style using pixelated icons and distressed typography. I produced two colorways including System Blue for light mode and Critical Pink for dark mode that were displayed side-by-side in science halls.",
    result: "The campaign easily distinguished the event from other campus activities and drew strong attendance from both students and tech professionals.",
    gallery: [
      { src: "images/data2.png", caption: "Light mode variant." },
      { src: "images/data3.png", caption: "Dark mode variant." }
    ]
  },

  "duolingo": {
    group: "design", layout: "case",
    category: "Advertising Campaign",
    title: "Duolingo x Rocket League",
    card: { title: "Duolingo Ad Campaign", chip: "Advertising", blurb: "Ad campaign concept expanding Duolingo into Rocket League.", image: "images/duolingo2.png" },
    meta: [
      { label: "Client", value: "Young Ones Competition" },
      { label: "Role", value: "Illustration" },
      { label: "Year", value: "2024" },
      { label: "Deliverables", value: "Deck, Video, Illustration" }
    ],
    hero: "images/duolingo2.png",
    heroCaption: "Concept art for the Duolingo x Rocket League crossover event.",
    background: "This project was a submission for the One Club for Creativity's 'Young Ones' competition. The national brief challenged students to develop innovative marketing strategies to help global brands such as Duolingo achieve specific growth goals.",
    challenge: "Duolingo sought to penetrate a new demographic. We identified the gaming community as a prime target due to its reliance on cross-cultural communication, so we selected Rocket League as the specific vehicle to leverage its massive international player base.",
    solution: "We pitched an immersive in-game crossover event. I spearheaded the visual development utilizing Adobe Illustrator to merge official assets from the Duolingo brand kit seamlessly with the Rocket League aesthetic.",
    result: "Delivered a comprehensive campaign deck and video pitch that successfully merged two distinct brand identities, resulting in a professional-grade presentation suitable for a major tech client.",
    gallery: [
      { src: "images/duolingo4.png", caption: "Initial illustration sketch." }
    ]
  },

  "icymi": {
    group: "design", layout: "case",
    category: "Brand Identity & Print",
    title: "ICYMI Podcast",
    card: { chip: "Branding", blurb: "Visual identity and poster system for a student news podcast.", image: "images/icymi2.png" },
    meta: [
      { label: "Client", value: "Student Media" },
      { label: "Role", value: "Co-Host & Designer" },
      { label: "Year", value: "2022" },
      { label: "Deliverables", value: "Cover Art, Weekly Posters" }
    ],
    hero: "images/icymi2.png",
    heroCaption: "The official cover art for the ICYMI (In Case You Missed It) podcast.",
    background: "ICYMI was a weekly news podcast dedicated to covering stories around Drake University and the greater Des Moines area. As both a co-host and the lead designer, I aimed to keep the student body informed through an accessible audio format.",
    challenge: "Podcasts are strictly an audio medium, making visual discoverability a significant hurdle on a physical campus. We needed a strong visual identity that could translate from a tiny digital thumbnail on Spotify to physical posters on crowded bulletin boards.",
    solution: "I designed a bold and distinct podcast cover that served as the anchor for our visual brand. I then developed a templated poster system for weekly episode rollouts to quickly generate fresh promotional assets.",
    result: "The visual campaign successfully established ICYMI's presence across Drake University, and the consistent poster distribution helped drive listenership to build a recognizable brand on campus.",
    gallery: [
      { src: "images/icymi3.jpg", caption: "'Generic' poster displayed on campus whiteboard." },
      { src: "images/icymi6.png", caption: "Example of the variable flyer, posted onto Instagram." }
    ]
  }
};


/* ============================================================
   ORDERING
   featured  — what the homepage shows in each section
   archive   — the full design archive, in display order
   ============================================================ */

const featured = {
  product:    ["brushfactory"],
  data:       ["dmarc", "site-build"],
  design:     ["mainframe", "forged", "relays"]
};

const archiveOrder = [
  "brushfactory-identity",
  "mainframe", "forged", "relays", "dessa", "jeremy", "xmas", "pyrkia",
  "citymap", "cityintern", "art", "data", "duolingo", "icymi"
];

