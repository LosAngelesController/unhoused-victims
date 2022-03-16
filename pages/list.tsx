//import TableauEmbed from '../components/tableau'
//import BasicEmbed from '../components/basicembed'
//import Disclaimer from '../components/disclaimer'

//import NavTabs from '../components/tabs'

//import { Tab } from '@headlessui/react'

import Nav from '../components/nav'

import Head from 'next/head'

import React from 'react'
import dynamic from 'next/dynamic'

function Payroll() {
  return <div className='height100'>
    <Head>
      <title>Affordable Housing Covenants - 2010 to May 2021 | List</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" key='twittertitle' content="Affordable Housing Covenants - 2010 to May 2021 | List"></meta>
      <meta name="twitter:description" key='twitterdesc' content="Browse and Search Affordable Housing in Los Angeles"></meta>
      <meta name="twitter:image:alt" content="Where is LA's Affordable Housing? | Kenneth Mejia for LA City Controller"/>
      <meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/affordablehousingpic.png"></meta>
      <meta name="description" content="A Map of Affordable Housing in Los Angeles. Find Housing near you." />
      
      <link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-32x32.png" sizes="32x32"/>
<link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-192x192.png" sizes="192x192"/>
<link rel="apple-touch-icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-180x180.png"/> 
<meta name="msapplication-TileImage" content="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-270x270.png"/>


      <meta property="og:url"                content="https://affordablehousing.mejiaforcontroller.com/" />
<meta property="og:type"               content="website" />
<meta property="og:title"              content="Affordable Housing Covenants - 2010 to May 2021 | List" />
<meta property="og:description"        content="Browse and Search Affordable Housing in Los Angeles" />
<meta property="og:image"              content="https://data.mejiaforcontroller.com/affordablehousingpic.png" />
    </Head>
    <div suppressHydrationWarning={true} className='height100'>
      <React.StrictMode>
        <Nav/>

  </React.StrictMode>
      <div className='p-2'>
      </div>
      </div></div>
}

export default Payroll