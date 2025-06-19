// NLP Visualization Script
// Adapted from the test files for integration into the main portfolio

const NLP_NUM_POINTS = 120;
const NLP_NUM_CLUSTERS = 7;

// Cluster distribution: first 4 clusters = 70%, last 3 = 30%
const nlpClusterSizes = [30, 24, 18, 12, 12, 12, 12]; // 25%, 20%, 15%, 10%, 10%, 10%, 10%

const nlpClusterColors = [
    '#ff6b6b', // Billing Issues - Red
    '#4ecdc4', // Technical Support - Teal
    '#45b7d1', // Account Questions - Blue
    '#f9ca24', // Product Info - Yellow
    '#a55eea', // Complaints - Purple
    '#26de81', // Feature Requests - Green
    '#fd79a8'  // General Inquiries - Pink
];

const nlpClusterNames = [
    'Billing Issues',
    'Technical Support', 
    'Account Questions',
    'Product Information',
    'Complaints & Feedback',
    'Feature Requests',
    'General Inquiries'
];

let nlpPoints = [];
let nlpClusterCenters = [];
let nlpConnectionLines = [];
let nlpCurrentStep = 0;
let nlpIsAnimating = false;

// Modal control functions
function openNlpViz() {
    document.getElementById('nlpVizModal').style.display = 'flex';
    setTimeout(() => {
        createNlpPoints();
    }, 100);
}

function closeNlpViz() {
    document.getElementById('nlpVizModal').style.display = 'none';
    resetNlpVisualization();
}

function createNlpPoints() {
    const container = document.getElementById('nlpVisualization');
    // Clear existing points and lines
    container.querySelectorAll('.nlp-point, .nlp-connection-line, .nlp-cluster-center, .nlp-cluster-label').forEach(el => el.remove());
    
    nlpPoints = [];
    nlpConnectionLines = [];
    nlpClusterCenters = [];

    // Create cluster centers
    const centerPositions = [
        { x: 120, y: 100 }, // Billing Issues
        { x: 360, y: 100 }, // Technical Support
        { x: 600, y: 100 }, // Account Questions
        { x: 120, y: 220 }, // Product Info
        { x: 360, y: 220 }, // Complaints
        { x: 600, y: 220 }, // Feature Requests
        { x: 360, y: 320 }  // General Inquiries
    ];

    centerPositions.forEach((pos, index) => {
        const center = document.createElement('div');
        center.className = 'nlp-cluster-center';
        center.style.left = (pos.x - 10) + 'px';
        center.style.top = (pos.y - 10) + 'px';
        center.style.borderColor = nlpClusterColors[index];
        container.appendChild(center);
        nlpClusterCenters.push({ element: center, x: pos.x, y: pos.y });
    });

    // Create points with proper cluster distribution
    let pointIndex = 0;
    for (let cluster = 0; cluster < NLP_NUM_CLUSTERS; cluster++) {
        for (let i = 0; i < nlpClusterSizes[cluster]; i++) {
            const point = document.createElement('div');
            point.className = 'nlp-point';
            point.style.left = Math.random() * 700 + 'px';
            point.style.top = Math.random() * 350 + 'px';
            point.style.backgroundColor = '#ffffff';
            container.appendChild(point);
            
            nlpPoints.push({
                element: point,
                cluster: cluster,
                originalX: parseFloat(point.style.left),
                originalY: parseFloat(point.style.top)
            });
            pointIndex++;
        }
    }

    // Create connection lines
    nlpPoints.forEach((point, index) => {
        const line = document.createElement('div');
        line.className = 'nlp-connection-line';
        container.appendChild(line);
        nlpConnectionLines.push(line);
    });
}

function showNlpMetrics() {
    const metrics = ['nlpMetric1', 'nlpMetric2', 'nlpMetric4', 'nlpMetric5'];
    metrics.forEach((id, index) => {
        setTimeout(() => {
            document.getElementById(id).style.opacity = '1';
        }, index * 500);
    });
}

