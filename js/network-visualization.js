/**
 * Network Visualization Module
 * Handles Chilean cities network visualization with dual view modes:
 * - Geographic map view using Leaflet.js
 * - Force-directed graph view using D3.js
 */

// Network Visualization Variables
let currentVizView = 'map';
let vizMap, vizInfo, vizSvg, vizG;
let vizSimulation, vizNodes, vizLinks;
let vizMovingCircles = [], vizDataPackets = [];
let vizAnimationRunning = false;
let vizPathSegmentLookup = {};
let vizZoomBehavior, vizGraphContainer;
let vizGraphWidth, vizGraphHeight;

// Chilean cities data
const cities = [
    { name: "Santiago", location: [-33.4489, -70.6693], population: "7.1 million", id: "santiago" },
    { name: "Valparaíso", location: [-33.0472, -71.6127], population: "980,000", id: "valparaiso" },
    { name: "Concepción", location: [-36.8201, -73.0397], population: "830,000", id: "concepcion" },
    { name: "Antofagasta", location: [-23.6509, -70.3975], population: "362,000", id: "antofagasta" },
    { name: "La Serena", location: [-29.9027, -71.2525], population: "210,000", id: "laserena" },
    { name: "Temuco", location: [-38.7359, -72.5904], population: "280,000", id: "temuco" },
    { name: "Puerto Montt", location: [-41.4717, -72.9429], population: "245,000", id: "puertomontt" },
    { name: "Arica", location: [-18.4783, -70.3212], population: "222,000", id: "arica" },
    { name: "Iquique", location: [-20.2307, -70.1356], population: "191,000", id: "iquique" },
    { name: "Punta Arenas", location: [-53.1638, -70.9171], population: "127,000", id: "puntaarenas" },
    { name: "Rancagua", location: [-34.1709, -70.7408], population: "273,000", id: "rancagua" },
    { name: "Talca", location: [-35.4264, -71.6553], population: "230,000", id: "talca" },
    { name: "Chillán", location: [-36.6062, -72.1039], population: "215,000", id: "chillan" },
    { name: "Osorno", location: [-40.5740, -73.1342], population: "172,000", id: "osorno" },
    { name: "Calama", location: [-22.4657, -68.9239], population: "165,000", id: "calama" },
    { name: "Copiapó", location: [-27.3668, -70.3321], population: "158,000", id: "copiapo" },
    { name: "Valdivia", location: [-39.8142, -73.2459], population: "154,000", id: "valdivia" },
    { name: "Curicó", location: [-34.9829, -71.2367], population: "150,000", id: "curico" },
    { name: "Quillota", location: [-32.8811, -71.2499], population: "90,000", id: "quillota" },
    { name: "Coyhaique", location: [-45.5717, -72.0652], population: "57,000", id: "coyhaique" },
    { name: "San Fernando", location: [-34.5857, -70.9886], population: "73,000", id: "sanfernando" },
    { name: "Los Ángeles", location: [-37.4696, -72.3521], population: "202,000", id: "losangeles" },
    { name: "Ovalle", location: [-30.6011, -71.2000], population: "112,000", id: "ovalle" },
    { name: "Castro", location: [-42.4808, -73.7623], population: "43,000", id: "castro" },
    { name: "Constitución", location: [-35.3350, -72.4150], population: "46,000", id: "constitucion" },
    { name: "San Antonio", location: [-33.5928, -71.6064], population: "91,350", id: "sanantonio" }
];

