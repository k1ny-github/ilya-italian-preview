import './style-entry.js';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {LocaleProvider} from './LocaleProvider.jsx';
import {SiteV9} from './SiteV9.jsx';
createRoot(document.getElementById('root')).render(<React.StrictMode><LocaleProvider><SiteV9/></LocaleProvider></React.StrictMode>);
