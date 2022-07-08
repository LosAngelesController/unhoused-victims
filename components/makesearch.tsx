export function addgeocodingtomap(map) {
    

const processgeocodereventresult = (eventmapbox:any) => {
    var singlePointSet:any = map.getSource('single-point');
  
    if (singlePointSet) {
      
    singlePointSet.setData(eventmapbox.result.geometry);
    }
    console.log('event.result.geometry',eventmapbox.result.geometry)
    console.log('geocoderesult', eventmapbox)
  }
  
  const processgeocodereventselect = (object:any) => {
  
      
    var coord = object.feature.geometry.coordinates;
    var singlePointSet:any = map.getSource('single-point');
    if (singlePointSet) {
    singlePointSet.setData(object.feature.geometry);
    }
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
  
}