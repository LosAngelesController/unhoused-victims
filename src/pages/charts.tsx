import Head from 'next/head';
import * as React from 'react'
import Nav from "../components/nav";
import * as d3 from "d3";


import rd3 from 'react-d3-library'

export default function charts() {
    return (
        <div className=" h-full">
             <Head>
        <link
          rel="icon"
          href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-192x192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-180x180.png"
        />
        <meta
          name="msapplication-TileImage"
          content="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-270x270.png"
        />

        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>Unhoused Crime Victims Statistics | Charts</title>
        <meta property="og:type" content="website" />
        <meta name="twitter:site" content="@lacontroller" />
        <meta name="twitter:creator" content="@lacontroller" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          key="twittertitle"
          content="Unhoused Crime Victims Statistics"
        ></meta>
        <meta
          name="twitter:description"
          key="twitterdesc"
          content="Unhoused Crime Victims Statistics. View which areas our unhoused community are victims of crime."
        ></meta>
        <meta
          name="twitter:image"
          key="twitterimg"
          content="https://controller.lacity.gov/unhoused-victims-thumbnail-min.png"
        ></meta>
        <meta
          name="description"
          content="Unhoused Crime Victims Statistics. View which areas our unhoused community are victims of crime."
        />

        <meta
          property="og:url"
          content="https://unhousedvictims.lacontroller.io/"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Unhoused Crime Victims | Map and Statistics"
        />
        <meta
          property="og:description"
          content="Unhoused Crime Victims Statistics. View which areas our unhoused community are victims of crime."
        />
        <meta
          property="og:image"
          content="https://controller.lacity.gov/unhoused-victims-thumbnail-min.png"
        />
      </Head>
             <div className="flex-none">
        <Nav />
      </div>
          <div className='mx-4'>
            <h1 className="text-3xl font-bold mt-5">Charts</h1>
              <div className='flex flex-row gap-x-3' id='filterslist'>

                

              </div>
          </div>
        </div>
    )
}