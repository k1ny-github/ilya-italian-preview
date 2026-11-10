import './style-entry.js';
import React from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {LocaleProvider} from './LocaleProvider.jsx';
import {SiteV9} from './SiteV9.jsx';
const root = document.getElementById('root');
const prerendered = root.hasChildNodes();
// Keep the delivered first screen and its downloaded images in place.
// Start with its locale, then let the provider apply the browser preference.
const page = <React.StrictMode><LocaleProvider initialLocale={prerendered ? document.documentElement.lang : undefined}><SiteV9/></LocaleProvider></React.StrictMode>;
if (prerendered) hydrateRoot(root, page);
else createRoot(root).render(page);
