// Optimization Visualization Module
class OptimizationVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.currentStep = 0;
        this.matches = [];
        this.eventTimer = null;
        this.compatibilityMatrix = {};

        // Multi-objective scoring weights
        this.weights = {
            satisfaction: 0.4,
            revenue: 0.35,
            workload: 0.25
        };

        // Enhanced data structure
        this.clients = [
            { id: 1, name: "Acme Corp", needs: "Enterprise CRM", revenue: 85000, preferredSkills: ["Enterprise", "CRM"], score: 0, isUrgent: false },
            { id: 2, name: "StartupX", needs: "MVP Development", revenue: 35000, preferredSkills: ["Startup", "MVP"], score: 0, isUrgent: false },
            { id: 3, name: "TechGiant", needs: "Cloud Migration", revenue: 120000, preferredSkills: ["Cloud", "Enterprise"], score: 0, isUrgent: false },
            { id: 4, name: "LocalBiz", needs: "Website Redesign", revenue: 15000, preferredSkills: ["Web", "Design"], score: 0, isUrgent: false },
            { id: 5, name: "MedTech Inc", needs: "Compliance System", revenue: 95000, preferredSkills: ["Healthcare", "Compliance"], score: 0, isUrgent: false },
            { id: 6, name: "EduPlatform", needs: "Learning Management", revenue: 45000, preferredSkills: ["Education", "Platform"], score: 0, isUrgent: false },
            { id: 7, name: "FinanceFirst", needs: "Trading Platform", revenue: 150000, preferredSkills: ["Finance", "Trading"], score: 0, isUrgent: false }
        ];

        this.salespeople = [
            { id: 1, name: "Sarah Chen", skills: ["Enterprise", "CRM"], capacity: 3, currentClients: 0, queue: [], available: true, efficiency: 0.9 },
            { id: 2, name: "Marcus Rodriguez", skills: ["Startup", "MVP"], capacity: 4, currentClients: 0, queue: [], available: true, efficiency: 0.85 },
            { id: 3, name: "Dr. Emily Watson", skills: ["Healthcare", "Compliance"], capacity: 2, currentClients: 0, queue: [], available: true, efficiency: 0.95 },
            { id: 4, name: "Jake Thompson", skills: ["Web", "Design"], capacity: 5, currentClients: 0, queue: [], available: true, efficiency: 0.8 },
            { id: 5, name: "Lisa Patel", skills: ["Finance", "Trading"], capacity: 3, currentClients: 0, queue: [], available: true, efficiency: 0.88 }
        ];
    }

    init() {
        this.createHTML();
        this.initializeCompatibilityMatrix();
        this.renderClients();
        this.renderSalespeople();
        this.updateMetrics();
        this.updateObjectives();
    }

    createHTML() {
        this.container.innerHTML = `
            <style>
                .opt-viz-container {
                    background: var(--color-paper);
                    color: var(--color-ink);
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    position: relative;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                }

                .opt-viz-container::-webkit-scrollbar {
                    width: 8px;
                }

                .opt-viz-container::-webkit-scrollbar-track {
                    background: var(--color-sand);
                    border-radius: 4px;
                }

                .opt-viz-container::-webkit-scrollbar-thumb {
                    background: var(--color-sand-deep);
                    border-radius: 4px;
                }

                .opt-viz-container::-webkit-scrollbar-thumb:hover {
                    background: var(--color-green);
                }

                .opt-viz-header {
                    text-align: center;
                    padding: 8px;
                    background: var(--color-paper-2);
                    border-bottom: 1px solid var(--color-sand);
                }

                .opt-viz-header h3 {
                    font-size: 1.1rem;
                    color: var(--color-green-deep);
                    font-weight: 700;
                    margin-bottom: 3px;
                }

                .opt-viz-header p {
                    color: var(--color-muted);
                    font-size: 0.7rem;
                }

                .opt-viz-controls {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    padding: 8px;
                    background: var(--color-paper);
                    border-bottom: 1px solid var(--color-sand);
                }

                .opt-viz-btn {
                    background: var(--color-green);
                    border: none;
                    padding: 5px 10px;
                    border-radius: 15px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.7rem;
                }

                .opt-viz-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(47, 107, 83, 0.25);
                    background: var(--color-green-deep);
                }

                .opt-viz-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .opt-viz-main {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 8px;
                    min-height: 500px;
                }

                .opt-viz-content {
                    display: flex;
                    gap: 12px;
                    height: 400px;
                }

                .opt-viz-area {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex: 1;
                    position: relative;
                    background: var(--color-paper-2);
                    border-radius: 8px;
                    padding: 10px;
                    gap: 12px;
                }

                .opt-viz-sidebar {
                    width: 200px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .opt-viz-panel {
                    flex: 1;
                    background: var(--color-paper);
                    border: 1px solid var(--color-sand);
                    border-radius: 8px;
                    padding: 8px;
                    position: relative;
                    height: 100%;
                    overflow: visible;
                }

                .opt-viz-panel-title {
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                    text-align: center;
                    color: var(--color-green);
                    font-weight: 600;
                }

                .opt-viz-node {
                    background: var(--color-paper-2);
                    border: 2px solid var(--color-sand);
                    border-radius: 4px;
                    padding: 4px;
                    margin-bottom: 3px;
                    transition: all 0.3s ease;
                    position: relative;
                    cursor: pointer;
                    font-size: 0.65rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 6px;
                    min-height: 35px;
                }

                .opt-viz-node:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(47, 107, 83, 0.12);
                }

                .opt-viz-node.active {
                    border-color: var(--color-green);
                    box-shadow: 0 0 10px rgba(47, 107, 83, 0.3);
                }

                .opt-viz-node.matched {
                    border-color: var(--color-green);
                    background: var(--color-green-soft);
                }

                .opt-viz-node.unavailable {
                    border-color: #C0392B;
                    background: rgba(192, 57, 43, 0.08);
                    opacity: 0.6;
                }

                .opt-viz-node-content {
                    flex: 1;
                    min-width: 0;
                }

                .opt-viz-node-name {
                    font-weight: bold;
                    font-size: 0.7rem;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: var(--color-ink);
                }

                .opt-viz-node-details {
                    font-size: 0.6rem;
                    color: var(--color-muted);
                    line-height: 1.1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .opt-viz-node-score {
                    font-weight: bold;
                    font-size: 0.65rem;
                    color: var(--color-green);
                    text-align: center;
                    min-width: 20px;
                    flex-shrink: 0;
                }

                .opt-viz-capacity-bar {
                    width: 100%;
                    height: 3px;
                    background: var(--color-sand);
                    border-radius: 2px;
                    margin-top: 4px;
                    overflow: hidden;
                }

                .opt-viz-capacity-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--color-green), var(--color-sand-deep));
                    transition: width 0.5s ease;
                }

                .opt-viz-connections {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                .opt-viz-line {
                    stroke-width: 3;
                    fill: none;
                    opacity: 0;
                    stroke-dasharray: 5, 5;
                    animation: opt-dash 1s linear infinite;
                }

                .opt-viz-line.active {
                    opacity: 1;
                    stroke-width: 4;
                }

                .opt-viz-line.matched {
                    opacity: 1;
                    stroke-width: 5;
                    stroke-dasharray: none;
                    animation: none;
                }

                @keyframes opt-dash {
                    to {
                        stroke-dashoffset: -10;
                    }
                }

                .opt-viz-metrics {
                    background: var(--color-paper-2);
                    border: 1px solid var(--color-sand);
                    border-radius: 6px;
                    padding: 8px;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 6px;
                }

                .opt-viz-metric {
                    text-align: center;
                }

                .opt-viz-metric-value {
                    font-size: 0.8rem;
                    font-weight: bold;
                    color: var(--color-green);
                }

                .opt-viz-metric-label {
                    color: var(--color-muted);
                    font-size: 0.55rem;
                    margin-top: 1px;
                }

                .opt-viz-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 0.65rem;
                    color: var(--color-green-deep);
                    background: var(--color-paper-2);
                    border: 1px solid var(--color-sand);
                    border-radius: 6px;
                    padding: 8px;
                    min-height: 50px;
                    line-height: 1.2;
                }

                .opt-results-summary {
                    background: var(--color-green-soft);
                    border: 1px solid var(--color-green);
                    border-radius: 8px;
                    padding: 12px;
                    transition: opacity 0.6s ease;
                }

                .opt-results-title {
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: var(--color-green-deep);
                    text-align: center;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }

                .opt-results-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                }

                .opt-results-item {
                    text-align: center;
                    background: var(--color-paper);
                    border-radius: 6px;
                    padding: 8px 4px;
                    border: 1px solid var(--color-green-soft);
                }

                .opt-results-value {
                    display: block;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--color-green);
                }

                .opt-results-label {
                    display: block;
                    font-size: 0.58rem;
                    color: var(--color-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    margin-top: 2px;
                }

                .opt-event-toast {
                    position: absolute;
                    top: 56px;
                    right: 10px;
                    background: var(--color-ink);
                    color: var(--color-paper);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    max-width: 260px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 100;
                    line-height: 1.5;
                    pointer-events: none;
                    box-shadow: 0 4px 14px rgba(21, 32, 27, 0.22);
                }

                .opt-event-toast.visible {
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    .opt-viz-main {
                        grid-template-columns: 1fr;
                        height: auto;
                    }

                    .opt-viz-area {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .opt-viz-panel {
                        max-width: 100%;
                    }
                }
            </style>

            <div class="opt-viz-container">
                <div class="opt-event-toast" id="opt-event-toast"></div>
                <div class="opt-viz-header">
                    <h3>Workforce Assignment Optimization</h3>
                    <p>Multi-objective client-salesperson matching with dynamic adaptation</p>
                </div>

                <div class="opt-viz-controls">
                    <button class="opt-viz-btn" onclick="window.optViz.startOptimization()">Start Optimization</button>
                    <button class="opt-viz-btn" onclick="window.optViz.resetSimulation()">Reset</button>
                    <button class="opt-viz-btn" onclick="window.optViz.triggerRandomEvent()">Trigger Event</button>
                </div>

                <div class="opt-viz-main">
                    <div class="opt-viz-content">
                        <div class="opt-viz-area" id="opt-viz-area">
                            <div class="opt-viz-panel">
                                <h4 class="opt-viz-panel-title">Clients</h4>
                                <div id="opt-clients-container"></div>
                            </div>

                            <div class="opt-viz-panel">
                                <h4 class="opt-viz-panel-title">Sales Team</h4>
                                <div id="opt-salespeople-container"></div>
                            </div>

                            <svg class="opt-viz-connections" id="opt-connections"></svg>
                        </div>

                        <div class="opt-viz-sidebar">
                            <div class="opt-viz-metrics">
                                <div class="opt-viz-metric">
                                    <div class="opt-viz-metric-value" id="opt-total-score">0</div>
                                    <div class="opt-viz-metric-label">Total Score</div>
                                </div>
                                <div class="opt-viz-metric">
                                    <div class="opt-viz-metric-value" id="opt-matches-made">0</div>
                                    <div class="opt-viz-metric-label">Matches</div>
                                </div>
                                <div class="opt-viz-metric">
                                    <div class="opt-viz-metric-value" id="opt-algorithm-steps">0</div>
                                    <div class="opt-viz-metric-label">Steps</div>
                                </div>
                                <div class="opt-viz-metric">
                                    <div class="opt-viz-metric-value" id="opt-efficiency">0%</div>
                                    <div class="opt-viz-metric-label">Efficiency</div>
                                </div>
                            </div>

                            <div class="opt-viz-status" id="opt-status">Ready to optimize</div>
                        </div>
                    </div>

                    <div class="opt-results-summary" id="opt-results-summary" style="display: none; opacity: 0;">
                        <div class="opt-results-title">Optimization Complete</div>
                        <div class="opt-results-grid">
                            <div class="opt-results-item">
                                <span class="opt-results-value" id="opt-summary-revenue">$0</span>
                                <span class="opt-results-label">Revenue Matched</span>
                            </div>
                            <div class="opt-results-item">
                                <span class="opt-results-value" id="opt-summary-matches">0</span>
                                <span class="opt-results-label">Assignments Made</span>
                            </div>
                            <div class="opt-results-item">
                                <span class="opt-results-value" id="opt-summary-score">0%</span>
                                <span class="opt-results-label">Avg. Compatibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateScore(client, salesperson) {
        if (!salesperson.available) return 0;

        let satisfactionScore = 50;
        const skillMatches = client.preferredSkills.filter(skill =>
            salesperson.skills.includes(skill)
        ).length;
        satisfactionScore += skillMatches * 25;

        const maxRevenue = Math.max(...this.clients.map(c => c.revenue));
        const revenueScore = (client.revenue / maxRevenue) * 100;

        const capacityRatio = salesperson.currentClients / salesperson.capacity;
        const workloadScore = (1 - capacityRatio) * 100 * salesperson.efficiency;

        const urgencyMultiplier = client.isUrgent ? 1.3 : 1.0;

        const combinedScore = (
            satisfactionScore * this.weights.satisfaction +
            revenueScore * this.weights.revenue +
            workloadScore * this.weights.workload
        ) * urgencyMultiplier;

        return Math.min(100, Math.max(50, Math.round(combinedScore)));
    }

    getScoreColor(score) {
        const normalized = Math.min((score - 20) / 50, 1);

        if (normalized < 0.5) {
            const ratio = normalized * 2;
            const red = 255;
            const green = Math.round(255 * ratio);
            return `rgba(${red}, ${green}, 0, 0.8)`;
        } else {
            const ratio = (normalized - 0.5) * 2;
            const red = Math.round(255 * (1 - ratio));
            const green = 255;
            return `rgba(${red}, ${green}, 0, 0.8)`;
        }
    }

    initializeCompatibilityMatrix() {
        this.compatibilityMatrix = {};
        this.clients.forEach(client => {
            this.compatibilityMatrix[client.id] = {};
            this.salespeople.forEach(salesperson => {
                const score = this.calculateScore(client, salesperson);
                this.compatibilityMatrix[client.id][salesperson.id] = score;
            });
        });
    }

    renderClients() {
        const container = document.getElementById('opt-clients-container');
        container.innerHTML = '';

        this.clients.forEach(client => {
            const div = document.createElement('div');
            div.className = 'opt-viz-node';
            div.id = `opt-client-${client.id}`;

            if (client.isUrgent) {
                div.style.borderColor = '#C0392B';
                div.style.boxShadow = '0 0 10px rgba(192, 57, 43, 0.4)';
            }

            div.innerHTML = `
                <div class="opt-viz-node-content">
                    <div class="opt-viz-node-name">${client.name}${client.isUrgent ? ' 🚨' : ''}</div>
                    <div class="opt-viz-node-details">
                        <strong>Needs:</strong> ${client.needs} | <strong>Revenue:</strong> $${client.revenue.toLocaleString()}
                    </div>
                </div>
                <div class="opt-viz-node-score" id="opt-client-score-${client.id}" style="color: ${this.getScoreColor(client.score)};">${client.score}</div>
            `;
            container.appendChild(div);
        });
    }

    renderSalespeople() {
        const container = document.getElementById('opt-salespeople-container');
        container.innerHTML = '';

        this.salespeople.forEach(person => {
            const div = document.createElement('div');
            div.className = 'opt-viz-node';
            div.id = `opt-salesperson-${person.id}`;

            if (!person.available) {
                div.classList.add('unavailable');
            }

            div.innerHTML = `
                <div class="opt-viz-node-content">
                    <div class="opt-viz-node-name">${person.name}${!person.available ? ' ❌' : ''}</div>
                    <div class="opt-viz-node-details">
                        <strong>Skills:</strong> ${person.skills.join(', ')} | <strong>Cap:</strong> ${person.currentClients}/${person.capacity} | <strong>Eff:</strong> ${Math.round(person.efficiency * 100)}%
                        <div class="opt-viz-capacity-bar">
                            <div class="opt-viz-capacity-fill" style="width: ${(person.currentClients / person.capacity) * 100}%"></div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateMetrics() {
        const totalScore = this.matches.reduce((sum, match) => sum + match.score, 0);
        const matchesMade = this.matches.length;
        const maxPossibleMatches = Math.min(this.clients.length, this.salespeople.reduce((sum, p) => sum + p.capacity, 0));
        const efficiency = maxPossibleMatches > 0 ? Math.round((matchesMade / maxPossibleMatches) * 100) : 0;

        document.getElementById('opt-total-score').textContent = totalScore;
        document.getElementById('opt-matches-made').textContent = matchesMade;
        document.getElementById('opt-algorithm-steps').textContent = this.currentStep;
        document.getElementById('opt-efficiency').textContent = efficiency + '%';
    }

    updateObjectives() {
        // Objectives panel was removed from layout; kept for call compatibility
    }

    findNextClientAndCandidates() {
        const unmatchedClient = this.clients.find(client =>
            !this.matches.find(m => m.clientId === client.id)
        );

        if (!unmatchedClient) return null;

        const availableSalespeople = this.salespeople.filter(salesperson =>
            salesperson.available && salesperson.currentClients < salesperson.capacity
        );

        if (availableSalespeople.length === 0) return null;

        const numToEvaluate = Math.random() < 0.7 ? 2 : 1;
        const candidatesToEvaluate = [];

        const shuffled = [...availableSalespeople].sort(() => Math.random() - 0.5);
        const actualNumToEvaluate = Math.min(numToEvaluate, shuffled.length);

        for (let i = 0; i < actualNumToEvaluate; i++) {
            const score = this.calculateScore(unmatchedClient, shuffled[i]);
            candidatesToEvaluate.push({
                clientId: unmatchedClient.id,
                salespersonId: shuffled[i].id,
                score: score
            });
        }

        return {
            client: unmatchedClient,
            candidates: candidatesToEvaluate
        };
    }

    highlightNodes(clientId, salespersonId, isMatched = false) {
        document.querySelectorAll('.opt-viz-node').forEach(node => {
            node.classList.remove('active', 'matched');
        });

        if (clientId && salespersonId) {
            const clientNode = document.getElementById(`opt-client-${clientId}`);
            const salespersonNode = document.getElementById(`opt-salesperson-${salespersonId}`);

            if (clientNode && salespersonNode) {
                if (isMatched) {
                    clientNode.classList.add('matched');
                    salespersonNode.classList.add('matched');
                } else {
                    clientNode.classList.add('active');
                    salespersonNode.classList.add('active');
                }
            }
        }
    }

    drawConnection(clientId, salespersonId, score, isMatched = false) {
        const svg = document.getElementById('opt-connections');
        const clientNode = document.getElementById(`opt-client-${clientId}`);
        const salespersonNode = document.getElementById(`opt-salesperson-${salespersonId}`);

        if (!clientNode || !salespersonNode) return;

        const clientRect = clientNode.getBoundingClientRect();
        const salespersonRect = salespersonNode.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        const x1 = clientRect.right - svgRect.left;
        const y1 = clientRect.top + clientRect.height / 2 - svgRect.top;
        const x2 = salespersonRect.left - svgRect.left;
        const y2 = salespersonRect.top + salespersonRect.height / 2 - svgRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.classList.add('opt-viz-line');
        line.id = `opt-connection-${clientId}-${salespersonId}`;

        if (isMatched) {
            line.style.stroke = this.getScoreColor(score);
            line.classList.add('matched');
        } else {
            line.style.stroke = 'rgba(58, 69, 64, 0.3)';
            line.classList.add('active');
        }

        svg.appendChild(line);
    }

    async evaluateCandidate(candidate) {
        return new Promise(resolve => {
            this.highlightNodes(candidate.clientId, candidate.salespersonId, false);
            this.drawConnection(candidate.clientId, candidate.salespersonId, candidate.score, false);

            const clientName = this.clients.find(c => c.id === candidate.clientId).name;
            const salespersonName = this.salespeople.find(s => s.id === candidate.salespersonId).name;

            document.getElementById('opt-status').textContent =
                `Evaluating: ${clientName} ↔ ${salespersonName} (Score: ${candidate.score})`;

            setTimeout(() => {
                resolve();
            }, 600);
        });
    }

    async confirmMatch(finalMatch, candidatesEvaluated) {
        return new Promise(resolve => {
            candidatesEvaluated.forEach(candidate => {
                const line = document.getElementById(`opt-connection-${candidate.clientId}-${candidate.salespersonId}`);
                if (line && candidate.salespersonId !== finalMatch.salespersonId) {
                    line.remove();
                }
            });

            this.highlightNodes(finalMatch.clientId, finalMatch.salespersonId, true);
            const connectionLine = document.getElementById(`opt-connection-${finalMatch.clientId}-${finalMatch.salespersonId}`);
            if (connectionLine) {
                connectionLine.classList.remove('active');
                connectionLine.classList.add('matched');
                connectionLine.style.stroke = this.getScoreColor(finalMatch.score);
            }

            const clientName = this.clients.find(c => c.id === finalMatch.clientId).name;
            const salespersonName = this.salespeople.find(s => s.id === finalMatch.salespersonId).name;
            document.getElementById('opt-status').textContent =
                `✓ Matched: ${clientName} → ${salespersonName} (Score: ${finalMatch.score})`;

            const client = this.clients.find(c => c.id === finalMatch.clientId);
            client.score = finalMatch.score;
            const scoreElement = document.getElementById(`opt-client-score-${finalMatch.clientId}`);
            scoreElement.textContent = finalMatch.score;
            scoreElement.style.color = this.getScoreColor(finalMatch.score);

            const salesperson = this.salespeople.find(s => s.id === finalMatch.salespersonId);
            salesperson.currentClients++;
            this.renderSalespeople();

            this.matches.push(finalMatch);
            this.updateMetrics();
            this.updateObjectives();

            setTimeout(() => {
                resolve();
            }, 400);
        });
    }

    showOptToast(message) {
        const toast = document.getElementById('opt-event-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
    }

    triggerRandomEvent() {
        if (this.isRunning) return;

        const eventType = Math.random();

        if (eventType < 0.5) {
            const availableSalespeople = this.salespeople.filter(s => s.available);
            if (availableSalespeople.length > 0) {
                const randomSalesperson = availableSalespeople[Math.floor(Math.random() * availableSalespeople.length)];
                randomSalesperson.available = false;

                const reassignments = this.matches.filter(m => m.salespersonId === randomSalesperson.id);
                this.showOptToast(`⚠ ${randomSalesperson.name} went unavailable — ${reassignments.length} client(s) unassigned`);
                reassignments.forEach(match => {
                    const matchIndex = this.matches.findIndex(m => m.clientId === match.clientId);
                    this.matches.splice(matchIndex, 1);

                    const client = this.clients.find(c => c.id === match.clientId);
                    client.score = 0;

                    randomSalesperson.currentClients--;

                    const line = document.getElementById(`opt-connection-${match.clientId}-${match.salespersonId}`);
                    if (line) line.remove();
                });

                this.renderClients();
                this.renderSalespeople();
                this.initializeCompatibilityMatrix();
                this.updateMetrics();
                this.updateObjectives();
            }
        } else {
            const newClient = {
                id: this.clients.length + 1,
                name: `UrgentCorp ${this.clients.length - 6}`,
                needs: "Critical System",
                budget: "Very High",
                revenue: 200000,
                preferredSkills: ["Enterprise", "Emergency"],
                score: 0,
                isUrgent: true
            };

            this.clients.push(newClient);
            this.showOptToast(`🚨 Urgent client added: ${newClient.name} ($${newClient.revenue.toLocaleString()}) — needs immediate assignment`);
            this.renderClients();
            this.initializeCompatibilityMatrix();
            this.updateMetrics();
        }
    }

    showResultsSummary() {
        const totalRevenue = this.matches.reduce((sum, m) => {
            const client = this.clients.find(c => c.id === m.clientId);
            return sum + (client ? client.revenue : 0);
        }, 0);
        const avgScore = this.matches.length > 0
            ? Math.round(this.matches.reduce((s, m) => s + m.score, 0) / this.matches.length)
            : 0;

        document.getElementById('opt-summary-revenue').textContent = '$' + totalRevenue.toLocaleString();
        document.getElementById('opt-summary-matches').textContent = this.matches.length;
        document.getElementById('opt-summary-score').textContent = avgScore + '%';

        const el = document.getElementById('opt-results-summary');
        if (!el) return;
        el.style.display = 'block';
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.6s ease';
            el.style.opacity = '1';
        });
    }

    async startOptimization() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.currentStep = 0;

        this.eventTimer = setInterval(() => {
            if (Math.random() < 0.3) {
                this.triggerRandomEvent();
            }
        }, 8000);

        while (true) {
            this.currentStep++;
            const evaluationData = this.findNextClientAndCandidates();

            if (!evaluationData) {
                document.getElementById('opt-status').textContent = 'Optimization complete! All possible matches made.';
                this.showResultsSummary();
                break;
            }

            const { client, candidates } = evaluationData;
            const clientName = client.name;

            document.querySelectorAll('.opt-viz-node').forEach(node => {
                node.classList.remove('active', 'matched');
            });

            document.getElementById('opt-status').textContent =
                `Processing ${clientName}... (${candidates.length} candidate${candidates.length > 1 ? 's' : ''} to evaluate)`;

            await new Promise(resolve => setTimeout(resolve, 400));

            for (const candidate of candidates) {
                await this.evaluateCandidate(candidate);
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            const bestCandidate = candidates.reduce((best, current) =>
                current.score > best.score ? current : best
            );

            await this.confirmMatch(bestCandidate, candidates);

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (this.eventTimer) {
            clearInterval(this.eventTimer);
            this.eventTimer = null;
        }

        this.isRunning = false;
    }

    resetSimulation() {
        if (this.isRunning) return;

        if (this.eventTimer) {
            clearInterval(this.eventTimer);
            this.eventTimer = null;
        }

        this.matches = [];
        this.currentStep = 0;

        this.clients.forEach((client, index) => {
            if (index < 7) {
                client.score = 0;
                client.isUrgent = false;
            } else {
                this.clients.splice(index, 1);
            }
        });

        this.salespeople.forEach(person => {
            person.currentClients = 0;
            person.queue = [];
            person.available = true;
        });

        document.getElementById('opt-connections').innerHTML = '';
        document.getElementById('opt-status').textContent = 'Ready to optimize';

        const summary = document.getElementById('opt-results-summary');
        if (summary) { summary.style.display = 'none'; summary.style.opacity = '0'; }

        this.renderClients();
        this.renderSalespeople();
        this.initializeCompatibilityMatrix();
        this.updateMetrics();
        this.updateObjectives();
    }
}

// Global function to open optimization visualization modal
function openOptimizationViz() {
    const modal = document.getElementById('optimizationVizModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize visualization if not already done
    if (!window.optViz) {
        window.optViz = new OptimizationVisualization('optimizationVizVisualization');
        window.optViz.init();
    }
}

// Global function to close optimization visualization modal
function closeOptimizationViz() {
    const modal = document.getElementById('optimizationVizModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset if running
    if (window.optViz && window.optViz.isRunning) {
        window.optViz.resetSimulation();
    }
}
