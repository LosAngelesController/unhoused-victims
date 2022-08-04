const parks = require('./polygon-parts.json');
const council = require('./CouncilDistricts.json');

import * as turf from '@turf/turf'

council.features.forEach((feature:any) => {

    var total = 0;

    var councilturf = turf.multiPolygon(feature.geometry.coordinates);

    parks.features.forEach((eachpark:any) => {

        const parkPoly =  turf.multiPolygon(eachpark.geometry.coordinates);

        var intersect = turf.intersect(councilturf, parkPoly);

        if (intersect) {

            total = total + turf.area(intersect);

        }

    })

    console.log('Total area of parks in ' + feature.properties.district + ' is ' + total);

})