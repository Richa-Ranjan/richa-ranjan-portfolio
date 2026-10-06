// Single place for links and placeholders. Empty string = shows a clearly marked placeholder.
export const LINKS = {
  email: 'ranjanricha975@gmail.com',
  phone: '+91 78590 04347', // as printed on your CV; change here if needed
  phoneHref: '+917859004347',
  linkedin: 'https://linkedin.com/in/rranjan-tech',
  github: 'https://github.com/Richa-Ranjan',
  gfg: 'https://geeksforgeeks.org/profile/ranjanricha12',
  resume: '/Richa_Ranjan_Resume.pdf'
}
// [ADD GITHUB PROJECT LINK] / [ADD PROJECT DEMO] — fill these in when ready.
export const PROJECT_LINKS = {
  food: { github: '', demo: '' },
  study: { github: '', demo: '' },
  crop: { github: '', demo: '' },
  sheet: { github: '', demo: '' },
  video: { github: '', demo: '' }
}
// Optional analytics: nothing is loaded unless you add your own snippet here.
export const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID || ''
export const SECTIONS = [
  ['intro', 'Intro'], ['work', 'Work'], ['engineering', 'Skills'],
  ['journey', 'Journey'], ['beyond', 'Outside code'], ['contact', 'Contact']
]
