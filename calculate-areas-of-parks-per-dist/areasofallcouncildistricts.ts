//const parks = require('./polygon-parts.json');
const parks = require('./export-dissolved-08-29.json');
const council = require('./CouncilDistricts.json');

import * as turf from '@turf/turf'


//const featurecollection = turf.dissolve(parks)

council.features.forEach((feature:any) => {


    var councilturf = turf.multiPolygon(feature.geometry.coordinates);


            const total = turf.area(councilturf);


    console.log(`"` + feature.properties.district+ `"` + ': ' + total + ",");

})