// Network connections
const connections = [
    { from: "Arica", to: "Iquique" },
    { from: "Iquique", to: "Antofagasta" },
    { from: "Antofagasta", to: "Calama" },
    { from: "Antofagasta", to: "Copiapó" },
    { from: "Copiapó", to: "La Serena" },
    { from: "La Serena", to: "Ovalle" },
    { from: "La Serena", to: "Santiago" },
    { from: "Ovalle", to: "Santiago" },
    { from: "Santiago", to: "Valparaíso" },
    { from: "Santiago", to: "Rancagua" },
    { from: "Santiago", to: "San Fernando" },
    { from: "Santiago", to: "San Antonio" },
    { from: "Valparaíso", to: "San Antonio" },
    { from: "Valparaíso", to: "Quillota" },
    { from: "Rancagua", to: "San Fernando" },
    { from: "Rancagua", to: "Talca" },
    { from: "San Fernando", to: "Curicó" },
    { from: "Curicó", to: "Talca" },
    { from: "Talca", to: "Constitución" },
    { from: "Talca", to: "Chillán" },
    { from: "Chillán", to: "Concepción" },
    { from: "Concepción", to: "Los Ángeles" },
    { from: "Los Ángeles", to: "Temuco" },
    { from: "Temuco", to: "Valdivia" },
    { from: "Valdivia", to: "Osorno" },
    { from: "Osorno", to: "Puerto Montt" },
    { from: "Puerto Montt", to: "Castro" },
    { from: "Puerto Montt", to: "Coyhaique" },
    { from: "Coyhaique", to: "Punta Arenas" }
];

const sourceCities = ["Santiago", "Concepción", "Valparaíso", "San Antonio"];

// Animation routes
const multiNodeRoutes = [
    { name: "Santiago-North", path: ["Santiago", "La Serena", "Copiapó", "Antofagasta", "Iquique", "Arica"] },
    { name: "Santiago-South", path: ["Santiago", "Rancagua", "Talca", "Chillán", "Concepción", "Los Ángeles", "Temuco", "Valdivia", "Puerto Montt"] },
    { name: "Santiago-Coast", path: ["Santiago", "San Antonio", "Valparaíso", "Quillota"] },
    { name: "Concepción-North", path: ["Concepción", "Chillán", "Talca", "Curicó", "San Fernando", "Rancagua", "Santiago"] },
    { name: "Concepción-South", path: ["Concepción", "Los Ángeles", "Temuco", "Valdivia", "Osorno", "Puerto Montt", "Castro"] },
    { name: "Valparaíso-North", path: ["Valparaíso", "Santiago", "La Serena", "Copiapó"] },
    { name: "Valparaíso-South", path: ["Valparaíso", "Santiago", "Rancagua", "San Fernando", "Curicó", "Talca"] },
    { name: "SanAntonio-North", path: ["San Antonio", "Valparaíso", "Quillota"] },
    { name: "SanAntonio-South", path: ["San Antonio", "Santiago", "Rancagua", "San Fernando", "Curicó"] }
];

/**
 * Open Network Visualization Modal
 */
function openNetworkViz() {
    const modal = document.getElementById('vizModal');
    modal.classList.add('active');
    
    // Initialize visualization after a short delay
    setTimeout(() => {
        initVizMap();
        initVizNetworkGraph();
    }, 100);
}

/**
 * Close Network Visualization Modal
 */
function closeNetworkViz() {
    const modal = document.getElementById('vizModal');
    modal.classList.remove('active');
    
    // Clean up visualization
    if (vizMap) {
        vizMap.remove();
        vizMap = null;
    }
    if (vizSimulation) {
        vizSimulation.stop();
    }
}

/**
 * Switch between map and graph views
 * @param {string} view - 'map' or 'graph'
 */
function switchVizView(view) {
    if (view === currentVizView) return;
    
    const mapEl = document.getElementById('vizMap');
    const graphEl = document.getElementById('vizNetworkGraph');
    const mapBtn = document.getElementById('mapBtn');
    const graphBtn = document.getElementById('graphBtn');
    
    if (view === 'map') {
        mapEl.classList.remove('hidden');
        graphEl.classList.remove('active');
        mapBtn.classList.add('active');
        graphBtn.classList.remove('active');
        currentVizView = 'map';
    } else {
        mapEl.classList.add('hidden');
        graphEl.classList.add('active');
        mapBtn.classList.remove('active');
        graphBtn.classList.add('active');
        currentVizView = 'graph';
    }
}

/**
 * Initialize map visualization using Leaflet.js
 */
