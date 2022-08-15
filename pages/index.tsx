import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment,createRef} from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import parks from './outputparks.json'

import { uploadMapboxTrack } from '../components/mapboxtrack';

import {CloseButton} from '../components/CloseButton'
import Nav from '../components/nav'

import React, {useEffect, useState, useRef} from 'react';

import CouncilDist from './CouncilDistricts.json'
 
const councildistricts = require('./CouncilDistricts.json')
const citybounds = require('./citybounds.json')
// @ts-ignore: Unreachable code error
import * as turf from '@turf/turf'

    // added the following 6 lines.
    import mapboxgl from 'mapbox-gl';

       import { assertDeclareExportAllDeclaration } from '@babel/types';

import {DisclaimerPopup} from '../components/Disclaimer'

function isTouchScreen() {
  return window.matchMedia('(hover: none)').matches;
}

var councilAreas = {
 "1":	3404687.144,
"2":	1922218.2,
"3":	974038.8685,
"4":	19502642.53,
"5":	1491687.759,
"6":	6526483.609,
"7":	8854372.079,
"8":	330407.8904,
"9":	429111.0699,
"10":	383493.7587,
"11":	5663984.515,
"12":	8126663.964,
"13":	1439393.563,
"14":	1781216.65,
"15":	3173394.591
}

const Home: NextPage = () => { 

var parksGeojson:any = parks;

var councilBounds: any = {
  features: CouncilDist.features,
  type: "FeatureCollection"
}

const calculateifboxisvisible = () => {
  if (typeof window != "undefined") {
    return window.innerWidth > 640;
  } else {
    return true;
  }
}

const [showtotalarea, setshowtotalarea] = useState(false)
  let [disclaimerOpen, setDisclaimerOpen] = useState(false)
  let [instructionsOpen, setInstructionsOpen] = useState(false)
  const touchref = useRef<any>(null);
  let [boxPrimed, setBoxPrimed] = useState(false)
  let [houseClickedData, setHouseClickedData]:any = useState(null)
  let [parkClickedData, setParkClickedData]:any = useState(null);
  let [housingaddyopen,sethousingaddyopen] = useState(false);
  var mapref:any = useRef(null);
  const okaydeletepoints:any = useRef(null);
  var [metric,setmetric] = useState(false);

  function closeModal() {
    setDisclaimerOpen(false)
  }



  function sendAnalyticsData(props:any) {
    
  }

  function openModal() {
    setDisclaimerOpen(true)
  }

 
 
  var [hasStartedControls, setHasStartedControls] = useState(false)


  function checkHideOrShowTopRightGeocoder() {
    var toprightbox = document.querySelector(".mapboxgl-ctrl-top-right")
   if (toprightbox) {
    var toprightgeocoderbox:any = toprightbox.querySelector(".mapboxgl-ctrl-geocoder");
    if (toprightgeocoderbox) {
      if (window.innerWidth >= 768) {
        console.log('changing to block')
        toprightgeocoderbox.style.display = 'block'
      } else {
        toprightgeocoderbox.style.display = 'none'
        console.log('hiding')
      }
    }
   }
  }

  const handleResize = () => {
    checkHideOrShowTopRightGeocoder()

  
  }

  const divRef:any = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
        console.log('map div', divRef)

        if (divRef.current) {
          console.log('app render')
        }

       // mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
//import locations from './features.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoiY29tcmFkZWt5bGVyIiwiYSI6ImNrdjBkOXNyeDdscnoycHE2cDk4aWJraTIifQ.77Gid9mgpEdLpFszO5n4oQ';
 
const formulaForZoom = () => {
  if (window.innerWidth > 700) {
    return 10
  } else { 
    return 9.1
  }
}

const urlParams = new URLSearchParams(window.location.search);
const latParam = urlParams.get('lat');
const lngParam = urlParams.get('lng');
const zoomParam = urlParams.get('zoom');
const debugParam = urlParams.get('debug');

var mapparams:any = {
  container: divRef.current, // container ID
  //affordablehousing2022-dev-copy
 style: 'mapbox://styles/comradekyler/cl6e22kp6000015lgg641oz9q', // style URL
  //mapbox://styles/comradekyler/cl5c3eukn00al15qxpq4iugtn
    //affordablehousing2022-dev-copy-copy
  //  style: 'mapbox://styles/comradekyler/cl5c3eukn00al15qxpq4iugtn?optimize=true', // style URL
  center: [-118.41,34], // starting position [lng, lat]
  zoom: formulaForZoom() // starting zoom
}



const map = new mapboxgl.Map(mapparams);
mapref.current = map;

var rtldone=false;



try {
if (rtldone  === false && hasStartedControls === false) {
  setHasStartedControls(true)
  //multilingual support
//right to left allows arabic rendering
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.10.1/mapbox-gl-rtl-text.js', (callbackinfo:any) => {
  console.log(callbackinfo);
  rtldone = true;
});
}

