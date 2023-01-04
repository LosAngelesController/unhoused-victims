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
import { GeoJsonProperties, MultiPolygon, Polygon } from 'geojson'

function isTouchScreen() {
  return window.matchMedia('(hover: none)').matches;
}

var cacheofcdsfromnames:any = {

}

function getLang() {
  if (navigator.languages != undefined) 
    return navigator.languages[0]; 
  return navigator.language;
}

var councilAreas = {
  "1": 3461932.7590381783,
  "2": 1924361.5332737048,
  "3": 982606.7721339666,
  "4": 20033630.537280265,
  "5": 1491713.4892952952,
  "6": 6519090.819275988,
  "7": 8866073.813593412,
  "8": 353877.31328993634,
  "9": 430437.22653758596,
  "10": 384810.68904536765,
  "11": 5663731.197031066,
  "12": 8126625.680731847,
  "13": 1439453.7837515455,
  "14": 1798025.189952638,
  "15": 3174782.823397767,
}

var councilareasdistrict:any = {
  "1": 39172374.513557486,
  "2": 56028687.75752604,
  "3": 91323827.86998883,
  "4": 127051659.05853269,
  "5": 85492955.75895034,
  "6": 70583244.58359845,
  "7": 140330608.52718654,
  "8": 41642747.81303825,
  "9": 33854278.76005373,
  "10": 38455731.29742687,
  "11": 165241605.83628467,
  "12": 149947134.17462063,
  "13": 42095086.21254906,
  "14": 63974277.0096737,
  "15": 83429528.39743595,
}

var councilpopulations:any = {
  "1": 248124,
"2":250535,
"3":257098,
"4":269290,
"5":269182,
"6":261114,
"7":266276,
"8":257597,
"9":255988,
"10":270703,
"11":270691,
"12":259564,
"13":252909,
"14":264741,
"15":258310,
}

