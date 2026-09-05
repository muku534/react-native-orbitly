export const GLOBE_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #05051a;
            background-image: url('https://www.transparenttextures.com/patterns/asfalt-light.png');
            background-repeat: repeat;
            background-size: 300px 300px;
            background-position: 0% 0%;
            transition: margin 0.3s, background-position 0.1s ease-out;
        }
        #globeViz {
            width: 100vw;
            height: 100vh;
        }
        #loader {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-family: sans-serif;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 10;
        }
    </style>
</head>
<body>
    <div id="loader">Loading globe...</div>
    <div id="globeViz"></div>

    <!-- Required Scripts -->
    <script src="https://unpkg.com/three"></script>
    <script src="https://unpkg.com/topojson-client@3"></script>
    <script src="https://unpkg.com/globe.gl"></script>
    <script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>

    <script>
        const loader = document.getElementById('loader');
        
        let countryFeatures = [];
        let stateFeatures = [];
        let cityFeatures = [];
        let activeCountryId = null;
        let activeStateId = null;
        let activeCityId = null;
        let polygonsReady = false;
        
        const highlightedIds = new Set();
        let isUserInteracting = false;

        const ISO_NUMERIC_TO_ALPHA2 = {
            "004": "af", "008": "al", "012": "dz", "020": "ad", "024": "ao", "028": "ag",
            "032": "ar", "036": "au", "040": "at", "044": "bs", "048": "bh", "050": "bd",
            "051": "am", "052": "bb", "056": "be", "064": "bt", "068": "bo", "070": "ba",
            "072": "bw", "076": "br", "084": "bz", "090": "sb", "096": "bn", "100": "bg",
            "104": "mm", "108": "bi", "112": "by", "116": "kh", "120": "cm", "124": "ca",
            "132": "cv", "140": "cf", "144": "lk", "148": "td", "152": "cl", "156": "cn",
            "170": "co", "174": "km", "178": "cg", "180": "cd", "188": "cr", "191": "hr",
            "192": "cu", "204": "bj", "208": "dk", "214": "do", "218": "ec", "222": "sv",
            "226": "gq", "231": "et", "232": "er", "233": "ee", "242": "fj", "246": "fi",
            "250": "fr", "262": "dj", "266": "ga", "268": "ge", "270": "gm", "275": "ps",
            "276": "de", "288": "gh", "300": "gr", "308": "gd", "320": "gt", "324": "gn",
            "328": "gy", "332": "ht", "340": "hn", "348": "hu", "352": "is", "356": "in",
            "360": "id", "364": "ir", "368": "iq", "372": "ie", "376": "il", "380": "it",
            "384": "ci", "388": "jm", "392": "jp", "398": "kz", "400": "jo", "404": "ke",
            "408": "kp", "410": "kr", "414": "kw", "417": "kg", "422": "lb", "426": "ls",
            "428": "lv", "430": "lr", "434": "ly", "438": "li", "440": "lt", "442": "lu",
            "450": "mg", "454": "mw", "458": "my", "462": "mv", "466": "ml", "470": "mt",
            "478": "mr", "480": "mu", "484": "mx", "496": "mn", "498": "md", "499": "me",
            "504": "ma", "508": "moz", "512": "om", "516": "na", "520": "nr", "524": "np",
            "528": "nl", "548": "vu", "554": "nz", "558": "ni", "562": "ne", "566": "ng",
            "578": "no", "586": "pk", "591": "pa", "598": "pg", "600": "py", "604": "pe",
            "608": "ph", "616": "pl", "620": "pt", "624": "gw", "626": "tl", "634": "qa",
            "642": "ro", "643": "ru", "646": "rw", "659": "kn", "662": "lc", "670": "vc",
            "674": "sm", "678": "st", "682": "sa", "686": "sn", "688": "rs", "690": "sc",
            "694": "sl", "702": "sg", "703": "sk", "704": "vn", "705": "si", "706": "so",
            "710": "za", "716": "zw", "724": "es", "728": "ss", "729": "sd", "740": "sr",
            "748": "sz", "752": "se", "756": "ch", "760": "sy", "762": "tj", "764": "th",
            "768": "tg", "776": "to", "780": "tt", "784": "ae", "788": "tn", "792": "tr",
            "795": "tm", "800": "ug", "804": "ua", "807": "mk", "818": "eg", "826": "gb",
            "834": "tz", "840": "us", "854": "bf", "858": "uy", "860": "uz", "862": "ve",
            "882": "ws", "887": "ye", "894": "zm"
        };
        const ISO_NUMERIC_TO_ALPHA3 = {
            "004": "AFG", "008": "ALB", "012": "DZA", "020": "AND", "024": "AGO", "028": "ATG",
            "032": "ARG", "036": "AUS", "040": "AUT", "044": "BHS", "048": "BHR", "050": "BGD",
            "051": "ARM", "052": "BRB", "056": "BEL", "064": "BTN", "068": "BOL", "070": "BIH",
            "072": "BWA", "076": "BRA", "084": "BLZ", "090": "SLB", "096": "BRN", "100": "BGR",
            "104": "MMR", "108": "BDI", "112": "BLR", "116": "KHM", "120": "CMR", "124": "CAN",
            "132": "CPV", "140": "CAF", "144": "LKA", "148": "TCD", "152": "CHL", "156": "CHN",
            "170": "COL", "174": "COM", "178": "COG", "180": "COD", "188": "CRI", "191": "HRV",
            "192": "CUB", "204": "BEN", "208": "DNK", "214": "DOM", "218": "ECU", "222": "SLV",
            "226": "GNQ", "231": "ETH", "232": "ERI", "233": "EST", "242": "FJI", "246": "FIN",
            "250": "FRA", "262": "DJI", "266": "GAB", "268": "GEO", "270": "GMB", "275": "PSE",
            "276": "DEU", "288": "GHA", "300": "GRC", "308": "GRD", "320": "GTM", "324": "GIN",
            "328": "GUY", "332": "HTI", "340": "HND", "348": "HUN", "352": "ISL", "356": "IND",
            "360": "IDN", "364": "IRN", "368": "IRQ", "372": "IRL", "376": "ISR", "380": "ITA",
            "384": "CIV", "388": "JAM", "392": "JPN", "398": "KAZ", "400": "JOR", "404": "KEN",
            "408": "PRK", "410": "KOR", "414": "KWT", "417": "KGZ", "422": "LBN", "426": "LSO",
            "428": "LVA", "430": "LBR", "434": "LBY", "438": "LIE", "440": "LTU", "442": "LUX",
            "450": "MDG", "454": "MWI", "458": "MYS", "462": "MDV", "466": "MLI", "470": "MLT",
            "478": "MRT", "480": "MUS", "484": "MEX", "496": "MNG", "498": "MDA", "499": "MNE",
            "504": "MAR", "508": "MOZ", "512": "OMN", "516": "NAM", "520": "NRU", "524": "NPL",
            "528": "NLD", "548": "VUT", "554": "NZL", "558": "NIC", "562": "NER", "566": "NGA",
            "578": "NOR", "586": "PAK", "591": "PAN", "598": "PNG", "600": "PRY", "604": "PER",
            "608": "PHL", "616": "POL", "620": "PRT", "624": "GNB", "626": "TLS", "634": "QAT",
            "642": "ROU", "643": "RUS", "646": "RWA", "659": "KNA", "662": "LCA", "670": "VCT",
            "674": "SMR", "678": "STP", "682": "SAU", "686": "SEN", "688": "SRB", "690": "SYC",
            "694": "SLE", "702": "SGP", "703": "SVK", "704": "VNM", "705": "SVN", "706": "SOM",
            "710": "ZAF", "716": "ZWE", "724": "ESP", "728": "SSD", "729": "SDN", "740": "SUR",
            "748": "SWZ", "752": "SWE", "756": "CHE", "760": "SYR", "762": "TJK", "764": "THA",
            "768": "TGO", "776": "TON", "780": "TTO", "784": "ARE", "788": "TUN", "792": "TUR",
            "795": "TKM", "800": "UGA", "804": "UKR", "807": "MKD", "818": "EGY", "826": "GBR",
            "834": "TZA", "840": "USA", "854": "BFA", "858": "URY", "860": "UZB", "862": "VEN",
            "882": "WSM", "887": "YEM", "894": "ZMB"
        };
        
        const globe = Globe()
            (document.getElementById('globeViz'))
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-day.jpg')
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundColor('rgba(0,0,0,0)')
            .showAtmosphere(true)
            .atmosphereColor('#6ec6ff')
            .atmosphereAltitude(0.25)
            .polygonSideColor(() => 'rgba(0,100,0,0.15)')
            .polygonStrokeColor(() => '#111')
            .polygonAltitude(d => {
                if (d.isState) return activeStateId === d.id ? 0.04 : 0.03;
                return (activeCountryId === d.id && stateFeatures.length > 0) ? 0.01 : (highlightedIds.has(d.id) ? 0.02 : 0.01);
            })
            .polygonCapColor(d => {
                if (d.isState) return activeStateId === d.id ? 'orange' : 'yellow';
                if (activeCountryId === d.id && stateFeatures.length > 0) return 'rgba(144, 238, 144, 0.2)';
                return highlightedIds.has(d.id) ? 'red' : 'lightgreen';
            })
            .polygonLabel(d => \`
                <div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-family: sans-serif;">
                    \${d.properties.name}
                </div>
            \`)
            .onPolygonHover(hoverD => {
                globe.polygonAltitude(d => {
                    if (d.isState) return activeStateId === d.id ? 0.04 : (d === hoverD ? 0.035 : 0.03);
                    return (activeCountryId === d.id && stateFeatures.length > 0) ? 0.01 : (d === hoverD ? 0.02 : 0.01);
                });
            });

        // Add auto-rotation
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;

        // Fetch Global Country Boundaries
        fetch('https://unpkg.com/world-atlas/countries-110m.json')
            .then(res => res.json())
            .then(topoData => {
                countryFeatures = topojson.feature(topoData, topoData.objects.countries).features.map(f => ({
                    ...f,
                    isState: false,
                    properties: f.properties || { name: f.id }
                }));
                globe.polygonsData(countryFeatures);
                loader.style.display = 'none';

                // Handle Label Clicks (Cities)
                globe.onLabelClick(label => {
                    activeCityId = label.name;
                    
                    // Zoom closer to city
                    globe.pointOfView({ lat: label.lat, lng: label.lng, altitude: 0.15 }, 800);

                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'district-clicked',
                            district: label.name,
                            id: label.name
                        }));
                    }
                });

                globe.onPolygonClick(polygon => {
                    if (polygon.isState) {
                        activeStateId = polygon.id;
                        activeCityId = null;
                        
                        // Mock Cities Dictionary
                        const MOCK_CITIES = {
                            "Maharashtra": [ { name: "Mumbai", lat: 19.0760, lng: 72.8777 }, { name: "Pune", lat: 18.5204, lng: 73.8567 }, { name: "Nagpur", lat: 21.1458, lng: 79.0882 } ],
                            "NCT of Delhi": [ { name: "New Delhi", lat: 28.6139, lng: 77.2090 }, { name: "Okhla", lat: 28.512, lng: 77.258 }, { name: "Dwarka", lat: 28.5823, lng: 77.0500 } ],
                            "Delhi": [ { name: "New Delhi", lat: 28.6139, lng: 77.2090 }, { name: "Okhla", lat: 28.512, lng: 77.258 }, { name: "Dwarka", lat: 28.5823, lng: 77.0500 } ],
                            "Karnataka": [ { name: "Bengaluru", lat: 12.9716, lng: 77.5946 }, { name: "Mysuru", lat: 12.2958, lng: 76.6394 }, { name: "Mangaluru", lat: 12.9141, lng: 74.8560 } ]
                        };
                        const stateName = polygon.properties.name || polygon.properties.NAME_1;
                        const cities = MOCK_CITIES[stateName] || [];
                        
                        // Configure Globe Labels for Cities
                        globe.labelsData(cities)
                             .labelLat(d => d.lat)
                             .labelLng(d => d.lng)
                             .labelText(d => d.name)
                             .labelSize(0.6)
                             .labelDotRadius(0.2)
                             .labelColor(() => 'rgba(255, 255, 255, 0.95)')
                             .labelAltitude(0.045)
                             .labelResolution(3);

                        globe.polygonsData([...countryFeatures, ...stateFeatures]); // refresh colors
                        
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'state-clicked',
                                state: polygon.properties.name,
                                id: polygon.id
                            }));
                        }
                        return;
                    }

                    // It's a country
                    globe.controls().autoRotate = false; // Pause rotation on click
                    const currentView = globe.pointOfView();
                    globe.pointOfView({ ...currentView, altitude: Math.max(0.4, currentView.altitude - 1.2) }, 800);
                    
                    if (activeCountryId !== polygon.id) {
                        activeCountryId = polygon.id;
                        stateFeatures = []; // clear previous states
                        globe.polygonsData([...countryFeatures]); // reset
                        activeStateId = null;

                        const iso3 = ISO_NUMERIC_TO_ALPHA3[polygon.id];
                        const iso2 = ISO_NUMERIC_TO_ALPHA2[polygon.id];
                        if (iso3 && iso2) {
                            let fetchUrl = \`https://code.highcharts.com/mapdata/countries/\${iso2}/\${iso2}-all.topo.json\`;
                            
                            if (iso3 === 'IND') {
                                fetchUrl = \`https://raw.githubusercontent.com/AbhinavSwami28/india-official-geojson/main/india-states.topojson\`;
                            }
                            
                            fetch(fetchUrl)
                                .then(res => res.json())
                                .then(topoData => {
                                    const objectKey = Object.keys(topoData.objects)[0];
                                    if (objectKey) {
                                        const geo = topojson.feature(topoData, topoData.objects[objectKey]);
                                        const rewoundGeo = turf.rewind(geo, { reverse: true });
                                        
                                        stateFeatures = rewoundGeo.features.map(f => {
                                            const props = f.properties || {};
                                            const stateName = props.NAME_1 || props.name || props.shapeName || f.id || 'Unknown';
                                            return { 
                                                ...f, 
                                                isState: true, 
                                                properties: { ...props, name: stateName } 
                                            };
                                        });
                                        globe.polygonsData([...countryFeatures, ...stateFeatures]);
                                    }
                                }).catch(err => console.log("TopoJSON fetch failed for", iso3));
                        }
                    }

                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'country-clicked',
                            country: polygon.properties.name,
                            id: polygon.id
                        }));
                    }
                });
                polygonsReady = true;
                if (window._pendingMarkers) {
                    window.addMarkers(window._pendingMarkers);
                    window._pendingMarkers = null;
                }
            });

        window.addMarkers = markers => {
            if (!polygonsReady) {
                window._pendingMarkers = markers;
                return;
            }
            highlightedIds.clear();
            markers.forEach(m => {
                const country = countryFeatures.find(f => pointInFeature([m.lng, m.lat], f));
                if (country) highlightedIds.add(country.id);
            });
            globe.polygonsData(countryFeatures);
        };

        function pointInFeature(point, feature) {
            if (!feature || !feature.geometry) return false;
            const type = feature.geometry.type;
            const coordinates = feature.geometry.coordinates;
            if (type === 'Polygon') return pointInPolygon(point, coordinates);
            if (type === 'MultiPolygon') return coordinates.some(poly => pointInPolygon(point, poly));
            return false;
        }

        function pointInPolygon(point, polygon) {
            const vs = polygon[0]; 
            let inside = false;
            for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                const xi = vs[i][0], yi = vs[i][1];
                const xj = vs[j][0], yj = vs[j][1];
                const intersect = ((yi > point[1]) !== (yj > point[1]))
                    && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

        window.zoomIn = () => {
            const currentView = globe.pointOfView();
            globe.pointOfView({ ...currentView, altitude: Math.max(0.1, currentView.altitude - 0.5) }, 500);
        };

        window.zoomOut = () => {
            const currentView = globe.pointOfView();
            globe.pointOfView({ ...currentView, altitude: Math.min(4.0, currentView.altitude + 0.5) }, 500);
        };

        // Track user interactions
        document.getElementById('globeViz').addEventListener('mousedown', () => { isUserInteracting = true; });
        document.getElementById('globeViz').addEventListener('mouseup', () => { isUserInteracting = false; });
        document.getElementById('globeViz').addEventListener('touchstart', () => { isUserInteracting = true; });
        document.getElementById('globeViz').addEventListener('touchend', () => { isUserInteracting = false; });

        window.setGlobeMargin = function (margin) {
            document.body.style.margin = margin;
        };

        document.addEventListener('message', function (event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'setMargin') window.setGlobeMargin(data.margin);
            } catch (e) { }
        });
        window.addEventListener('message', function (event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'setMargin') window.setGlobeMargin(data.margin);
            } catch (e) { }
        });
    </script>
</body>
</html>
`;
