import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

import { uploadMapboxTrack } from '../components/mapboxtrack';
import Nav from '../components/nav'

import React, {useEffect, useState} from 'react';
 
const councildistricts = require('./CouncilDistricts.json')
const citybounds = require('./citybounds.json')
import * as turf from '@turf/turf'

    // added the following 6 lines.
    import mapboxgl from 'mapbox-gl';

       import { assertDeclareExportAllDeclaration } from '@babel/types';




const Home: NextPage = () => {

  var [hasStartedControls, setHasStartedControls] = useState(false)

  function getRadius():any {
    if (window.innerWidth < 640) {
      return [
        "interpolate",
        ["linear"],
        ["zoom"],
        0.66,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          2,
          1000,
          10
        ],
        6.924,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          2.5,
          1000,
          60
        ],
        9.882,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          2.2,
          1000,
          75
        ],
        11.312,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          4,
          1000,
          80
        ],
        14,
        [
          "*",
          [
            "interpolate",
            ["linear"],
            [
              "to-number",
              [
                "get",
                "Affordable Units"
              ]
            ],
            0,
            4,
            1000,
            80
          ],
          1.2
        ],
        18,
        [
          "*",
          [
            "interpolate",
            ["linear"],
            [
              "to-number",
              [
                "get",
                "Affordable Units"
              ]
            ],
            0,
            6,
            2000,
            80
          ],
          4
        ]
      ]
    } else {
      return [
        "interpolate",
        ["linear"],
        ["zoom"],
        0.66,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          3,
          1000,
          30
        ],
        6.924,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          2.5,
          1000,
          50
        ],
        9.882,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          2.5,
          1000,
          60
        ],
        11.312,
        [
          "interpolate",
          ["linear"],
          [
            "to-number",
            [
              "get",
              "Affordable Units"
            ]
          ],
          0,
          4,
          1000,
          80
        ],
        14,
        [
          "*",
          [
            "interpolate",
            ["linear"],
            [
              "to-number",
              [
                "get",
                "Affordable Units"
              ]
            ],
            0,
            4,
            1000,
            80
          ],
          1.2
        ],
        18,
        [
          "*",
          [
            "interpolate",
            ["linear"],
            [
              "to-number",
              [
                "get",
                "Affordable Units"
              ]
            ],
            0,
            6,
            2000,
            80
          ],
          4
        ],
        25,
        [
          "*",
          [
            "interpolate",
            ["linear"],
            [
              "to-number",
              [
                "get",
                "Affordable Units"
              ]
            ],
            0,
            6,
            2000,
            80
          ],
          4
        ]
      ]
    }
  }

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
  style: 'mapbox://styles/comradekyler/cl03amxb2002g14p5mwo6nmqi?optimize=true', // style URL
  center: [-118.41,34], // starting position [lng, lat]
  zoom: formulaForZoom() // starting zoom
}



const map = new mapboxgl.Map(mapparams);

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
  var singlePointSet:any = map.getSource('single-point')
  singlePointSet.setData(event.result.geometry);
  console.log('event.result.geometry',event.result.geometry)
  console.log('geocoderesult', event)
});