function initVizMap() {
    if (vizMap) return; // Already initialized
    
    vizMap = L.map('vizMap').setView([-35.6751, -71.5430], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(vizMap);
    
    // Add info panel
    vizInfo = L.control({ position: 'topleft' });
    vizInfo.onAdd = function() {
        this._div = L.DomUtil.create('div', 'info-panel');
        this.update();
        return this._div;
    };
    
    vizInfo.update = function(props) {
        this._div.innerHTML = '<h4>Chile Cities Network</h4>' + 
            (props ? 
                '<p><strong>' + props.name + '</strong><br>' + props.population + ' inhabitants</p>' : 
                '<p>Hover over a city for details</p>');
    };
    vizInfo.addTo(vizMap);
    
    // Create city markers
    const cityMarkers = {};
    cities.forEach(city => {
        const size = Math.sqrt(parseInt(city.population.replace(/[^0-9]/g, ''))) / 50;
        const markerSize = Math.max(20, Math.min(50, size));
        
        const icon = L.divIcon({
            className: 'city-marker',
            html: `<span>${city.name.slice(0, 2)}</span>`,
            iconSize: [markerSize, markerSize]
        });
        
        const marker = L.marker(city.location, { icon: icon }).addTo(vizMap);
        marker.bindPopup(`<strong>${city.name}</strong><br>Population: ${city.population}`);
        
        marker.on('mouseover', function() {
            vizInfo.update(city);
            this.openPopup();
        });
        marker.on('mouseout', function() {
            vizInfo.update();
            this.closePopup();
        });
        
        cityMarkers[city.name] = marker;
    });
    
    // Create SVG overlay for connections
    const vizContainer = document.querySelector('.viz-visualization') || document.getElementById('vizMap').parentElement;
    vizSvg = d3.select(vizMap.getPanes().overlayPane).append("svg")
        .attr("width", vizContainer.clientWidth)
        .attr("height", vizContainer.clientHeight)
        .attr("class", "leaflet-zoom-hide");
    
    vizG = vizSvg.append("g").attr("class", "leaflet-zoom-hide");
    
    updateVizMapNetwork();
    
    // Handle map events
    vizMap.on("zoomend moveend", function() {
        updateVizMapNetwork();
        if (vizMovingCircles.length > 0) {
            updateVizMapMovingElementsPositions();
        }
    });
    
    // Start animations
    setTimeout(() => {
        createVizMapMovingElements();
        animateVizMapTraffic();
    }, 1000);
    
    setInterval(animateVizMapTraffic, 10000);
    setInterval(createVizMapMovingElements, 15000);
}

/**
 * Initialize network graph visualization using D3.js
 */
function initVizNetworkGraph() {
    const container = d3.select("#vizNetworkGraph");
    const vizContainer = document.querySelector('.viz-visualization') || document.getElementById('vizNetworkGraph').parentElement;
    vizGraphWidth = vizContainer.clientWidth;
    vizGraphHeight = vizContainer.clientHeight;
    
    const svgGraph = container.select("#graphSvg")
        .attr("width", vizGraphWidth)
        .attr("height", vizGraphHeight);
    
    svgGraph.selectAll("*").remove();
    
    vizZoomBehavior = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", function(event) {
            vizGraphContainer.attr("transform", event.transform);
        });
    
    svgGraph.call(vizZoomBehavior);
    vizGraphContainer = svgGraph.append("g");
    
    // Prepare data
    vizNodes = cities.map(city => ({
        id: city.id,
        name: city.name,
        population: city.population,
        isSource: sourceCities.includes(city.name),
        ...city
    }));
    
    vizLinks = connections.map(conn => ({
        source: cities.find(c => c.name === conn.from).id,
        target: cities.find(c => c.name === conn.to).id,
        ...conn
    }));
    
    // Create force simulation
    vizSimulation = d3.forceSimulation(vizNodes)
        .force("link", d3.forceLink(vizLinks).id(d => d.id).distance(120).strength(0.8))
        .force("charge", d3.forceManyBody().strength(-1200))
        .force("center", d3.forceCenter(vizGraphWidth / 2, vizGraphHeight / 2))
        .force("collision", d3.forceCollide().radius(35))
        .force("x", d3.forceX(vizGraphWidth / 2).strength(0.1))
        .force("y", d3.forceY(vizGraphHeight / 2).strength(0.1));
    
    // Create links
    const link = vizGraphContainer.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(vizLinks)
        .enter().append("line")
        .attr("class", "graph-link");
    
    // Create nodes
    const node = vizGraphContainer.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(vizNodes)
        .enter().append("circle")
        .attr("class", "graph-node")
        .attr("r", d => d.isSource ? 20 : Math.max(8, Math.sqrt(parseInt(d.population.replace(/[^0-9]/g, ''))) / 200))
        .style("fill", d => d.isSource ? "#ff9500" : "#64ffda")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // Add labels
    const label = vizGraphContainer.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(vizNodes)
        .enter().append("text")
        .attr("class", "graph-label")
        .text(d => d.name)
        .attr("dy", -25);
    
    // Add tooltips
    node.append("title")
        .text(d => `${d.name}\nPopulation: ${d.population}`);
    
    // Update positions
    vizSimulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        
        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
    
    setTimeout(() => {
        createVizGraphMovingElements();
        fitVizNetworkToScreen();
    }, 3000);
    
    setInterval(createVizGraphMovingElements, 15000);
}

