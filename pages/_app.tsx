import '../styles/globals.css'
import type { AppProps } from 'next/app';
import styles from '../styles/Home.module.css'
import './../node_modules/mapbox-gl/dist/mapbox-gl.css'
import './App.css';

import './../node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './mapboxdark.css';

import TagManager from 'react-gtm-module'
import { useEffect } from 'react';

import { datadogRum } from '@datadog/browser-rum';
    
const tagManagerArgs = {
  gtmId: 'GTM-MQG62S5'
}
try {
  datadogRum.init({
    applicationId: '0f167d08-abab-4f76-bdc7-71efacca54d8',
    clientToken: 'pub15407666c25ebb17ff50cdde4892057f',
    site: 'datadoghq.com',
    service:'parks',
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'allow'
  });
    
  datadogRum.startSessionReplayRecording();
} catch (datadogerr) {
  console.error(datadogerr)
}



function MyApp({ Component, pageProps }: AppProps) {
  useEffect(()=> {
    TagManager.initialize(tagManagerArgs)
  })
  return <Component {...pageProps} />
}

export default MyApp