function updateNlpStageIndicator(stage) {
    const indicator = document.getElementById('nlpStageIndicator');
    const stages = [
        'Ready to analyze conversation data and extract FAQ themes',
        'Step 1: Load conversation dataset (120 unique conversations)',
        'Step 2: Apply K-means clustering algorithm',
        'Step 3: Analyze conversation sentiment (positive/negative)',
        'Step 4: Group conversations by themes',
        'Step 5: Organize themes for FAQ creation',
        'Analysis complete! Ready to generate FAQ themes'
    ];
    indicator.textContent = stages[stage];
}

function drawNlpConnectionLines() {
    nlpPoints.forEach((point, index) => {
        const line = nlpConnectionLines[index];
        const center = nlpClusterCenters[point.cluster];
        
        const pointX = parseFloat(point.element.style.left) + 4;
        const pointY = parseFloat(point.element.style.top) + 4;
        const centerX = center.x;
        const centerY = center.y;
        
        const dx = centerX - pointX;
        const dy = centerY - pointY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        line.style.left = pointX + 'px';
        line.style.top = pointY + 'px';
        line.style.width = distance + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.background = `linear-gradient(to right, ${nlpClusterColors[point.cluster]}40, ${nlpClusterColors[point.cluster]}20)`;
        line.style.opacity = '0.6';
    });
}

async function nlpStep1_LoadData() {
    updateNlpStageIndicator(1);
    await new Promise(resolve => setTimeout(resolve, 2000));
}

async function nlpStep2_ApplyClustering() {
    updateNlpStageIndicator(2);
    
    // Show cluster centers
    nlpClusterCenters.forEach(center => {
        center.element.style.opacity = '1';
    });

    // Generate cluster positions with some randomness
    const centerPositions = [
        { x: 120, y: 100 }, { x: 360, y: 100 }, { x: 600, y: 100 },
        { x: 120, y: 220 }, { x: 360, y: 220 }, { x: 600, y: 220 }, { x: 360, y: 320 }
    ];

    nlpPoints.forEach((point, index) => {
        const cluster = point.cluster;
        const center = centerPositions[cluster];
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 60 + 20;
        
        const newX = center.x + Math.cos(angle) * radius;
        const newY = center.y + Math.sin(angle) * radius;
        
        point.element.style.left = Math.max(10, Math.min(700, newX)) + 'px';
        point.element.style.top = Math.max(10, Math.min(350, newY)) + 'px';
    });

    // Show connection lines after clustering
    setTimeout(() => {
        drawNlpConnectionLines();
        nlpConnectionLines.forEach(line => {
            line.style.opacity = '0.6';
        });
    }, 1500);

    await new Promise(resolve => setTimeout(resolve, 3000));
}