/**
 * Update map network connections
 */
function updateVizMapNetwork() {
    vizG.selectAll("path").remove();
    
    connections.forEach(conn => {
        const fromCity = cities.find(c => c.name === conn.from);
        const toCity = cities.find(c => c.name === conn.to);
        
        if (fromCity && toCity) {
            const fromPoint = vizMap.latLngToLayerPoint(fromCity.location);
            const toPoint = vizMap.latLngToLayerPoint(toCity.location);
            
            vizG.append("path")
                .attr("class", "network-line")
                .attr("d", `M${fromPoint.x},${fromPoint.y} L${toPoint.x},${toPoint.y}`)
                .attr("id", `viz-path-${conn.from}-${conn.to}`);
        }
    });
    
    updateVizPathSegmentLookup();
}

/**
 * Update path segment lookup table
 */
function updateVizPathSegmentLookup() {
    Object.keys(vizPathSegmentLookup).forEach(key => delete vizPathSegmentLookup[key]);
    
    connections.forEach(conn => {
        const pathId = `viz-path-${conn.from}-${conn.to}`;
        vizPathSegmentLookup[pathId] = document.getElementById(pathId);
        
        const reversePathId = `viz-path-${conn.to}-${conn.from}`;
        vizPathSegmentLookup[reversePathId] = document.getElementById(pathId);
    });
}

/**
 * Create moving elements on map
 */
function createVizMapMovingElements() {
    if (currentVizView !== 'map') return;
    
    vizG.selectAll(".moving-circle").remove();
    vizG.selectAll(".data-packet").remove();
    vizMovingCircles.length = 0;
    vizDataPackets.length = 0;
    
    sourceCities.forEach(sourceCity => {
        const cityRoutes = multiNodeRoutes.filter(route => route.path[0] === sourceCity);
        
        cityRoutes.forEach(route => {
            const segments = buildVizMultiSegmentPath(route.path);
            
            if (segments.length > 0) {
                const numCircles = Math.floor(Math.random() * 3) + 1;
                
                for (let i = 0; i < numCircles; i++) {
                    const circle = vizG.append("circle")
                        .attr("class", "moving-circle")
                        .attr("r", 8);
                        
                    vizMovingCircles.push({
                        element: circle,
                        segments: segments,
                        currentSegmentIndex: 0,
                        speed: Math.random() * 0.005 + 0.01,
                        position: Math.random() * 0.2,
                        isComplete: false
                    });
                }
                
                const numPackets = Math.floor(Math.random() * 5) + 3;
                for (let i = 0; i < numPackets; i++) {
                    const packet = vizG.append("circle")
                        .attr("class", "data-packet")
                        .attr("r", 4);
                        
                    vizDataPackets.push({
                        element: packet,
                        segments: segments,
                        currentSegmentIndex: 0,
                        speed: Math.random() * 0.02 + 0.01,
                        position: Math.random() * 0.2,
                        isComplete: false
                    });
                }
            }
        });
    });
    
    if (!vizAnimationRunning) {
        vizAnimationRunning = true;
        updateVizMovingElements();
    }
}

/**
 * Update moving elements animation
 */