const language = new MapboxLanguage();
map.addControl(language);

}



catch (error) {
  console.error(error)
}



window.addEventListener('resize',  handleResize);  


map.on('load', () => {

  setshowtotalarea(window.innerWidth > 640 ? true : false)

  map.addSource('parks', {
    type: 'geojson',
    data: parksGeojson
    });

    console.log('maps parks source', map.getSource('parks'))

    map.addLayer({
    id: 'parks',
    type: 'fill',
    source: 'parks',
    paint: { 
      'fill-color': '#41ffca',
      'fill-opacity': 0.2
    }

    });

    map.addLayer({
      id: 'parksoutline',
      type: 'line',
      source: 'parks',
      paint: { 
        'line-color': '#41ffca',
        'line-opacity': 1,
        'line-width': 2
      }
  
      });

    console.log('maps parks layer', map.getLayer('parks'))

  okaydeletepoints.current = () => {
    try {
      var affordablepoint: any = map.getSource('selected-home-point')
      affordablepoint.setData(null)
    } catch(err) {
      console.error(err)
    }
  }

  const processgeocodereventresult = (eventmapbox:any) => {
    var singlePointSet:any = map.getSource('single-point');
  
  
    singlePointSet.setData({
      "type": "FeatureCollection",
      "features": [{
      "type": "Feature",
      "geometry": eventmapbox.result.geometry
      }]
      });
    
    console.log('event.result.geometry',eventmapbox.result.geometry)
    console.log('geocoderesult', eventmapbox)
  }
  
  const processgeocodereventselect = (object:any) => {
  
      
    var coord = object.feature.geometry.coordinates;
    var singlePointSet:any = map.getSource('single-point');
   
    singlePointSet.setData({
      "type": "FeatureCollection",
      "features": [{
      "type": "Feature",
      "geometry": object.feature.geometry
      }]
      });
   
  }
  
  const geocoder:any = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: map,
    proximity: {
      longitude: -118.41,
      latitude: 34
    },
    marker: true
    });
  
    var colormarker = new mapboxgl.Marker({
      color: '#41ffca'
    });
  
    const geocoderopt:any = 
      {
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: {
          color: '#41ffca'
        }
        }
    
  
    const geocoder2 = new MapboxGeocoder(geocoderopt);
    const geocoder3 = new MapboxGeocoder(geocoderopt);
  
  
   
       
  geocoder.on('result', (event:any) => {
    processgeocodereventresult(event)
  });
  
  geocoder.on('select', function(object:any){
    processgeocodereventselect(object)
  });
  
  var geocoderId = document.getElementById('geocoder')
  
  
  
  if (geocoderId) {
    console.log(
    'geocoder div found'
    )
  
    if (!document.querySelector(".geocoder input")) {
      geocoderId.appendChild(geocoder3.onAdd(map));
  
      var inputMobile = document.querySelector(".geocoder input");
  
      try {
        var loadboi =  document.querySelector('.mapboxgl-ctrl-geocoder--icon-loading')
        if (loadboi) {
          var brightspin:any = loadboi.firstChild;
       if (brightspin) {
        brightspin.setAttribute('style', 'fill: #e2e8f0');
       }
       var darkspin:any = loadboi.lastChild;
       if (darkspin) {
        darkspin.setAttribute('style', 'fill: #94a3b8');
       }
        }
       
      } catch (err) {
        console.error(err)
      }
    
      if (inputMobile) {
        inputMobile.addEventListener("focus", () => {
          //make the box below go away
         
          });
      }
    }
  
  
  
   
  geocoder2.on('result', (event:any) => {
    processgeocodereventresult(event)
  });
  
  geocoder2.on('select', function(object:any){
    processgeocodereventselect(object)
  });
  
  geocoder3.on('result', (event:any) => {
    processgeocodereventresult(event)
  });
  
  geocoder3.on('select', function(object:any){
    processgeocodereventselect(object)
  });
  }
  

  map.addSource('single-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
  
  map.addLayer({
    id: 'point',
    source: 'single-point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#41ffca'
    }
  });
  

  if (debugParam) {
    map.showTileBoundaries = true;
    map.showCollisionBoxes = true;
    map.showPadding = true;
  }

  if (urlParams.get('terraindebug')) {

    map.showTerrainWireframe = true;
  }

      // Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
  });

  map.addSource('selected-park-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addSource("selected-park-area", {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  map.addLayer({
    id: 'selected-park-areas',
    source: 'selected-park-area',
    type: 'line',
    paint: {
      'line-color': '#7dd3fc',
      'line-width': 5,
      'line-blur': 0
    }
  });

  map.addLayer({
    id: 'selected-park-areasfill',
    source: 'selected-park-area',
    type: 'fill',
    paint: {
      'fill-color': '#7dd3fc',
      'fill-opacity': 0.2
    }
  });

  map.loadImage(
    '/map-marker.png',
    (error, image:any) => {
    if (error) throw error;
     
    // Add the image to the map style.
    map.addImage('map-marker', image);

  map.addLayer({
    'id': 'points-park',
    'type': 'symbol',
    'source': 'selected-park-point',
    'paint': {
   'icon-color': "#f0abfc",
   "icon-translate": [0, -13]
    },
    'layout': {
   'icon-image': 'map-marker',
    // get the title name from the source's "title" property
    'text-allow-overlap': true,
    "icon-allow-overlap": true,
    'icon-ignore-placement': true,
    'text-ignore-placement': true,
    
   'icon-size': 0.4,
   "icon-text-fit": 'both',
    },
    });
  });

  map.on('mousedown', 'parks', (e:any) => {

var dataToWrite = null;

    console.log(e.lngLat);

    var pointturf = turf.point([e.lngLat.lng, e.lngLat.lat]);

    console.log(e.features);

    var arrayOfFeatures = parksGeojson.features.filter((eachPark:any) => {
      var parkMultiPolygon = turf.multiPolygon(eachPark.geometry.coordinates);

       // @ts-ignore: Unreachable code error
      return turf.booleanPointInPolygon(pointturf, parkMultiPolygon);
    });

    console.log('click inside these parks', arrayOfFeatures)

    if (arrayOfFeatures > 1) {

      
      var smallestParkClicked = arrayOfFeatures.reduce((prev:any, curr:any) => {

        // if previous item is bigger park, then the current item is the smallest park
        if (prev.properties.area > curr.properties.area) {
          //return current item which is smaller park
          return curr;
        } else {
          return prev;
        }
        
      })

      setParkClickedData(smallestParkClicked);
      dataToWrite = smallestParkClicked;
    } else {
    setParkClickedData(arrayOfFeatures[0]);
    dataToWrite = arrayOfFeatures[0];
    }
    sethousingaddyopen(true);

    if (window.innerWidth < 768) {
//on mobile, close the other popup of cd park areas
setshowtotalarea(false);

    }

   var affordablepoint: any = map.getSource('selected-park-area')

   if (dataToWrite) {
    
   affordablepoint.setData(dataToWrite.geometry);
   }
    
  //  map.setLayoutProperty("areasparks", 'visibility', 'visible');
  })

  map.on('touchstart', 'housinglayer', (e:any) => {
    popup.remove();
    touchref.current = {
      lngLat: e.lngLat,
      time: Date.now()
    }
  });
   
  map.on('mousemove', 'housinglayer', (e:any) => {

    var isntblockedfrompopup = true;

    if (touchref) {
      if (touchref.current) {
        if (touchref.current.time === Date.now() &&
         touchref.current.lngLat.lng === e.lngLat.lng
          && touchref.current.lngLat.lat === e.lngLat.lat) {
          console.log('time is same, block');
          isntblockedfrompopup = false;
        }
      }
    }

    if (window.innerWidth < 700 || window.innerHeight < 700) {
        isntblockedfrompopup = false;
    }

    if (isntblockedfrompopup) {
      if (window.matchMedia("(any-hover: none)").matches) {
        console.log(
          'no hover'
        )
      } else {
        // device supports hovering
          // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
     
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = `<b>Address</b> ${e.features[0].properties["Address"]}<br><b>Zip Code</b> ${e.features[0].properties["Zip Code"]}<br>
    <b>Council District</b> ${e.features[0].properties["councildist"]}<br>
    <b>${e.features[0].properties["Affordable Units"]}</b> Affordable Units<br>
    <b>${e.features[0].properties["Total Units"]}</b> Total Units<br>
    <b>Covenant Year</strong> ${e.features[0].properties["Year of Covenant"]}
    ${e.features[0].properties["Certificate of Occupancy"] ? `<br><b> Certificate of Occupancy</b> ${e.features[0].properties["Certificate of Occupancy"]}` : `<br><b> Certificate of Occupancy</b> Not in Data`}
    <br><strong>Type</strong> ${e.features[0].properties["Type"] ? `${e.features[0].properties["Type"]}` : "None"}
    <br><strong>Type2</strong> ${e.features[0].properties["Type2"] ? `${e.features[0].properties["Type2"]}` : "None"}<br><b>Click for more info.</b>`;
     
  //console.log(e.features)
  
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
      }
    }
  

  });
   
  map.on('mouseleave', 'housinglayer', () => {
  map.getCanvas().style.cursor = '';
  popup.remove();
  });