async function nlpStep3_SentimentAnalysis() {
    updateNlpStageIndicator(3);
    
    // Show sentiment notification
    const notification = document.getElementById('nlpSentimentNotification');
    notification.style.opacity = '1';
    
    // Flash sentiment colors
    nlpPoints.forEach(point => {
        const isPositive = Math.random() > 0.3; // 70% positive sentiment
        point.element.style.backgroundColor = isPositive ? '#3498db' : '#e74c3c';
        point.element.style.transform = 'scale(1.3)';
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Hide notification and reset scale
    notification.style.opacity = '0';
    nlpPoints.forEach(point => {
        point.element.style.transform = 'scale(1)';
    });

    await new Promise(resolve => setTimeout(resolve, 500));
}

async function nlpStep4_ColorByCluster() {
    updateNlpStageIndicator(4);
    
    nlpPoints.forEach(point => {
        point.element.style.backgroundColor = nlpClusterColors[point.cluster];
        point.element.style.transform = 'scale(1.2)';
    });

    setTimeout(() => {
        nlpPoints.forEach(point => {
            point.element.style.transform = 'scale(1)';
        });
    }, 500);

    await new Promise(resolve => setTimeout(resolve, 2000));
}

async function nlpStep5_OrganizeThemes() {
    updateNlpStageIndicator(5);
    
    const container = document.getElementById('nlpVisualization');
    const groupPositions = [
        { x: 40, y: 40, width: 180, height: 80 },   // Billing Issues
        { x: 260, y: 40, width: 180, height: 80 },  // Technical Support
        { x: 480, y: 40, width: 180, height: 80 },  // Account Questions
        { x: 40, y: 150, width: 180, height: 80 },  // Product Info
        { x: 260, y: 150, width: 180, height: 80 }, // Complaints
        { x: 480, y: 150, width: 180, height: 80 }, // Feature Requests
        { x: 260, y: 260, width: 180, height: 80 }  // General Inquiries
    ];

    // Hide connection lines
    nlpConnectionLines.forEach(line => {
        line.style.opacity = '0';
    });

    // Organize points into rectangular grids
    nlpPoints.forEach((point, index) => {
        const cluster = point.cluster;
        const group = groupPositions[cluster];
        const pointsInCluster = nlpClusterSizes[cluster];
        const indexInCluster = nlpPoints.filter(p => p.cluster === cluster).indexOf(point);
        
        const cols = Math.ceil(Math.sqrt(pointsInCluster));
        const rows = Math.ceil(pointsInCluster / cols);
        const row = Math.floor(indexInCluster / cols);
        const col = indexInCluster % cols;
        
        const x = group.x + (col * (group.width / cols)) + (group.width / cols / 2);
        const y = group.y + (row * (group.height / rows)) + (group.height / rows / 2);
        
        point.element.style.left = x + 'px';
        point.element.style.top = y + 'px';
    });

    // Add cluster labels
    setTimeout(() => {
        groupPositions.forEach((group, index) => {
            const label = document.createElement('div');
            label.className = 'nlp-cluster-label';
            label.innerHTML = `<strong>${nlpClusterNames[index]}</strong><br><small>${nlpClusterSizes[index]} conversations</small>`;
            label.style.left = (group.x + group.width / 2 - 60) + 'px';
            label.style.top = (group.y + group.height + 8) + 'px';
            label.style.color = nlpClusterColors[index];
            label.style.borderColor = nlpClusterColors[index];
            label.style.opacity = '1';
            container.appendChild(label);
        });
    }, 1500);

    // Hide cluster centers
    setTimeout(() => {
        nlpClusterCenters.forEach(center => {
            center.element.style.opacity = '0';
        });
    }, 1000);

    updateNlpStageIndicator(6);
    await new Promise(resolve => setTimeout(resolve, 3000));
}

async function startNlpAnalysis() {
    if (nlpIsAnimating) return;
    nlpIsAnimating = true;
    nlpCurrentStep = 0;

    resetNlpVisualization();
    await nlpStep1_LoadData();
    await nlpStep2_ApplyClustering();
    await nlpStep3_SentimentAnalysis();
    await nlpStep4_ColorByCluster();
    await nlpStep5_OrganizeThemes();
    showNlpMetrics();
    nlpIsAnimating = false;
    nlpCurrentStep = 5;
}

async function nextNlpStep() {
    if (nlpIsAnimating) return;
    nlpIsAnimating = true;

    if (nlpCurrentStep === 0) {
        resetNlpVisualization();
        await nlpStep1_LoadData();
    } else if (nlpCurrentStep === 1) {
        await nlpStep2_ApplyClustering();
    } else if (nlpCurrentStep === 2) {
        await nlpStep3_SentimentAnalysis();
    } else if (nlpCurrentStep === 3) {
        await nlpStep4_ColorByCluster();
    } else if (nlpCurrentStep === 4) {
        await nlpStep5_OrganizeThemes();
    }

    if (nlpCurrentStep < 5) nlpCurrentStep++;
    nlpIsAnimating = false;
}

function resetNlpVisualization() {
    nlpCurrentStep = 0;
    updateNlpStageIndicator(0);
    document.querySelectorAll('#nlpMetric1, #nlpMetric2, #nlpMetric4, #nlpMetric5').forEach(item => {
        item.style.opacity = '0';
    });
    createNlpPoints();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('nlpVizModal');
    if (event.target === modal) {
        closeNlpViz();
    }
});