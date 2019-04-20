(function () {
    window.Components.Pages.TownTransport = {

        template: `
<div>
    <div id="map">

    </div>
    <input id="origin-input" class="controls" type="text"
           placeholder="Enter an origin location">

    <input id="destination-input" class="controls" type="text"
           placeholder="Enter a destination location">

    <div id="mode-selector" class="controls">
        <input type="radio" name="type" id="changemode-walking" checked="checked">
        <label id="label" for="changemode-walking">Walking</label>

        <input type="radio" name="type" id="changemode-transit">
        <label id="label" for="changemode-transit">Transit</label>

        <input type="radio" name="type" id="changemode-driving">
        <label id="label" for="changemode-driving">Driving</label>
    </div>
</div>`,


        /**
         * Create initMap function for fetch the map by using town latitude and longitute as center
         * @param {string} name -the name of this toute
         * @returns {function} AutocompleteDirectionsHandler
         */
        mounted() {
            let name = this.$route.params.name;
            let center;

            window.initMap = function () {


                if (name === "dundee") {
                    center = {
                        lat: 56.462018,
                        lng: -2.970721000000026
                    };
                } else if (name === "st-andrews") {
                    center = {
                        lat: 56.339775,
                        lng: -2.796721
                    };
                } else if (name === "cupar") {
                    center = {
                        lat: 56.320235,
                        lng: -3.010137
                    };
                } else {
                    center = {
                        lat: 56.339775,
                        lng: -2.796721
                    };
                }

                let map = new google.maps.Map(document.getElementById('map'), {
                    mapTypeControl: false,
                    center: center,
                    zoom: 15
                });

                new AutocompleteDirectionsHandler(map);
            };

            /**
             * @constructor
             * @param {string} map -the map of route
             *
             */
            function AutocompleteDirectionsHandler(map) {
                this.map = map;
                this.originPlaceId = null;
                this.destinationPlaceId = null;
                this.travelMode = 'WALKING';
                let originInput = document.getElementById('origin-input');
                let destinationInput = document.getElementById('destination-input');
                let modeSelector = document.getElementById('mode-selector');
                this.directionsService = new google.maps.DirectionsService();
                this.directionsDisplay = new google.maps.DirectionsRenderer();
                this.directionsDisplay.setMap(map);

                let originAutocomplete = new google.maps.places.Autocomplete(
                    originInput, {
                        placeIdOnly: true
                    });
                let destinationAutocomplete = new google.maps.places.Autocomplete(
                    destinationInput, {
                        placeIdOnly: true
                    });

                this.setupClickListener('changemode-walking', 'WALKING');
                this.setupClickListener('changemode-transit', 'TRANSIT');
                this.setupClickListener('changemode-driving', 'DRIVING');

                this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
                this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
            }

            // Sets a listener on a radio button to change the filter type on Places
            // Autocomplete.
            AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
                let radioButton = document.getElementById(id);
                let me = this;
                radioButton.addEventListener('click', function () {
                    me.travelMode = mode;
                    me.route();
                });
            };

            AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
                let me = this;
                autocomplete.bindTo('bounds', this.map);
                autocomplete.addListener('place_changed', function () {
                    let place = autocomplete.getPlace();
                    if (!place.place_id) {
                        window.alert("Please select an option from the dropdown list.");
                        return;
                    }
                    if (mode === 'ORIG') {
                        me.originPlaceId = place.place_id;
                    } else {
                        me.destinationPlaceId = place.place_id;
                    }
                    me.route();
                });

            };

            AutocompleteDirectionsHandler.prototype.route = function () {
                if (!this.originPlaceId || !this.destinationPlaceId) {
                    return;
                }
                let me = this;

                this.directionsService.route({
                    origin: {
                        'placeId': this.originPlaceId
                    },
                    destination: {
                        'placeId': this.destinationPlaceId
                    },
                    travelMode: this.travelMode
                }, function (response, status) {
                    if (status === 'OK') {
                        me.directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            };
        },

        created() {
            let ckeditor = document.createElement('script');
            ckeditor.setAttribute('src', "//maps.googleapis.com/maps/api/js?key=AIzaSyCE8I0iudSHsb_UHF8iVU5_EPBKGJGNnS4&libraries=places&callback=initMap");
            ckeditor.setAttribute('async', '');
            ckeditor.setAttribute('defer', '');
            document.head.appendChild(ckeditor);
        }

    };
})();