const Home: NextPage = () => { 

var parksGeojson:any = parks;

var dogparksGeojson:any = {
  "type": "FeatureCollection",
"features": parks.features
.filter((eachPark:any) => 
{
  if (eachPark.properties.name) {
    var addresscontaindog = eachPark.properties.name.toLowerCase().includes("dog") || 
    eachPark.properties.name.toLowerCase().includes("glen alla") || eachPark.properties.name.toLowerCase().includes('ross snyder');
  
    return addresscontaindog;
  }  else {
    console.log('no name', eachPark)
    return false;
  }
  
})
};

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
const [showpop, setshowpop] = useState(false)
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
  const [showInitInstructions, setshowInitInstructions] = useState(true);

  function closeModal() {
    setDisclaimerOpen(false)
  }

  function checkIfRingsNeedToBeCorrected(polygon:any) {

    console.log('checking if rings need to be corrected', polygon)

    var polygontoreturn = polygon;

    if (polygon.geometry.type == "Polygon") {
      if (polygon.geometry.coordinates.length <= 3) {
        polygontoreturn.geometry.coordinates = [...polygon.geometry.coordinates, [polygon.geometry.coordinates[0][0] + 0.00000001, polygon.geometry.coordinates[0][1]]];
      } else {
       
      }
    } else {
    
    }

    return polygontoreturn;
  }

  function turfify(polygon:any) { 
    var turffedpolygon;

    console.log('polygon on line 100', polygon)
    
    if (polygon.geometry.type == "Polygon") { 
      turffedpolygon = turf.polygon(polygon.geometry.coordinates)
    } else {
      turffedpolygon = turf.multiPolygon(polygon.geometry.coordinates)
    }

   

    return turffedpolygon;
  }

  function polygonInWhichCd(polygon:any) {

    if (typeof polygon.properties.name === "string") {
      if (cacheofcdsfromnames[polygon.properties.name]) {
        return cacheofcdsfromnames[polygon.properties.name];
      } else {
        var turffedpolygon = turfify(polygon);
  
      const answerToReturn = councildistricts.features.find((eachItem:any) => {
        //turf sucks for not having type checking, bypasses compile error Property 'booleanIntersects' does not exist on type 'TurfStatic'.
        //yes it works!!!! it's just missing types
  // @ts-ignore: Unreachable code error
        return turf.booleanIntersects(turfify(eachItem), turffedpolygon);
  
      });
  
      cacheofcdsfromnames[polygon.properties.name] = answerToReturn;
  
      return answerToReturn;
      }
    }
   
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
 style: 'mapbox://styles/comradekyler/cl926hmr1000t14ljulm08vij', // style URL (THIS IS STREET VIEW)
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

  setshowtotalarea(window.innerWidth > 640 ? true : false);

  

  map.addSource('parks', {
    type: 'geojson',
    data: parksGeojson
    });

    map.addSource('dogparks', {
      type: 'geojson',
      data:dogparksGeojson
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

      map.loadImage(
        '/dog512.png',
        (error, image:any) => {
        if (error) throw error;
         
        // Add the image to the map style.
        map.addImage('superdog', image);
        
        map.addLayer({
          id: 'littledogs',
          type: 'symbol',
          source: 'dogparks',
          layout: { 
            'icon-image': 'superdog',
            'icon-size': [
              "interpolate", ["linear"], ["zoom"],
              // zoom is 10 (or greater) -
              7, 0.1,
              10, 0.1,
              20, 0.2
          ],
            'icon-rotate': 0,
            'icon-allow-overlap': true
          }
      
          });

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

    const namesofparks = e.features.map((feature:any) => feature.properties.name);

    var arrayOfFeatures = parksGeojson.features.filter((eachPark:any) => {

      try {
        var thispark = turfify(eachPark);

        // @ts-ignore: Unreachable code error
        var intersects = turf.booleanPointInPolygon(pointturf, thispark);

        return intersects;
        
      }
      catch (err:any) {
        return false;
      }
    
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
    setshowInitInstructions(false);

    if (window.innerWidth < 768) {
//on mobile, close the other popup of cd park areas
setshowtotalarea(false);

    }

   var affordablepoint: any = map.getSource('selected-park-area');

   if (dataToWrite) {
    
   affordablepoint.setData(dataToWrite.geometry);
   }
    
  //  map.setLayoutProperty("areasparks", 'visibility', 'visible');
  });

  map.on('mousedown', 'littledogs', (e:any) => {
    console.log("dog clicked");
    console.log(e);
    console.log(e.features[0]);

    console.log('coords', e.features[0].geometry.coordinates);

    var dogparkfound = 
    parksGeojson.features.filter((eachPark:any) => {
      return eachPark.properties.name === e.features[0].properties.name;
    });

    sethousingaddyopen(true);
    setshowInitInstructions(false);

    setParkClickedData(dogparkfound[0]);

    var affordablepoint: any = map.getSource('selected-park-area')

    affordablepoint.setData(dogparkfound[0].geometry);

    if (dogparkfound[0]) {

      var polygonOrMulti: any
      = turfify(dogparkfound[0])

      var coordtoflyto = turf.center(polygonOrMulti);

      console.log('coords to fly to', coordtoflyto);
  
      console.log(coordtoflyto.geometry.coordinates);

      var coordinates:[number,number] = [coordtoflyto.geometry.coordinates[0], coordtoflyto.geometry.coordinates[1]];
  
      console.log('final fly to coords', coordinates);

      setTimeout(() => {
        map.flyTo({
          center: coordinates,
          zoom: 15,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
          });

      }, 100)
  
      console.log('fly complete');
    }

   
    /*
    map.flyTo({
      center: [coordtoflyto.geometry.coordinates[0], coordtoflyto.geometry.coordinates[1]],
      zoom: 9,
      speed: 0.2
      });*/

     
  })

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
  });
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
  
  <div className='flex flex-col h-full w-screen absolute'>
      <Head>
     
      <link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-32x32.png" sizes="32x32"/>
<link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-192x192.png" sizes="192x192"/>
<link rel="apple-touch-icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-180x180.png"/> 
<meta name="msapplication-TileImage" content="https://mejiaforcontroller.com/wp-content/uploads/2020/12/cropped-favicon-1-270x270.png"/>


     <meta charSet="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
<title>LA Parks | Map</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@lacontroller" />
        <meta name="twitter:creator" content="@lacontroller" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="City of LA Parks and Dog Parks | Map and Land Analysis"></meta>
<meta name="twitter:description"  key='twitterdesc' content="City of LA Parks visualized. See all parks and observe inequities in park distribution."></meta>
      <meta name="twitter:image" key='twitterimg' content="https://github.com/Mejia-For-Controller/cdn/blob/main/thumbnailforparksmap2-min_50-min.png?raw=true"></meta>
      <meta name="description" content="City of LA Parks visualized. See all parks and observe inequities in park distribution." />

      <meta property="og:url"                content="https://parks.mejiaforcontroller.com/" />
<meta property="og:type"               content="website" />
<meta property="og:title"              content="City of LA Parks and Dog Parks | Map and Land Analysis" />
<meta property="og:description"        content="City of LA Parks visualized. See all parks and observe inequities in park distribution." />
<meta property="og:image"              content="https://github.com/Mejia-For-Controller/cdn/blob/main/thumbnailforparksmap2-min_50-min.png?raw=true" />



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
  >
  <strong className=''>City of LA Parks & Dog Parks</strong>
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
`}> <div>


<p className='text-white bold'>
{metric ? 'Km' : 'Sq Miles'}
{metric === true && (
  <sup>2</sup>
)} of City Parks Per District


 
  </p>
  

  <p>{
  showpop === true && (
<>
    <span className="text-amber-300">
     {`(District Population)`}</span></>
  )
}
  </p>
</div>
<div className='pl-7'>
  <CloseButton 
  overrideButtonClass='mt-0.5 mr-0'
   onClose={() => {
    setshowInitInstructions(false);
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
  className={`flex flex-row ${showpop === true ? "" : ""}`}
  key={eachEntry[0]}
  >
  <div className='w-5 inline'>{eachEntry[0]}</div>

<div className='flex flex-col w-full'>
<div className='w-full flex flex-row'>
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





<p  className={`ml-2 `}>
  
  {metric === false && (
    ((eachEntry[1]/1000000)*0.386102).toFixed(2)
  )}
  {
metric === true && (

(eachEntry[1]/1000000).toFixed(2)
)
}

<span className='text-blue-300'>

{` (`}{((eachEntry[1] / councilareasdistrict[eachEntry[0]]) * 100).toFixed(0)}% {`of ${metric ? (councilareasdistrict[eachEntry[0]] / 1000000).toFixed(0) :
 ((councilareasdistrict[eachEntry[0]] / 1000000)*0.386102).toFixed(0)})`}

</span>

{
  showpop === true && (


<span className='text-amber-400'>{` (`}  
    {Math.round((councilpopulations[eachEntry[0]]/1000))}
{`k)`}

{/*
{` (`}  {metric === false && (
    (((eachEntry[1])*1.19599) / councilpopulations[eachEntry[0]]).toPrecision(3)
  )}
  {
metric === true && (

((eachEntry[1])/ councilpopulations[eachEntry[0]]).toPrecision(3)
)
}{`)`}
*/}
</span>

  )
}
</p>

</div>

{
  false && (
<div className='w-full flex flex-row'>
<div


style={
  {
width: `${eachEntry[1]/200000}%`,
height: 5,
backgroundColor: 'orange',
  }
}
className='mt-auto mb-auto ml-2'
></div>





<p className={`ml-2 `}>
  
  {metric === false && (
    (((eachEntry[1])*1.19599) / councilpopulations[eachEntry[0]]).toPrecision(3)
  )}
  {
metric === true && (

((eachEntry[1])/ councilpopulations[eachEntry[0]]).toPrecision(3)
)
}</p>

</div>

  )
}

</div>





  </div>

    ))
  }
  </div>

<div className='gap-x-2 flex flex-row'>

<button className='underline border rounded-xl px-3 py-0.75 text-sm' style={
 { color: '#41ffca',
backgroundColor: '#41ffca15',
borderColor: '#41ffca'
}
}
onClick={(e) => {
  setmetric(!metric)
}}
>Switch to {metric ? 'sq mi' : 'km'}
{metric === false && (
  <sup>2</sup>
)}
</button>

<button className='underline border rounded-xl px-3 py-0.75 text-sm' style={
 { color: '#f59e0b',
backgroundColor: '#9a341222',
borderColor: '#f59e0b'
}
}
onClick={(e) => {
  setshowpop(!showpop)
}}
><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5 inline">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />

{
 showpop === true && (
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />

 )
}
  
</svg>
<span className='pl-1'>District Population</span>
</button>
</div>


  </div>

  <div className='w-content'>
    
    {/*Button opens up area per CD chart*/}
    <button 
onClick={(e) => {
  setshowInitInstructions(false);
  //on mobile, hide the other box 
  if (window.innerWidth < 768) {
  
  sethousingaddyopen(false);
  }
  
  setshowtotalarea(true);
}
}
className={'text-white mt-2 px-2 py-1 ml-2  bg-gray-900 bg-opacity-70 border-2 rounded-full border-teal-500 ' + `${showtotalarea === true ? " hidden " : ""}`}>
    Park Area Per Council District</button></div>




  
    {
          showInitInstructions && (
           <div className='md:hidden'
           //z-9 md:absolute md:transform md:mx-auto md:left-auto md:right-auto md:inset-x-1/2 md:right-auto md:-translate-x-1/2 
           >
 <p className=' inline-block 
 md:left-auto md:right-auto ml-2  z-9 text-sm md:text-sm 
    w-auto 
   md:bottom-auto md:top-16 text-black rounded-full px-3 py-1 mt-1'
              style={{
                background: "#030027aa",
                color: "#41ffca",
              }}
            >Click parks/corgis for info</p>

           </div>
          )
        }

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
  polygonInWhichCd(parkClickedData) && (
   <>
   <span>Council District </span>
   { polygonInWhichCd(parkClickedData).properties.district}
   </>
  )
}

{
  metric ? (
<>
{
  parkClickedData.properties.area && (
    parkClickedData.properties.area > 1000000 ? (
      <p>{(parkClickedData.properties.area/1000000).toFixed(3)} km<sup>2</sup></p>
    ) : (
      <p>{Math.round(parkClickedData.properties.area).toLocaleString(getLang())} m<sup>2</sup></p>
    )
  )

}
</>
  ) : (
    <>
{
  parkClickedData.properties.area && (
    parkClickedData.properties.area > (1000000) ? (
      <p>{(parkClickedData.properties.area/2589988).toFixed(3)} sq mi</p>
    ) : (
      <p>{Math.round(parkClickedData.properties.area * 1.19599).toLocaleString(getLang()) + ` sq yards (`}{(Math.round(parkClickedData.properties.area) * (0.000247105)).toFixed(2)} acres{`)`}</p>
    )
  )

}
</>
  )
}
<div className='flex flex-row gap-x-3'>
<button className='underline border rounded-xl px-3 py-0.75 text-sm' style={
 { color: '#41ffca',
backgroundColor: '#41ffca15',
borderColor: '#41ffca'
}
}
onClick={(e) => {
  setmetric(!metric)
}}
>Switch to {metric ? 'US units' : 'metric units'}
</button>

<a target="_blank" 

rel="noreferrer"
href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(`${parkClickedData.properties.name} Los Angeles CA`)}`}><button className='underline border rounded-xl px-3 py-0.75 text-sm' style={
 { color: '#7dd3fc',
backgroundColor: '#38bdf815',
borderColor: '#38bdf8'
}
}

>Google Maps

</button></a>


</div>

</>



  )}



</div>

</div>



</div>

<div ref={divRef} style={{

}} className="map-container w-full h-full " />



{
          showInitInstructions && (


                <p className=' inline-block hidden md:block
        absolute ml-2 sm:mx-auto z-9 md:text-base lg:text-lg sm:left-1/2 sm:transform sm:-translate-x-1/2 w-auto 
        bottom-12 sm:bottom-5 md:bottom-auto md:top-16  text-black  rounded-full px-3'
                  style={{
                    background: "#030027dd",
                    color: "#41ffca",
                  }}
                >Click parks/corgis for info</p>
            
       
          )
        }
        
     
      
 {(housingaddyopen === false || window.innerWidth >= 640) && (
   <>
     {
      (showtotalarea === false && !parkClickedData)&& (
        <DisclaimerPopup
        open={disclaimerOpen}
        openModal={openModal}
        closeModal={closeModal}
        />
      )
     }

   <div className={`absolute md:mx-auto z-9 bottom-2 left-1 md:left-1/2 md:transform md:-translate-x-1/2`}>
<a href='https://controller.lacontroller.gov/' target="_blank" rel="noreferrer">
  
    <img src='https://lacontroller.io/images/KennethMejia-logo-white-elect.png' className='h-9 md:h-10 z-40' alt="Kenneth Mejia LA City Controller Logo"/>

                  

               
                  
    </a> 
                </div>
   </>
  
  )}
             

               

    </div>
  )
}

export default Home;
