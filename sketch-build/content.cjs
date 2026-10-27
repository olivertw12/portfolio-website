// Words the page templates need that are not in projects.js or case-copy.cjs.
// stepTitles: a heading for the 2nd, 3rd and 4th paragraph of each case study.
// chapterTitles: headings for the chapters of the three long-form case studies.
// collections: how the work is grouped, in reading order (work index, next-project links).
const stepTitles = {
  mainframe: ['Reference the building, not a photo', 'A typeface drawn from the facade', 'Award at the 52nd Juried Student Exhibition'],
  forged: ['One identity across several divisions', 'An anvil as the shared mark', 'Logos, stationery and merchandise'],
  relays: ['Theme: Racing Through Time', 'Retro-futurist type and neon color', 'Used across campus at the 2025 Relays'],
  'brushfactory-identity': ['Readable at favicon size, light and dark', 'A pen nib with an orange ink stroke', 'Launched with the app in August 2026'],
  dessa: ['First concept: too somber', 'Matching the EP’s pink color grade', 'Approved for the January announcement'],
  jeremy: ['Two events, one related pair of flyers', 'A scrapbook collage, cats included', 'Used on social media and ticketing'],
  xmas: ['Wayfinding for a new event layout', 'Routes, vendor zones and landmarks', 'Printed in the event pamphlet'],
  pyrkia: ['Care and unity without medical clichés', 'A human figure inside a circle', 'One symbol for the whole brand'],
  citymap: ['A map children can play on', 'Roads wide enough for toy cars', 'A finished rug prototype'],
  cityintern: ['Inconsistent, hard-to-use city forms', 'Fillable PDFs on the city brand kit', 'A consistent set of digital forms'],
  art: ['Committing to every mark', 'Charcoal, pastel and high contrast', 'Practice in composition and balance'],
  data: ['Stand out from other campus events', 'Retro-computing posters in two colorways', 'Promoting the workshop on campus'],
  duolingo: ['Reaching Rocket League players', 'Leading the visual work', 'Campaign deck and video pitch'],
  icymi: ['From streaming thumbnail to campus poster', 'Cover art and a weekly poster template', 'Weekly promotion across campus'],
};
const chapterTitles = {
  brushfactory: ['Reverse-engineering undocumented formats', 'Matching how a brush feels', 'Measuring drift between formats', 'Publishing what carries over', 'Next: edge cases and new formats'],
  dmarc: ['Standardizing the visitor logs', 'Mapping repeat-visit density', 'Forecasting monthly visits', 'Demographic shifts, 2018–2024', 'Finding service gaps with Census data'],
  'site-build': ['Leaving website builders behind', 'Compiling Tailwind locally', 'Deploying with GitHub and Cloudflare Pages', 'One data file for every project', 'How the template picks a layout'],
};
const collections = [
  { id: 'product', name: 'Product', theme: 'brushfactory', note: 'Brushfactory, the brush converter I design, build and run.', ids: ['brushfactory', 'brushfactory-identity'] },
  { id: 'data', name: 'Data & code', theme: 'data', note: 'Analysis in R, and the code behind this site.', ids: ['dmarc', 'site-build'] },
  { id: 'identity', name: 'Identity', theme: 'design', note: 'Logos and visual systems for organizations and events.', ids: ['forged', 'relays', 'pyrkia', 'icymi'] },
  { id: 'campaigns', name: 'Posters & campaigns', theme: 'design', note: 'Posters, flyers and pitches that announce something.', ids: ['mainframe', 'dessa', 'jeremy', 'data', 'duolingo'] },
  { id: 'maps', name: 'Maps & public work', theme: 'design', note: 'Maps and documents made for local communities.', ids: ['xmas', 'citymap', 'cityintern'] },
  { id: 'studio', name: 'Studio', theme: 'design', note: 'Drawing from life in charcoal and pastel.', ids: ['art'] },
];
/* the line under the title on the long-form case studies */
const longLede = {
  brushfactory: 'A web app that converts brushes between Photoshop, Procreate, Clip Studio Paint and Krita. I design, build and run it, from the conversion code to the brand.',
  dmarc: 'Food pantry access across the Des Moines metro, cleaned, mapped and forecast in R so the network could see where demand is growing and where coverage is thin.',
  'site-build': 'How this site is built: one data file for every project, templates that turn it into pages, and a deploy straight from GitHub.',
};
/* headline figures, only where the case study states them */
const stats = {
  dmarc: [
    ['90+', 'pantry locations whose visitor logs I cleaned into one dataset'],
    ['8.2%', 'of residents reached in the highest-engagement Des Moines zip codes'],
    ['40,000', 'monthly visits, the forecast peak for late 2025'],
    ['8%', 'of visits came from Hispanic families in 2024, up from about 4% in 2018'],
  ],
};
module.exports = { stepTitles, chapterTitles, collections, longLede, stats };