function updateVizMovingElements() {
    if (currentVizView !== 'map') {
        requestAnimationFrame(updateVizMovingElements);
        return;
    }
    
    [...vizMovingCircles, ...vizDataPackets].forEach(element => {
        if (!element.isComplete && element.segments.length > 0) {
            const currentSegment = element.segments[element.currentSegmentIndex];
            const segmentId = currentSegment.pathId;
            const path = vizPathSegmentLookup[segmentId];
            
            if (path) {
                element.position += element.speed;
                
                if (element.position >= 1) {
                    element.currentSegmentIndex++;
                    element.position = 0;
                    
                    if (element.currentSegmentIndex >= element.segments.length) {
                        element.isComplete = true;
                        element.element.attr("r", 0);
                    }
                }
                
                if (!element.isComplete) {
                    const pathLength = path.getTotalLength();
                    let point;
                    
                    if (currentSegment.isForward) {
                        point = path.getPointAtLength(pathLength * element.position);
                    } else {
                        point = path.getPointAtLength(pathLength * (1 - element.position));
                    }
                    
                    element.element.attr("cx", point.x).attr("cy", point.y);
                }
            }
        }
    });
    
    requestAnimationFrame(updateVizMovingElements);
}

/**
 * Update moving elements positions on map pan/zoom
 */
function updateVizMapMovingElementsPositions() {
    [...vizMovingCircles, ...vizDataPackets].forEach(element => {
        if (!element.isComplete && element.segments.length > 0) {
            const currentSegment = element.segments[element.currentSegmentIndex];
            const segmentId = currentSegment.pathId;
            const path = vizPathSegmentLookup[segmentId];
            
            if (path) {
                const pathLength = path.getTotalLength();
                let point;
                
                if (currentSegment.isForward) {
                    point = path.getPointAtLength(pathLength * element.position);
                } else {
                    point = path.getPointAtLength(pathLength * (1 - element.position));
                }
                
                element.element.attr("cx", point.x).attr("cy", point.y);
            }
        }
    });
}

/**
 * Animate traffic lines on map
 */
function animateVizMapTraffic() {
    const lines = document.querySelectorAll('.network-line');
    lines.forEach(line => {
        const dashLength = Math.random() * 50 + 10;
        line.style.strokeDasharray = `${dashLength}, ${dashLength/2}`;
        line.style.animationDuration = `${Math.random() * 30 + 20}s`;
        line.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
    });
}

/**
 * Build multi-segment path for animation
 * @param {Array} pathCities - Array of city names forming the path
 * @returns {Array} Array of segment objects
 */
function buildVizMultiSegmentPath(pathCities) {
    const segments = [];
    
    for (let i = 0; i < pathCities.length - 1; i++) {
        const fromCity = pathCities[i];
        const toCity = pathCities[i + 1];
        
        const segment = connections.find(conn => 
            (conn.from === fromCity && conn.to === toCity) || 
            (conn.from === toCity && conn.to === fromCity)
        );
        
        if (segment) {
            const isForward = segment.from === fromCity;
            segments.push({
                from: segment.from,
                to: segment.to,
                isForward: isForward,
                pathId: `viz-path-${segment.from}-${segment.to}`
            });
        }
    }
    
    return segments;
}

/**
 * Create moving elements for graph visualization
 */
function createVizGraphMovingElements() {
    if (currentVizView !== 'graph' || !vizGraphContainer) return;
    
    vizGraphContainer.selectAll(".graph-moving-circle").remove();
    vizGraphContainer.selectAll(".graph-data-packet").remove();
    
    sourceCities.forEach(sourceCity => {
        const cityRoutes = multiNodeRoutes.filter(route => route.path[0] === sourceCity);
        
        cityRoutes.forEach(route => {
            const numCircles = Math.floor(Math.random() * 2) + 1;
            
            for (let i = 0; i < numCircles; i++) {
                const circle = vizGraphContainer.append("circle")
                    .attr("class", "graph-moving-circle moving-circle")
                    .attr("r", 6);
                
                animateVizGraphElement(circle, route.path, 'circle');
            }
            
            const numPackets = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numPackets; i++) {
                const packet = vizGraphContainer.append("circle")
                    .attr("class", "graph-data-packet data-packet")
                    .attr("r", 3);
                
                animateVizGraphElement(packet, route.path, 'packet');
            }
        });
    });
}

