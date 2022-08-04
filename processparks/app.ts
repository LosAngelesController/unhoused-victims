
//import parks from './parksv2.json';
import * as turf from '@turf/turf';

const fs = require('fs');


var endpointparks:Array<any> = []

const parks = require("./parksv2.json")

var parksGeojsonInit: any = parks

console.log('initparks', parks)

var parksGeojsonarea: any = {...parksGeojsonInit, features: parksGeojsonInit.features.map((eachPolygon:any) => {
  var objToReturn: any = {...eachPolygon}

  var area = turf.area(turf.multiPolygon(eachPolygon.geometry.coordinates));

  objToReturn.properties.area = area;

  //console.log(area);

  return objToReturn;
})}

var sortFeaturesByArea = parksGeojsonarea.features.sort((a:any, b:any) => {

    return  a.properties.area - b.properties.area;

});

console.log('sorted by area', sortFeaturesByArea)

var sortFeaturesByAreaDup:Array<any> = [...sortFeaturesByArea]

var lookupTableOfIntersectingParks:Array<any> = []


//for each park, look through all smaller parks for intersections
for(var i = 0; i < sortFeaturesByArea.length; i++)

{



  var parkIterate = sortFeaturesByAreaDup.pop();

  
  console.log('looking item 1', parkIterate.properties.address, Math.round(parkIterate.properties.area), " m^2")

  var thisPolygonBigPark = turf.multiPolygon(parkIterate.geometry.coordinates);

  console.log('valid polygon')

  lookupTableOfIntersectingParks.push(sortFeaturesByAreaDup
   .filter((eachPolygon:any) => {
    var ringlength = eachPolygon.geometry.coordinates[0].length;

    var validpolygon = true;

   try {
   var makepoly =  turf.multiPolygon(eachPolygon.geometry.coordinates)
   } catch (err) {
    console.log(err);
    console.log(eachPolygon)
    validpolygon = false;
   }

  // console.log(eachPolygon.properties.address, "ring length is", ringlength)

   // return ringlength > 3;
   return true;
   })
    .filter((eachSmallerPolygon:any) => {

      //console.log('actual small park')

      var isItIntersecting = turf.intersect(thisPolygonBigPark, turf.multiPolygon(eachSmallerPolygon.geometry.coordinates))

      if (isItIntersecting) {
        console.log('it is intersecting here')
      }

   return isItIntersecting;

  }))

}

//console.log('lookup table', lookupTableOfIntersectingParks)

console.log('lookup table length', lookupTableOfIntersectingParks.length)

console.log('lookup table length to clip', lookupTableOfIntersectingParks.filter((eachPolygon:any) => eachPolygon.length > 0))

//now for each item in the list, clip the intersections and return the resulting polygons into a new array

var clippedPolygons = lookupTableOfIntersectingParks.map((childrenParks:any,eachBiggerParkIndex) => {

  var eachBiggerParkInit = sortFeaturesByArea[eachBiggerParkIndex];

  var eachBiggerPark = {...eachBiggerParkInit};


  for(var clipcount = 0; clipcount < childrenParks.length; clipcount++) {
    if (childrenParks[clipcount]) {
 
      console.log('inside parks', childrenParks.length)
   // console.log('item ', typeof childrenParks[clipcount])


    
      var init = JSON.stringify(eachBiggerPark.geometry.coordinates)

      try {
      eachBiggerPark.geometry = turf.difference(
        turf.polygon(eachBiggerPark.geometry.coordinates)
        , turf.polygon(childrenParks[clipcount].geometry.coordinates)
        ).geometry;

        console.log('clipped polygon the same (looking for false) ',
         init === JSON.stringify(eachBiggerPark.geometry.coordinates)) 

      console.log('clip')
        console.log('result', eachBiggerPark.geometry)

      console.log(`from ${Math.round(eachBiggerParkInit.properties.area)} m^2 to ${Math.round(turf.area(turf.multiPolygon(eachBiggerPark.geometry.coordinates)))} m^2`)
    }catch (error) {
      console.error(error)
    }}
    

  }

  //console.log('clip result', eachBiggerPark)
  console.log('clipped total polygon the same (looking for false) ',
  JSON.stringify(eachBiggerParkInit) === JSON.stringify(eachBiggerPark))

  endpointparks.push(eachBiggerPark)  

  return eachBiggerPark;

});

//console.log('clippedPolygons', clippedPolygons)

const content = JSON.stringify({

  type: 'FeatureCollection',
  features: endpointparks
});

console.log('same as output (want false)', JSON.stringify(sortFeaturesByArea) === JSON.stringify(clippedPolygons))

fs.writeFile('outputparks.json', content, (err:any) => {
  if (err) {
    console.error(err);
  }
  // file written successfully
  console.log(
    '\nFile written successfully\n'
  )
});