if (! document.querySelector(".mapboxgl-ctrl-top-right > .mapboxgl-ctrl-geocoder")) {
  map.addControl(
    geocoder2
    ); 
}


 checkHideOrShowTopRightGeocoder()

 if (true) {
  map.addLayer({
    id: 'citybound',
    type: 'line',
    source: {
      type: 'geojson',
      data:  citybounds
    },
    paint: {
      "line-color": '#dddddd',
      'line-opacity': 1,
      'line-width': 3
    }
  })

  map.addLayer({
    id: 'cityboundfill',
    type: 'fill',
    source: {
      type: 'geojson',
      data:  citybounds
    },
    paint: {
      'fill-color': '#dddddd',
      'fill-opacity': 0.02
    }
  })
}

if ( hasStartedControls === false ) {
  // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
     
// Add geolocate control to the map.
map.addControl(
  new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  // When active the map will receive updates to the device's location as it changes.
  trackUserLocation: true,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
  showUserHeading: true
  }) 
);
}


  checkHideOrShowTopRightGeocoder()
});

var getmapboxlogo:any = document.querySelector('.mapboxgl-ctrl-logo')

if (getmapboxlogo) {
  getmapboxlogo.remove()
}



var mapname = 'parks'



map.on('dragstart', (e) => {
  uploadMapboxTrack({
    mapname,
    eventtype: 'dragstart',
    globallng: map.getCenter().lng,
    globallat: map.getCenter().lat,
    globalzoom: map.getZoom()
  })
  })
  
  map.on('dragend', (e) => {
    uploadMapboxTrack({
      mapname,
      eventtype: 'dragend',
      globallng: map.getCenter().lng,
      globallat: map.getCenter().lat,
      globalzoom: map.getZoom()
    })
    })
  
    map.on('zoomstart', (e) => {
      uploadMapboxTrack({
        mapname,
        eventtype: 'dragstart',
        globallng: map.getCenter().lng,
        globallat: map.getCenter().lat,
        globalzoom: map.getZoom()
      })
      })
  
      map.on('zoomend', (e) => {
        uploadMapboxTrack({
          mapname,
          eventtype: 'zoomend',
          globallng: map.getCenter().lng,
          globallat: map.getCenter().lat,
          globalzoom: map.getZoom()
        })
        })
         

  }, [])

  return (
  
  <div className='flex flex-col h-screen w-screen absolute'>
      <Head>
     
      <link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-32x32.png" sizes="32x32"/>
<link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-192x192.png" sizes="192x192"/>
<link rel="apple-touch-icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-180x180.png"/> 
<meta name="msapplication-TileImage" content="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-270x270.png"/>


     <meta charSet="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
<title>LA Parks | Map</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="City of LA Parks | Map and land analysis"></meta>
<meta name="twitter:description"  key='twitterdesc' content="City of LA Parks visualized. See all parks and observe inequities in park distribution."></meta>
      <meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/affordablehousingpic.png"></meta>
      <meta name="description" content="City of LA Parks visualized. See all parks and observe inequities in park distribution." />

      <meta property="og:url"                content="https://parks.mejiaforcontroller.com/" />
<meta property="og:type"               content="website" />
<meta property="og:title"              content="Affordable Housing Covenants - 2010 to 2021 | Map" />
<meta property="og:description"        content="Browse and Search Affordable Housing in Los Angeles with instructions to apply." />
<meta property="og:image"              content="https://data.mejiaforcontroller.com/affordablehousingpic.png" />

<script defer={true} src="https://helianthus.mejiaforcontroller.com/index.js"></script>
      </Head>
   

  <div className='flex-none'>
    <Nav/>
  </div>

  <div
      className='flex-initial h-content flex-col flex z-50'
    >

<div
      className='absolute mt-[3.1em] md:mt-[3.8em] md:ml-3 top-0 max-h-screen flex-col flex z-5'
    >
  <div className='titleBox  ml-2 text-base bold md:semi-bold break-words bg-[#212121]'
  style={
   {
    backgroundColor: '#41ffca55',
    color: "#ffffff",
   }
  }
  ><strong className='hidden sm:block'>City of Los Angeles Parks</strong>
  <strong className='sm:hidden '>City of LA Parks</strong>
  </div>


  <div
    className={`geocoder mt-0 ml-2 left-1 md:hidden xs:text-sm sm:text-base md:text-lg`} id='geocoder'></div>


  <div className={`text-white bg-gray-800 md:left-1
fixed bottom-0 w-full

sm:w-auto  sm:top-auto sm:static sm:bottom-auto
   border-t-2 sm:border-2 border-teal-500 sm:rounded-xl

   
    sm:mt-2 bg-opacity-90 sm:bg-opacity-70 px-3 py-1 ${showtotalarea === true ? "  " : " hidden "}`}>


<div className={`text-sm md:text-base flex flex-row relative
${showtotalarea === true ?  "  " : "  hidden"}
`}> <p className='text-white bold'>
{metric ? 'km' : 'Sq miles'}
{metric === true && (
  <sup>2</sup>
)} of parks in each district
  
 
  </p>
<div className='pl-7'>
  <CloseButton 
  overrideButtonClass='mt-0.5 mr-0'
   onClose={() => {

    if (window.innerWidth < 768) {
    if (parkClickedData === true) {
      sethousingaddyopen(true);
    }}
    console.log('close area')
    setshowtotalarea(false)}
    
    

    }/></div></div>
  
 
<div className={`leading-tight md:leading-normal`}>
  {
    Object.entries(councilAreas).map((eachEntry:any) => (

  <div
  className='flex flex-row'
  key={eachEntry[0]}
  >
  <div className='w-5 inline'>{eachEntry[0]}</div>

<div


style={
  {
width: `${eachEntry[1]/200000}%`,
height: 5,
backgroundColor: '#41ffca',
  }
}
className='mt-auto mb-auto ml-2'
></div>





<p className='ml-2'>
  
  {metric === false && (
    ((eachEntry[1]/1000000)*0.386102).toPrecision(3)
  )}
  {
metric === true && (

(eachEntry[1]/1000000).toPrecision(3)
)
}</p>

  </div>

    ))
  }
  </div>

<button className='underline border rounded-xl px-3 py-0.75 text-sm' style={
 { color: '#41ffca',
backgroundColor: '#41ffca15',
borderColor: '#41ffca'
}
}
onClick={(e) => {
  setmetric(!metric)
}}
>View in {metric ? 'sq mi' : 'km'}
{metric === false && (
  <sup>2</sup>
)}
</button>

  </div>

  <div className='w-content'>
    
    {/*Button opens up area per CD chart*/}
    <button 
onClick={(e) => {
  
  //on mobile, hide the other box 
  if (window.innerWidth < 768) {
  
  sethousingaddyopen(false);
  }
  
  setshowtotalarea(true);
}
}
className={'text-white mt-2 px-2 py-1 ml-2  bg-gray-900 bg-opacity-70 border-2 rounded-full border-teal-500 ' + `${showtotalarea === true ? " hidden " : ""}`}>
    Park Area per Council District</button></div>






<div className={`text-sm ${housingaddyopen ? `px-3 pt-2 pb-3 fixed sm:relative 

 top-auto bottom-0 left-0 right-0
  w-full sm:static sm:mt-2 sm:w-auto 
  sm:top-auto sm:bottom-auto sm:left-auto 
  sm:right-auto bg-gray-900 sm:rounded-xl 
   bg-opacity-80 sm:bg-opacity-80 text-white 
   border-t-2  sm:border border-teal-500 sm:border-grey-500
  
   
   ` : 'hidden'}`}>
  

  {parkClickedData && (
<>
<CloseButton onClose={() => {
  //close the box of the clicked park

    setParkClickedData(null);
    sethousingaddyopen(false);
    var singlePointSet:any = mapref.current.getSource('selected-park-area');
    
    //clear the datapoint
    singlePointSet.setData({
      "type": "FeatureCollection",
      "features": []
      });
   
}}></CloseButton>
<p className='text-bold font-bold'>{parkClickedData.properties.name}</p>
<p className='text-bold'>{parkClickedData.properties.address}</p>
{
  metric ? (
<>
{
  parkClickedData.properties.area && (
    parkClickedData.properties.area > 1000000 ? (
      <p>{(parkClickedData.properties.area/1000000).toFixed(3)} km<sup>2</sup></p>
    ) : (
      <p>{Math.round(parkClickedData.properties.area)} m<sup>2</sup></p>
    )
  )

}
</>
  ) : (
    <>
{
  parkClickedData.properties.area && (
    parkClickedData.properties.area > (2600000) ? (
      <p>{(parkClickedData.properties.area/2589988).toFixed(3)} sq mi</p>
    ) : (
      <p>{(Math.round(parkClickedData.properties.area) * (0.000247105)).toFixed(2)} acres</p>
    )
  )

}
</>
  )
}
<button className='underline border rounded-xl px-3 py-0.75 text-sm' style={
 { color: '#41ffca',
backgroundColor: '#41ffca15',
borderColor: '#41ffca'
}
}
onClick={(e) => {
  setmetric(!metric)
}}
>View in {metric ? 'sq mi' : 'km'}
{metric === false && (
  <sup>2</sup>
)}
</button>
</>



  )}



</div>

</div>



</div>

<div ref={divRef} style={{

}} className="map-container w-full h-full " />
        
     
      
 {(housingaddyopen === false || window.innerWidth >= 640) && (
   <>
      <DisclaimerPopup
      open={disclaimerOpen}
      openModal={openModal}
      closeModal={closeModal}
      />

   <div className={`absolute md:mx-auto z-9 bottom-2 left-1 md:left-1/2 md:transform md:-translate-x-1/2`}>
<a href='https://MejiaForController.com/' target="_blank" rel="noreferrer">
  
    <img src='/mejia-watermark-smol.png' className='h-9 md:h-10 z-40' alt="Kenneth Mejia for LA City Controller Logo"/>

                  

               
                  
    </a> 
                </div>
   </>
  
  )}
             

               

    </div>
  )
}

export default Home;