/**
 * Animate graph element along path
 * @param {Object} element - D3 selection of element to animate
 * @param {Array} path - Array of city names forming the path
 * @param {string} type - 'circle' or 'packet'
 */
function animateVizGraphElement(element, path, type) {
    let currentIndex = 0;
    const speed = type === 'circle' ? 2000 : 1500;
    
    function moveToNext() {
        if (currentIndex >= path.length - 1) {
            element.remove();
            return;
        }
        
        const currentNode = vizNodes.find(n => n.name === path[currentIndex]);
        const nextNode = vizNodes.find(n => n.name === path[currentIndex + 1]);
        
        if (currentNode && nextNode) {
            element
                .attr("cx", currentNode.x)
                .attr("cy", currentNode.y)
                .transition()
                .duration(speed + Math.random() * 1000)
                .attr("cx", nextNode.x)
                .attr("cy", nextNode.y)
                .on("end", () => {
                    currentIndex++;
                    setTimeout(moveToNext, Math.random() * 500);
                });
        }
    }
    
    setTimeout(moveToNext, Math.random() * 2000);
}

/**
 * Fit network graph to screen
 */
function fitVizNetworkToScreen() {
    if (!vizSimulation || !vizGraphContainer) return;
    
    const bounds = {
        minX: d3.min(vizNodes, d => d.x) - 50,
        maxX: d3.max(vizNodes, d => d.x) + 50,
        minY: d3.min(vizNodes, d => d.y) - 50,
        maxY: d3.max(vizNodes, d => d.y) + 50
    };
    
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    
    const scale = Math.min(
        (vizGraphWidth * 0.8) / width,
        (vizGraphHeight * 0.8) / height,
        2
    );
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const translateX = vizGraphWidth / 2 - centerX * scale;
    const translateY = vizGraphHeight / 2 - centerY * scale;
    
    const transform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);
    
    d3.select("#graphSvg")
        .transition()
        .duration(1000)
        .call(vizZoomBehavior.transform, transform);
}

/**
 * Drag functions for graph nodes
 */
function dragstarted(event, d) {
    if (!event.active) vizSimulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    d3.select("#graphSvg").on('.zoom', null);
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) vizSimulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    d3.select("#graphSvg").call(vizZoomBehavior);
}

/**
 * Handle window resize for visualization
 */
function handleVizResize() {
    if (vizMap && document.getElementById('vizModal').classList.contains('active')) {
        const vizContainer = document.querySelector('.viz-visualization') || document.getElementById('vizMap').parentElement;
        vizSvg.attr("width", vizContainer.clientWidth).attr("height", vizContainer.clientHeight);
        updateVizMapNetwork();
        updateVizMapMovingElementsPositions();
    }
    
    if (vizGraphContainer && document.getElementById('vizModal').classList.contains('active')) {
        const vizContainer = document.querySelector('.viz-visualization') || document.getElementById('vizNetworkGraph').parentElement;
        vizGraphWidth = vizContainer.clientWidth;
        vizGraphHeight = vizContainer.clientHeight;
        
        const svgGraph = d3.select("#graphSvg");
        svgGraph.attr("width", vizGraphWidth).attr("height", vizGraphHeight);
        
        if (vizSimulation) {
            vizSimulation.force("center", d3.forceCenter(vizGraphWidth / 2, vizGraphHeight / 2));
            vizSimulation.force("x", d3.forceX(vizGraphWidth / 2).strength(0.1));
            vizSimulation.force("y", d3.forceY(vizGraphHeight / 2).strength(0.1));
            vizSimulation.alpha(0.3).restart();
            
            setTimeout(() => {
                fitVizNetworkToScreen();
            }, 1000);
        }
    }
}

// Add resize event listener
window.addEventListener('resize', handleVizResize);

// Export functions for global access
window.openNetworkViz = openNetworkViz;
window.closeNetworkViz = closeNetworkViz;
window.switchVizView = switchVizView;