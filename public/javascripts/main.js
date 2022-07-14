// main.js

function startMap() {
 
    // Store Ironhack's coordinates
    const ironhackBCN = { lat: 41.3977381,  lng: 2.190471916 };
    const eventOne = { lat: 41.4077381,  lng: 2.190471916 };
    const eventTwo = { lat: 41.3977381,  lng: 2.170471916 };
    const eventThree = { lat: 41.3677381,  lng: 2.150471916 };
    const eventFour = { lat: 41.4177381,  lng: 2.200471916 };
    const eventFive = { lat: 41.4077381,  lng: 2.170471916 };
   
    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'), 
      {
        zoom: 12,
        center: ironhackBCN
      }
    );
   
    // Add a marker for Ironhack Barcelona
    const IronhackBCNMarker = new google.maps.Marker({
      position: {
        lat: ironhackBCN.lat,
        lng: ironhackBCN.lng
      },
      map: map,
      title: "Event in Poblenou"
    });
    const eventOneMarker = new google.maps.Marker({
        position: {
          lat: eventOne.lat,
          lng: eventOne.lng
        },
        map: map,
        title: "Event in Poblenou"
      });
      const eventTwoMarker = new google.maps.Marker({
        position: {
          lat: eventTwo.lat,
          lng: eventTwo.lng
        },
        map: map,
        title: "Event in Poblenou"
      });
      const eventThreeMarker = new google.maps.Marker({
        position: {
          lat: eventThree.lat,
          lng: eventThree.lng
        },
        map: map,
        title: "Event in Montjuich"
      });
      const eventFourMarker = new google.maps.Marker({
        position: {
          lat: eventFour.lat,
          lng: eventFour.lng
        },
        map: map,
        title: "Event in Sant Marti"
      });
      const eventFiveMarker = new google.maps.Marker({
        position: {
          lat: eventFive.lat,
          lng: eventFive.lng
        },
        map: map,
        title: "Event in Gracia"
      });
   
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const user_location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
   
        // Center map with user location
        map.setCenter(user_location);
   
        // Add a marker for your user location
        const ironhackBCNMarker = new google.maps.Marker({
          position: {
            lat: user_location.lat,
            lng: user_location.lng
          },
          map: map,
          title: "You are here."
        });
   
      }, function () {
        console.log('Error in the geolocation service.');
      });
    } else {
      console.log('Browser does not support geolocation.');
    }
  }
   
  startMap();