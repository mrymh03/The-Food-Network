/*
    FILE: MapForHome.js [COMPLETE]
    AUTHOR: [REDACTED FOR PRIVACY]
*/

import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';


import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { LineString } from 'ol/geom';
import { Style, Icon, Stroke } from 'ol/style';
import { circular } from 'ol/geom/Polygon';
import { Circle as CircleStyle, Fill } from 'ol/style';
import Control from 'ol/control/Control';
import Overlay from 'ol/Overlay';
import Selection from 'ol/interaction/Select';
import { pointerMove } from 'ol/events/condition';

import GeoJSON from 'ol/format/GeoJSON';
import MapSubBanks from './SubBanksForMap';

import mealPin from '../mapIcons/MealPin.png';
import bankPin from '../mapIcons/BankPin.png';
import groceryPin from '../mapIcons/GroceryPin.png';
import subPin from '../mapIcons/SubPin.png';


function MapForHome() {
    const [map, setMap] = useState(null);
    const [banks, setBanks] = useState([]);
    const [localBanks, setLocalBanks] = useState([]);
    const [localMeal, setLocalMeal] = useState([]);
    const [localGrocery, setLocalGrocery] = useState([]);
    
    const [popup, setPopup] = useState(null);

    // Add these state variables at the top of your component
    const [userLocation, setUserLocation] = useState(null);
    const [geoSource, setGeoSource] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    const [routeLayer, setRouteLayer] = useState(null);
    const [startingLocation, setStartingLocation] = useState(null);

    var subsLayer = useState(null);
    var mealLayer = useState(null);
    var bankLayer = useState(null);
    var groceryLayer = useState(null);
    var userCity = useState(null);
    var userState = useState(null);



    const geocodeAddress = async (address) => {
        const apiKey =  '5b3ce3597851110001cf6248b851ba83b22545899b9a0d7216d640ea';
        const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;
        console.log("Sending request to: ", url); 

        console.log('Fetching geocode for:', address);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Geocoding error: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.features.length > 0) {
                return data.features[0].geometry.coordinates;
            } else {
                console.error('No results found for address:', address);
                return null;
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };



  useEffect(() => {
    console.log("INITIALIZING MAP");

    const osmLayer = new TileLayer({
        title: "OpenStreetMap layer",
        id: "osm",
        preload: Infinity,
        source: new OSM(),
    });

    subsLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            image: new Icon({
                src: subPin,
                scale: 0.015
            })
        }),
        properties: { name: 'Subscribed Banks' }
    });

    mealLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            image: new Icon({
                src: mealPin,
                scale: 0.015
            })
        }),
        properties: { name: 'Meal Providers' }
    });

    bankLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            image: new Icon({
                src: bankPin,
                scale: 0.015
            })
        }),
        properties: { name: 'Food Banks' }
    });

    groceryLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            image: new Icon({
                src: groceryPin,
                scale: 0.015
            })
        }),
        properties: { name: 'Grocery Stores' }
    });

    const geoLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }),
        properties: { name: 'Geolocation' }
    });

    const routeLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            stroke: new Stroke({
                color: "rgb(240, 82, 82)",
                width: 4
            })
        }),
        properties: { name: 'Route' }
    });

    const initialMap = new Map({
        target: "map",
        layers: [osmLayer, geoLayer, routeLayer, mealLayer, bankLayer, groceryLayer],
        view: new View({
            center: fromLonLat([-110.9747, 32.2226]),
            zoom: 14,
        }),
        properties: { name: 'OpenStreetMap' }
    });

    setMap(initialMap);
    // Cleanup function
    return () => {
        if (initialMap) {
            initialMap.setTarget(null);
        }
    };
    }, []); // Empty dependency array - only run once



    // Add this useEffect for handling geolocation
    useEffect(() => {
        console.log("SETTING UP GEOLOCATION");
        if (!map) return;

        let source;
        let firstLocalPos;
        let firstLocalAccur;
        

        // Create geolocation source if it doesn't exist
        if (!geoSource) {
            console.log('Creating new geolocation source...');
            source = new VectorSource();
            setGeoSource(source);
        }
        else {
            source = geoSource;
        }

        // Function to update location on the map
        const updateLocation = (coords, accuracy) => {
            map.getLayers().forEach(layer => {
                if (layer.getProperties().name === 'Geolocation') {
                    source = layer.getSource();
                }
            });
            
            if (!source) return;
            
            const point = [coords.longitude, coords.latitude];
            setStartingLocation(point);
            console.log("Starting Location: ", point);
            setUserLocation(point);

            const accuracyFeature = new Feature(
                circular(point, accuracy).transform('EPSG:4326', map.getView().getProjection())
            );
            
            const pointFeature = new Feature(new Point(fromLonLat(point)));
            
            map.getLayers().forEach(layer => {
                if (layer.getProperties().name === 'Geolocation') {
                    console.log('Updating geolocation layer...');
                    layer.getSource().clear();
                    layer.getSource().addFeatures([accuracyFeature, pointFeature]);
                }
            });
        };

        const fetchLocalBanks = async () => {
            const geocodeAddress = async (address) => {
                const apiKey =  '5b3ce3597851110001cf6248b851ba83b22545899b9a0d7216d640ea';
                const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;
                console.log("Sending request to: ", url); 
    
                console.log('Fetching geocode for:', address);
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Geocoding error: ${response.statusText}`);
                    }
                    const data = await response.json();
                    if (data.features.length > 0) {
                        return data.features[0].geometry.coordinates;
                    } else {
                        console.error('No results found for address:', address);
                        return null;
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    return null;
                }
            };

            try {
                console.log('Fetching local banks..., starting location:', startingLocation);
                const response = await fetch('/backend/auth/temp?' + new URLSearchParams ({
                    searchTerm: startingLocation,
                    type: "food bank",
                }), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await response.json();
                if (response.ok) {
                    setLocalBanks(data);
                    // setLocalMeal
                    // setLocalGrocery
                    console.log("Local Banks: ", data);

                    for (const bank of data) {
                        const { title, address, phone, url } = bank;
                        if (phone === null) {
                            phone = "No phone number available";
                        }
                        
                        const fullAddress = `${address}`;
                        console.log('Geocoding address:', fullAddress);
                        
                        const coordinates = await geocodeAddress(fullAddress);
                        if (coordinates) {
                            map.getLayers().forEach(layer => {
                                if (layer.getProperties().name === 'Food Banks') {
                                    const feature = new Feature({
                                        geometry: new Point(fromLonLat(coordinates))
                                    });
                                    feature.setProperties({ description: title });
                                    feature.setProperties({ address: fullAddress });
                                    feature.setProperties({ services: phone });
                                    const hours = `<a href="${url}" target="_blank">View details on Google Maps</a>`;
                                    feature.setProperties({ hours: hours });
                                    feature.setProperties({ phone: ""});
                                    layer.getSource().addFeature(feature);
                                }
                                
                            });
                            
                        }
                    }

                } else {
                    throw new Error('fail');
                }
            } catch (error) {
                console.error("fail", error);
            }



            // For Meal Providers
            try {
                console.log('Fetching local banks..., starting location:', startingLocation);
                const response = await fetch('/backend/auth/temp?' + new URLSearchParams ({
                    searchTerm: startingLocation,
                    type: "hot meals for homeless",
                }), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await response.json();
                if (response.ok) {
                    setLocalMeal(data);
                    // setLocalGrocery
                    console.log("Local providers: ", data);

                    for (const bank of data) {
                        const { title, address, phone, url } = bank;
                        if (phone === null) {
                            phone = "No phone number available";
                        }
                        
                        const fullAddress = `${address}`;
                        console.log('Geocoding address:', fullAddress);
                        
                        const coordinates = await geocodeAddress(fullAddress);
                        if (coordinates) {
                            map.getLayers().forEach(layer => {
                                if (layer.getProperties().name === 'Meal Providers') {
                                    const feature = new Feature({
                                        geometry: new Point(fromLonLat(coordinates))
                                    });
                                    feature.setProperties({ description: title });
                                    feature.setProperties({ address: fullAddress });
                                    feature.setProperties({ services: phone });
                                    const hours = `<a href="${url}" target="_blank">View details on Google Maps</a>`;
                                    feature.setProperties({ hours: hours });
                                    feature.setProperties({ phone: ""});
                                    layer.getSource().addFeature(feature);
                                }
                                
                            });
                            
                        }
                    }

                } else {
                    throw new Error('fail');
                }
            } catch (error) {
                console.error("fail", error);
            }


            // For Grocery Stores
            try {
                console.log('Fetching local banks..., starting location:', startingLocation);
                const response = await fetch('/backend/auth/temp?' + new URLSearchParams ({
                    searchTerm: startingLocation,
                    type: "grocery store",
                }), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await response.json();
                if (response.ok) {
                    setLocalGrocery(data);
                    console.log("Local stores: ", data);

                    for (const bank of data) {
                        const { title, address, phone, url } = bank;
                        if (phone === "") {
                            phone = "No phone number available";
                        }
                        
                        const fullAddress = `${address}`;
                        console.log('Geocoding address:', fullAddress);
                        
                        const coordinates = await geocodeAddress(fullAddress);
                        if (coordinates) {
                            map.getLayers().forEach(layer => {
                                if (layer.getProperties().name === 'Grocery Stores') {
                                    const feature = new Feature({
                                        geometry: new Point(fromLonLat(coordinates))
                                    });
                                    feature.setProperties({ description: title });
                                    feature.setProperties({ address: fullAddress });
                                    feature.setProperties({ services: phone });
                                    const hours = `<a href="${url}" target="_blank">View details on Google Maps</a>`;
                                    feature.setProperties({ hours: hours });
                                    feature.setProperties({ phone: ""});
                                    layer.getSource().addFeature(feature);
                                }
                                
                            });
                            
                        }
                    }

                } else {
                    throw new Error('fail');
                }
            } catch (error) {
                console.error("fail", error);
            }
        };

        // Two-phase location tracking
        const startLocationTracking = () => {
            console.log('\tStarting location tracking...');
            setIsLocating(true);

            // Phase 1: Quick initial position
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    console.log('Initial geolocation:', pos);
                    firstLocalPos = pos.coords;
                    firstLocalAccur = pos.coords.accuracy;
                    updateLocation(pos.coords, pos.coords.accuracy);
                    
                    // Phase 2: High accuracy tracking
                    const watchId = navigator.geolocation.watchPosition(
                        (pos) => {
                            updateLocation(pos.coords, pos.coords.accuracy);
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            setIsLocating(false);
                        },
                        {
                            enableHighAccuracy: true,
                            maximumAge: 0
                        }
                    );

                    // Cleanup function
                    return () => {
                        navigator.geolocation.clearWatch(watchId);
                        setIsLocating(false);
                    };
                },
                (error) => {
                    console.error('Initial geolocation error:', error);
                    setIsLocating(false);
                },
                {
                    enableHighAccuracy: false,
                    maximumAge: 0
                }
            );
            fetchLocalBanks();
        };

        

        console.log("\tCalling startLocationTracking");
        startLocationTracking();


        
        const locate = document.createElement('div');
        locate.className = 'ol-control ol-unselectable locate';
        locate.innerHTML = '<button title="Locate me">◎</button>';
        locate.addEventListener('click', function () {
            startLocationTracking();
            
            const point = [firstLocalPos.longitude, firstLocalPos.latitude];
            setStartingLocation(point);
           
            // Center map on user location
            map.getView().animate({
                center: fromLonLat(point),
                zoom: 14,
                duration: 1000
            });
        });

        map.addControl(
            new Control({
                element: locate,
            })
        );


        // Cleanup
        return () => {
            if (geoSource) {
                geoSource.clear();
            }
        };
    }, [map]);
    

    // Routing setup
    useEffect(() => {
        console.log("SETTING UP ROUTING");

        if (!map) return;

        // Create route layer
        const newRouteLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({
                    color: "rgb(240, 82, 82)",
                    width: 4
                })
            })
        });

        setRouteLayer(newRouteLayer);

        // Cleanup
        return () => {
            if (map && newRouteLayer) {
                map.removeLayer(newRouteLayer);
            }
        };
    }, [map]); 

    // Function to fetch the route from OpenRouteService
    const fetchRoute = useCallback(async (start, destination) => {
        const apiKey = '5b3ce3597851110001cf6248b851ba83b22545899b9a0d7216d640ea';
        
        console.log('Start:', start);
        console.log('Destination:', destination);
        const lonLatCoordinates = toLonLat(destination);
                
        destination = lonLatCoordinates; // Now dest is [longitude, latitude]
        console.log("Destination: ", destination);
        
        try {
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${destination[0]},${destination[1]}`;
            console.log('Request URL:', url);
            const response = await fetch(url, {
                headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Route data received:", data);
            return data;
        } catch (error) {
            console.error("Error fetching route:", error);
            throw error;
        }
    }, [map]);

    // Function to add route to map
    const addRouteToMap = useCallback((geojsonData) => {
        const dist = geojsonData.features[0].properties.summary.distance;
        const dur = geojsonData.features[0].properties.summary.duration;

        let routeLay;
        map.getLayers().forEach(layer => {
            if (layer.getProperties().name === 'Route') {
                routeLay = layer;
            }
        });

        if (!routeLay) return;
        
        try {
            const features = new GeoJSON().readFeatures(geojsonData, {
                featureProjection: 'EPSG:3857'
            });

            features.forEach(feature => {
                feature.set('routeDist', dist);
                feature.set('routeDur', dur);
            });

            map.getLayers().forEach(layer => {
                if (layer.getProperties().name === 'Route') {
                    layer.getSource().clear();
                    layer.getSource().addFeatures(features);
                }
            });

            // Hover over the route to see the distance and duration
            const hoverInt = new Selection({
                condition: pointerMove,
                layers: [routeLay],
                style: new Style({
                    stroke: new Stroke({
                        color: "rgb(240, 82, 82)",
                        width: 6
                    })
                })
            });
            map.addInteraction(hoverInt);

            // Overlay for route info
            const infoElement = document.createElement('div');
            infoElement.style.cssText = `
                background-color: white;
                border: 1px solid black;
                padding: 5px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                display: none;
                position: absolute;
                z-index: 1000;
                max-width: 300px; /* Set a maximum width */
                white-space: nowrap; /* Prevent text wrapping */
                overflow: hidden; /* Hide overflow */
                text-overflow: ellipsis; /* Add ellipsis for overflow text */
            `;
            document.body.appendChild(infoElement);

            const routeInfoOverlay = new Overlay({
                element: infoElement,
                positioning: 'bottom-center',
                stopEvent: false,
                offset: [0, -10]
            });
            map.addOverlay(routeInfoOverlay);

            // Hover event listener
            map.on('pointermove', (event) => {
                const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
                // if feature is not null and it is a route feature
                if (feature && feature.get('routeDist') && feature.get('routeDur')) {
                    const distance = metersToMiles(feature.get('routeDist'));
                    const duration = formatDuration(feature.get('routeDur'));// Update info element
                    infoElement.innerHTML = `
                        <div>
                            Distance: ${distance} mi<br>
                            Duration: ${duration}
                        </div>
                    `;
                    infoElement.style.display = 'block';
                    
                    // Position overlay
                    routeInfoOverlay.setPosition(event.coordinate);
                } else {
                    routeInfoOverlay.setPosition(undefined);
                }
            });

        } catch (error) {
            console.error("Error adding route to map:", error);
        }
    }, [routeLayer]);  // maybe add map here

    // Format duration time
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours} hr ${minutes} min`;
        } else {
            return `${minutes} min`;
        }
    };

    // Convert distance from meters to miles
    const metersToMiles = (meters) => {
        return Math.floor(meters * 0.000621371);
    };

    // Get route when clicking on a destination
    const handleDestinationClick = useCallback(async (destination) => {
        if (!startingLocation) {
            console.error('No starting location available');
            return;
        }
        try {
            const routeData = await fetchRoute(startingLocation, destination);
            addRouteToMap(routeData);
        } catch (error) {
            console.error("Error handling destination click:", error);
        }
    }, [startingLocation, fetchRoute, addRouteToMap]);



    // Initialize popup in a useEffect
    useEffect(() => {
        const popupElement = document.createElement('div');
        popupElement.className = 'popup';
        document.body.appendChild(popupElement);
        setPopup(popupElement);

        return () => {
            document.body.removeChild(popupElement);
        };
    }, []);


    // Info popup for map markers
    useEffect(() => {
        if (!map) return;

        const clickHandler = async (event) => {
            const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
            if (feature) {
                const coords = feature.getGeometry().getCoordinates();
                const description = feature.getProperties().description;
                const address = feature.getProperties().address;
                const services = feature.getProperties().services;
                const hours = feature.getProperties().hours;
                const phone = feature.getProperties().phone;

                // Set the popup content and position
                popup.innerHTML = `
                    <div class="popup-content">
                        <h3>${description}</h3>
                        <p>${address}</p>
                        <p>${hours}</p>
                        <p>${services}</p>
                        <p>${phone}</p>
                        
                        <button id="close-popup">Close</button>
                    </div>
                `;

                //popup.innerHTML = description;
                popup.style.display = 'block';
                popup.style.position = 'absolute';
                popup.style.left = '490px';
                popup.style.top = '1100px';
                
                await handleDestinationClick(coords);
            }
        };
        map.on('click', clickHandler);

        popup.addEventListener('click', async function(event) {
            if (event.target.id === 'get-directions') {
                await handleDestinationClick(userLocation);
            }
        });

        // Close popup
        popup.addEventListener('click', function(event) {
            if (event.target.id === 'close-popup') {
                map.getLayers().forEach(layer => {
                    if (layer.getProperties().name === 'Route') {
                        layer.getSource().clear();  // Clear route layer
                    }
                });
                popup.style.display = 'none';
            }
        });

        return () => {
            map.un('click', clickHandler);
        };
    }, [map, handleDestinationClick]);


    // Third useEffect - Add markers when coordinates are available
    useEffect( () => {
        if (!map ) return;

        // Add meal providers layer
        const mealCoordinates = [
            [-110.978260, 32.232698, "Caridad Communitiy Kitchen", "845 N Main Ave, Tucson, AZ 85705","", "Mon-Fri 2:00PM-4:00PM", "+1(520)882-5641"],
            [-110.975433, 32.231906, "Holy Family Church", "338 W University Blvd, Tucson, AZ 85705", "", "Sun-Wed 3:00PM-4:00 pm", "+1(520)623-6773"],
            [-110.967017, 32.243502, "Mt. Calvary Missionary Baptist Church", "226 E Lester St, Tucson, AZ 85705", "", "Tues 3:00PM-5:00PM", "+1(520)624-3813"],
            [-110.935915, 32.264756, "Northminister Presbyterian Church", "2450 E Fort Lowell Rd, Tucson, AZ 85719", "", "Mon 5:00PM-6:00PM", "+1(520)327-2321"],
            [-110.963007, 32.203693, "Casa Maria", "352 E 25th St, Tucson, AZ 85713", "", "Sun-Sat 8:30AM-11:30AM", "+1(520)624-0312"],
            [-110.966062, 32.219745, "Armory Parks and Rec Food Distribution", "220 S 5th Ave, Tucson,AZ 85701", "", "Mon-Fri 3:00PM-4:00PM, Seniors Only", "+1(520)791-4865"],
        ];

        mealCoordinates.forEach(coord => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(coord.slice(0, 2))), // Convert to map's coordinate system
            });
            feature.setProperties({ description: coord[2] });
            feature.setProperties({ address: coord[3] });
            feature.setProperties({ services: coord[4] });
            feature.setProperties({ hours: coord[5] });
            feature.setProperties({ phone: coord[6] });

            map.getLayers().forEach(layer => {
                if (layer.getProperties().name === 'Meal Providers') {
                    layer.getSource().addFeature(feature);
                }
            });
        });

        // Add food banks layer
        const bankCoordinates = [
            [-110.983545, 32.246979, "Caring Ministries", "820 W Calle Sur #5330, Tucson, AZ 85705", "Services: Fruit, Produce, Bread, Dairy, Clothing", "Mon-Fri 7:00AM-9:00AM", "+1(520)882-2645"],
            [-110.945729, 32.240149, "UA Campus Pantry North", "UA Health Science Library Rm 1152", "Services: Produce, Breakfast Staples, Canned Goods, Bread", "Thurs 12:30PM-2:30PM", "+1(520)626-7083"],
            [-110.920240, 32.190317, "Community Food Bank", "3003 S Country Club Rd, Tucson, AZ 85713", "Services: Rice, Frozen Foods, Canned Goods, Vegetables", "Tues-Wed 8:00AM-3:00PM, Thurs 8:00AM-6:00PM", "+1(520)622-0525"],            
            [-110.966476, 32.139167, "Interfaith Community Services Mobile Food Bank", "Location Varies", "Services: Food Boxes, Fresh Produce, Bread", "https://www.icstucson.org/what-we-do/emergency-assistance/mobile-food-bank/", ""],
            [-110.908747, 32.245588, "Emmanuael Baptist Church", "1825 N Alvernon Way, Tucson, AZ 85712", "Services: Food Boxes, Clothing, Hygiene Items", "Tues 11:00AM", "+1(520)323-9379"],
            [-111.018756, 32.238158, "Most Holy Trinity Parish", "1300 N Greasewood Rd, Tucson, AZ 85745", "Services: Food Boxes, Non-perishables, Canned Goods", "Foodbox on Request (520-884-9021)", ""],
            [-110.935040, 32.241188, "Grace Saint Paul's Church - Joseph's Pantry", "2331 E Adams St, Tucson, AZ 85719", "Services: Food Boxes", "Mon-Fri 9:00AM-12:00PM", "+1(520)327-6857"],
            [-110.911199, 32.233802, "Iskashitaa Refugee Network", "3736 E. 2nd St, Tucson, AZ 85716", "Services: Fresh Produce and Fruit, Canned and Dry Goods", "Mon-Fri 9:00AM-4:00PM", "+1(520)440-0100"],
            [-110.964105, 32.231499, "Trinity Presbyterian Church", "400 E University Blvd, Tucson, AZ 85705", "Services: Fruit, Vegetables, Non-perishables, Canned Goods, Cases of Water", "Tues & Thurs 12:00PM-3:00PM", "+1(520)623-2579"],
            [-110.875044, 32.230328, "Christ United Methodist Church", "655 N Craycroft Rd, Tucson, AZ 85711", "Services: Food Boxes, Bags of Groceries, Canned Meat", "Mon-Fri 9:00AM-12:00PM", "+1(972)596-4303"],
            [-110.905664, 32.250232, "Living Faith Christian Center", "4108 E North St, Tucson, AZ 85712", "Services: Food Boxes", "Tues 5:00PM-6:00PM", "+1(520)722-2217"],
            [-110.971171, 32.224325, "Tucson Indian Center", "97 E Congress St, Tucson, AZ 85701", "Services: Food Boxes, Diapers", "Mon: 11:00AM-4:00PM, Tues-Fri 9:00AM-4:00PM", "+1(520)884-7131"],
        ];

        
        console.log("local banks: ", localBanks);

        bankCoordinates.forEach(coord => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(coord.slice(0, 2))), // Convert to map's coordinate system
            });
            feature.setProperties({ description: coord[2] });
            feature.setProperties({ address: coord[3] });
            feature.setProperties({ services: coord[4] });
            feature.setProperties({ hours: coord[5] });
            feature.setProperties({ phone: coord[6] });
            
            map.getLayers().forEach(layer => {
                if (layer.getProperties().name === 'Food Banks') {
                    layer.getSource().addFeature(feature);
                }
            });
        });


        // Add grocery stores layer
        const groceryCoordinates = [
            [-110.952157, 32.232748, "Arizona Market", "1303 E University Blvd, Tucson, AZ 85719", "","Mon-Fri 7:30AM-10:00PM, Sat-Sun 9:00AM-9:00PM", "+1(520)621-5340"],
            [-110.961967, 32.228032, "Food Conspiracy Co-op", "412 N 4th Ave, Tucson, AZ 85705", "","Sun-Sat 7:00AM-9:00PM", "+1(520)624-4821"],
            [-110.959392, 32.225491, "New Empire Food Market", "526 E 9th St, Tucson, AZ 85705", "","Mon-Sat 9:00AM-8:00PM, Sun 9:00AM-3:00PM", "+1(520)622-8772"],
            [-110.958276, 32.252715, "Fry's Food And Drug", "555 E Grant Rd, Tucson, AZ 85705", "","Sun-Sat 6:00AM-10:00PM", "+1(520)622-1976"],
            [-110.942956, 32.220160, "Safeway", "1940 E Broadway Blvd, Tucson, AZ 85719", "","Sun-Sat 6:00AM-12:00AM", "+1(520)206-9047"],
            [-110.918450, 32.236889, "Whole Foods Market", "3360 E Speedway Blvd, Tucson, AZ 85716", "","Sun-Sat 7:00AM-9:00PM", "+1(520)795-9844"],
            [-110.913730, 32.225127, "Walmart Supercenter", "3435 E Broadway Blvd, Tucson, AZ 85716", "","Sun-Sat 6:00AM-10:00PM", "+1(520)917-1655"],
            [-110.974508, 32.224825, "Johnny Gibson's Downtown Market", "11 S 6th Ave, Tucson, AZ 85701", "","Sun-Thurs 8:00AM-10:00PM, Fri-Sat 8:00AM-11:00PM", "+1(520)393-8544"],
            [-110.921009, 32.208778, "Food City", "3030 E 22nd St, Tucson, AZ 85713", "","Sun-Sat 6:00AM-10:00AM", "+1(520)323-2591"],
            [-110.935275, 32.260614, "Albertsons", "2854 N Campbell Ave, Tucson, AZ 85719", "","Sun-Sat 6:00AM-10:00AM", "+1(520)321-1212"],
        ];

        groceryCoordinates.forEach(coord => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(coord.slice(0, 2))), // Convert to map's coordinate system
            });
            feature.setProperties({ description: coord[2] });
            feature.setProperties({ address: coord[3] });
            feature.setProperties({ services: coord[4] });
            feature.setProperties({ hours: coord[5] });
            feature.setProperties({ phone: coord[6] });

            map.getLayers().forEach(layer => {
                if (layer.getProperties().name === 'Grocery Stores') {
                    layer.getSource().addFeature(feature);
                }
            });
        });

    }, [map]); // Run when either map or coordinates change


    // Checkboxes
    useEffect(() => {
        if (!map) return;

        // Create the dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '25px';
        dropdownMenu.style.right = '10px';
        dropdownMenu.style.backgroundColor = 'white';
        dropdownMenu.style.border = '1px solid black';
        dropdownMenu.style.borderRadius = '5px';
        dropdownMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        dropdownMenu.style.padding = '10px';
        dropdownMenu.style.zIndex = '1000';
        dropdownMenu.style.maxwidth = '400px';
        dropdownMenu.style.flexDirection = 'row'; // Change to horizontal layout
        dropdownMenu.style.whiteSpace = 'nowrap'; // Prevent wrapping
        dropdownMenu.style.alignItems = 'center';


        // Define an array of layer names and their corresponding checkbox labels
        const layersConfig = [
            { name: 'Subscribed Banks', label: 'Subscribed Banks' },
            { name: 'Meal Providers', label: 'Meal Providers' },
            { name: 'Food Banks', label: 'Food Banks' },
            { name: 'Grocery Stores', label: 'Grocery Stores' },
        ];

        // Create checkboxes for each layer and add them to the dropdown
        layersConfig.forEach(layerConfig => {
            const checkboxLabel = document.createElement('label');
            const checkbox = document.createElement('input');
            checkboxLabel.style.display = 'flex'; // Set label to flex to align items horizontally
            checkboxLabel.style.alignItems = 'center'; // Center items vertically
            checkbox.type = 'checkbox';
            checkbox.id = layerConfig.name; // Unique ID for each checkbox
            checkbox.checked = true; // Set initial state as needed
            //checkbox.style="word-wrap:break-word";
            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(document.createTextNode(layerConfig.label));
            
            dropdownMenu.appendChild(checkboxLabel);
            dropdownMenu.appendChild(checkbox);

            // Add event listener for each checkbox
            checkbox.addEventListener('change', function() {
                const isChecked = checkbox.checked;
                map.getLayers().forEach(layer => {
                    if (layer.getProperties().name === layerConfig.name) {
                        layer.setVisible(isChecked);
                    }
                });
            });
        });

        // Add styling for dropdown menu (optional)
        dropdownMenu.style.display = 'flex';
        dropdownMenu.style.flexDirection = 'column'; // Stack items vertically

        // Add the dropdown menu to the map control
        map.addControl(new Control({ element: dropdownMenu }));

        // Create a button to toggle dropdown visibility
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '&#9776;'; // Unicode for hamburger icon
        toggleButton.style.marginBottom = '5px'; // Space between button and checkbox
        toggleButton.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        });
        dropdownMenu.prepend(toggleButton); // Add the button to the top of the dropdown

        const SubsBox = document.createElement('div'); 
        SubsBox.className = 'ol-control ol-unselectable layer-control';
        SubsBox.innerHTML = '<input type="checkbox" id="subs" checked> Subscribed Banks';

        // Append the toggle button and dropdown menu to a container
        const controlContainer = document.createElement('div');
        controlContainer.style.position = 'absolute';
        controlContainer.style.top = '10px'; // Adjust as needed
        controlContainer.style.right = '10px'; // Adjust as needed
        controlContainer.style.zIndex = '1000';
        controlContainer.appendChild(toggleButton);
        controlContainer.appendChild(dropdownMenu);
        map.addControl(new Control({ element: controlContainer }));

    }, [map]);

    return (
        <div>
        <div 
          style={{ height: '500px', width: '100%' }} 
          id="map" 
          src="../libs/dist/ol-ext.min.js"
        />
        <div id="popup" className="popup" style={{
          position: 'absolute',
        //   top: '10px',
        //   left: '5px',
          background: 'white',
          border: '1px solid black',
          padding: '10px',
          display: 'none', // Start hidden
          zIndex: 1000
        }} />
        
        
      </div>
    );
}

export default MapForHome;