geocoder.on('select', function(object:any){
  var coord = object.feature.geometry.coordinates;
  var singlePointSet:any = map.getSource('single-point')
  singlePointSet.setData(object.feature.geometry);
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


geocoder.on('result', (event:any) => {
  var singlePointSet:any = map.getSource('single-point')
  singlePointSet.setData(event.result.geometry);
  console.log('event.result.geometry',event.result.geometry)
  console.log('geocoderesult', event)
});

geocoder.on('select', function(object:any){
  var coord = object.feature.geometry.coordinates;
  var singlePointSet:any = map.getSource('single-point')
  singlePointSet.setData(object.feature.geometry);
});
}


window.addEventListener('resize',  handleResize);  

map.on('load', () => {

  if (debugParam) {
    map.showTileBoundaries = true;
    map.showCollisionBoxes = true;
    map.showPadding = true;
  }

  if (urlParams.get('terraindebug')) {

    map.showTerrainWireframe = true;
  }

  map.addSource('housingvector', {
    'type': 'vector',
    'url': 'mapbox://comradekyler.ckzxdlka74tqd27p9n2r3a08p-0dvs5'
    });

    map.addLayer({
      'id': 'housinglayer',
      'type': 'circle',
      'source': 'housingvector',
      'source-layer': 'export-housing-2022-v7',
      'paint': {
      'circle-color': [
        "interpolate",
        ["linear"],
        [
          "to-number",
          ["get", "Affordable %"]
        ],
        0,
        "#fde047",
        1,
        "#16a34a"
      ],
      'circle-radius': getRadius(),
    //'circle-radius': 20,
      "circle-pitch-scale": "viewport",
      "circle-pitch-alignment": "viewport",
      'circle-stroke-width': [
        "interpolate",
        ["linear"],
        ["zoom"],
        5,
        1.2,
        8,
        1.7,
        17,
        1.8
      ],
      'circle-stroke-color': "#111111"
      }
      });

      // Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
  });
   
  map.on('mousemove', 'housinglayer', (e:any) => {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = 'pointer';
   
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = `<b>${e.features[0].properties["Address"]}</b> ${e.features[0].properties["Zip Code"]}<br>
  Council District <strong>${e.features[0].properties["councildist"]}</strong> <br>
  <strong>${e.features[0].properties["Affordable Units"]}</strong> Affordable Units<br>
  <strong>${e.features[0].properties["Total Units"]}</strong> Total Units<br>
  <strong>Covenant Year</strong> ${e.features[0].properties["Year of Covenant"]}
  ${e.features[0].properties["Certificate of Occupancy"] ? `<br><b> Certificate of Occupancy</b> ${e.features[0].properties["Certificate of Occupancy"]}` : `<br><b> Certificate of Occupancy</b> None in Data`}
  ${e.features[0].properties["Type"] ? `<br>${e.features[0].properties["Type"]}` : ""}
  ${e.features[0].properties["Type2"] ? `<br>${e.features[0].properties["Type2"]}` : ""}
  `;
   
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
      "line-color": '#41ffca',
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

var mapname = 'housingv2'

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
<title>Affordable Housing Covenants - 2010 to 2021 | Map</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="Affordable Housing Covenants - 2010 to 2021 | Map"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Browse and Search Affordable Housing in Los Angeles"></meta>
      <meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/affordablehousingpic.png"></meta>
      <meta name="twitter:image:alt" content="Where is LA's Affordable Housing? | Kenneth Mejia for LA City Controller" />
      <meta name="description" content="A Map of Affordable Housing in Los Angeles. Find Housing near you." />

      <meta property="og:url"                content="https://affordablehousing.mejiaforcontroller.com/" />
<meta property="og:type"               content="website" />
<meta property="og:title"              content="Affordable Housing Covenants - 2010 to 2021 | Map" />
<meta property="og:description"        content="Browse and Search Affordable Housing in Los Angeles" />
<meta property="og:image"              content="https://data.mejiaforcontroller.com/affordablehousingpic.png" />

<script defer={true} src="https://helianthus.mejiaforcontroller.com/index.js"></script>
      </Head>
   
  <div className='flex-none'>
    <Nav/>
  </div>
           
  <div
      className='flex-initial h-content outsideTitle flex-col flex z-50'
    >


  <div className='titleBox fixed text-sm md:text-base mt-[3.8em] ml-2 md:mt-[3.8em] md:ml-3 break-words bg-gray-100'>Affordable Housing Covenants - 2010 to 2021</div>

  <div
    className={`geocoder md:hidden mt-[5.5em] xs:text-sm sm:text-base md:text-lg`} id='geocoder'></div>
</div>

<div ref={divRef} style={{

}} className="map-container w-full h-full " />
        
     
     <div className={`absolute md:mx-auto z-9 bottom-2 left-1 md:left-1/2 md:transform md:-translate-x-1/2`}>
<a href='https://MejiaForController.com/' target="_blank" rel="noreferrer">
    
  
                  <img src='/mejia-watermark-smol.png' className='h-9 md:h-10' alt="Kenneth Mejia for LA City Controller Logo"/>
                  
    </a>
  
                </div>

    </div>
  )
}

export default Home;
