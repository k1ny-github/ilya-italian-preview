import React from 'react';
import {renderToString} from 'react-dom/server';
import {LocaleProvider,dictionaries} from './LocaleProvider.jsx';
import {SiteV9} from './SiteV9.jsx';
export function render(locale){return {html:renderToString(<LocaleProvider initialLocale={locale}><SiteV9/></LocaleProvider>),metadata:dictionaries[locale].metadata};}
