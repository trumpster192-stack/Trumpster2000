/**
 * ============================================================
 *  TRUMPSTER 2000 — app.js (Patriot Edition v2.0)
 *  The Greatest Application Logic Ever Built.
 *  NOW WITH RESPONSIVE VIEW SWITCHING
 * ============================================================
 */

// Global State for View Management
const AppState = {
    currentView: 'dashboard',
    isLoading: true,
    riskAccepted: false,
    scanProgress: 0,
    countdownInterval: null,
    matrixInterval: null,
    rssFeeds: [
        'https://rss.politico.com/donald-trump.xml',
        'https://cointelegraph.com/rss',
        'https://goldbroker.com/news.rss'
    ],
    currentChartSymbol: 'DJT', // Global scoping fix
    currentChartInterval: 'D'
};

// View Management System (ADDED FOR RESPONSIVE NAVIGATION)
function showView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.dashboard-view');
    views.forEach(view => {
        view.classList.add('hidden');
    });

    // Show target view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('slide-up');

        // Re-trigger animation
        setTimeout(() => {
            targetView.classList.remove('slide-up');
        }, 600);
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });

    AppState.currentView = viewName;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh icons for new view
    if (window.lucide) {
        lucide.createIcons();
    }

    // Trigger view-specific initializations (FROM ORIGINAL)
    if (viewName === 'chart') initTradingView(AppState.currentChartSymbol, AppState.currentChartInterval);
    if (viewName === 'speech') loadRealNews();
    if (viewName === 'winning') loadWinningsHistory();
    if (typeof SoundEngine !== 'undefined') SoundEngine.scan();
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. State & Constants (FROM ORIGINAL)
    const WATCHLIST = [
        'DJT', 'NVDA', 'TSLA', 'AAPL', 'SPY', 'QQQ', 
        'BTC-USD', 'ETH-USD',
        'CL=F', 'GC=F', 'SI=F', 'HG=F' // Crude Oil, Gold, Silver, Copper
    ];
    // currentChartSymbol moved to AppState

    // 3. Elements (FROM ORIGINAL)
    const signalsFeed = document.getElementById('signals-feed');
    const matrixTerminal = document.getElementById('matrix-terminal');
    const scanStatus = document.getElementById('scan-status');
    const newsFeed = document.getElementById('news-feed');
    const appContainer = document.getElementById('app');
    const riskModal = document.getElementById('risk-modal');
    const plansModal = document.getElementById('plans-modal');

    // 4. Matrix Intelligence Effect (FROM ORIGINAL)
    const MATRIX_PHRASES = [
      "> ESTABLISHING SATELLITE LINK...",
      "> DECRYPTING MARKET SYMBOLS...",
      "> INJECTING LIQUIDITY VECTORS...",
      "> ANALYZING PATRIOT SENTIMENT...",
      "> SCANNING FOR BEAR TRAPS...",
      "> MAGA ENGINE AT 99.8% STABILITY...",
      "> FLOW DETECTED: LARGE BUY ORDER...",
      "> CALCULATING ALPHA VANTAGE METRICS...",
      "> OPTIMIZING SIGNAL ACCURACY...",
    ];

    function startMatrixTerminal() {
        AppState.matrixInterval = setInterval(() => {
            const line = document.createElement('div');
            line.className = 'matrix-line';
            line.textContent = MATRIX_PHRASES[Math.floor(Math.random() * MATRIX_PHRASES.length)];
            matrixTerminal.prepend(line);
            if (matrixTerminal.childNodes.length > 20) matrixTerminal.lastChild.remove();
        }, 1500);
    }

    function updateScanStatus() {
        const STATUSES = ['SCANNING...', 'ANALYZING...', 'SECURING...', 'OPTIMIZING...', 'WINNING...'];
        let i = 0;
        setInterval(() => {
            scanStatus.textContent = STATUSES[i % STATUSES.length];
            i++;
        }, 3000);
    }

    // 5. Sound Engine (Synthesized Patriot Success) (FROM ORIGINAL)
    const SoundEngine = {
        ctx: null,
        init() {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        },
        play(freq, type = 'sine', duration = 0.5) {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        },
        success() {
            this.play(523.25, 'square', 0.1); 
            setTimeout(() => this.play(659.25, 'square', 0.3), 100); 
        },
        scan() {
            this.play(880, 'sine', 0.05);
        }
    };

    // Make SoundEngine globally available for view switching
    window.SoundEngine = SoundEngine;

    // 6. Navigation Logic (MERGED - Original + New View Switching)
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;

            // Use new view switching system
            showView(view);

            // Original view-specific logic now handled in showView()
        });
    });

    // 7. Signal Engine Integration (FROM ORIGINAL - COMPLETE)
    async function refreshDashboard() {
        const progressBox = document.getElementById('scan-progress-box');
        const progressBar = document.getElementById('scan-progress-bar');
        if (progressBox) progressBox.classList.remove('hidden');

        try {
            const signals = await window.SignalEngine.scanWatchlist(WATCHLIST, (pct) => {
                if (progressBar) progressBar.style.width = `${pct}%`;
            });
            renderSignals(signals);
            updateHeatmap(signals);
            updateSentiment(signals);
            updatePulseStats(signals); // Sync sidebar telemetry
            persistSignals(signals);
            SoundEngine.success(); 
            if (progressBox) setTimeout(() => progressBox.classList.add('hidden'), 2000); 
        } catch (err) {
            console.error('Telemetery Fail:', err);
            if (progressBox) progressBox.classList.add('hidden');
        }
    }

    function renderSignals(signals) {
        signalsFeed.innerHTML = signals.map((sig, i) => {
            const timeAgo = getRelativeTime(new Date()); // Realistic mock for now, or use actual timestamp if available
            return `
                <div class="signal-card glass-panel gold-border slide-up" style="animation-delay: ${i * 0.1}s">
                    <div class="signal-header">
                        <div class="symbol-info">
                            <span class="symbol-box ${sig.action.includes('SHORT') ? 'bg-red' : ''}">${sig.action}</span>
                            <h3 class="symbol-name">${sig.symbol}</h3>
                        </div>
                        <div class="price-info">
                            <span class="text-gold" style="font-weight: 900;">$${sig.price}</span>
                        </div>
                    </div>
                    <div class="confidence-meter">
                        <div class="confidence-label">
                            <span>CONFIDENCE: ${sig.confidence}%</span>
                            <span class="${sig.changePct >= 0 ? 'text-green' : 'text-red'}">${sig.changePct >= 0 ? '+' : ''}${sig.changePct}%</span>
                        </div>
                        <div class="meter-outer">
                            <div class="meter-inner" style="width: ${sig.confidence}%"></div>
                        </div>
                    </div>
                    <div class="signal-meta">
                        <small>Intel: ${timeAgo} | Alpha: Secured</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    function getRelativeTime(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just Now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    }

    function updateHeatmap(signals) {
        const heatmap = document.getElementById('heatmap-viz');
        heatmap.innerHTML = signals.map(sig => {
            const type = sig.changePct > 2 ? 'heat-positive' : (sig.changePct < -2 ? 'heat-negative' : 'heat-neutral');
            return `<div class="heat-cell ${type}">
                <div class="symbol-label">${sig.symbol}</div>
                <div class="price-tag">$${sig.price}</div>
                <div style="font-size: 0.6rem; margin-top: 2px;">${sig.changePct}%</div>
            </div>`;
        }).join('');
    }

    function updateSentiment(signals) {
        const needle = document.getElementById('sentiment-needle');
        const moodLabel = document.getElementById('mood-label');
        const avg = signals.reduce((sum, s) => sum + s.composite, 0) / signals.length;

        const rotation = (avg / 100) * 90;
        needle.style.transform = `rotate(${rotation}deg)`;

        if (avg > 40) moodLabel.textContent = 'EXTREME BULLISH';
        else if (avg > 10) moodLabel.textContent = 'BULLISH';
        else if (avg > -10) moodLabel.textContent = 'NEUTRAL';
        else moodLabel.textContent = 'BEARISH';

        // Update Gauge Score
        const scoreLabel = document.getElementById('sentiment-score');
        if (scoreLabel) scoreLabel.textContent = (avg / 100).toFixed(2);
    }

    function updatePulseStats(signals) {
        const vixVal = document.getElementById('vix-val');
        const dxyVal = document.getElementById('dxy-val');
        const goldVal = document.getElementById('gold-val');

        // Map real results to sidebar telemetry
        const goldPrice = signals.find(s => s.symbol.includes('GOLD') || s.symbol === 'GLD')?.price;
        const btcPrice = signals.find(s => s.symbol.includes('BTC'))?.price;

        if (goldVal && goldPrice) goldVal.textContent = goldPrice;
        
        // VIX & DXY are simulated based on market volatility/composite if real keys fail
        // but let's give them realistic patriot-themed values if not explicitly in watchlist
        if (vixVal) {
            const avgVol = signals.reduce((a, s) => a + (s.confidence || 70), 0) / signals.length;
            vixVal.textContent = (avgVol / 5).toFixed(1);
        }
        if (dxyVal) {
            const avgConf = signals.reduce((a, s) => a + (s.composite || 0), 0) / signals.length;
            dxyVal.textContent = (100 + (avgConf / 10)).toFixed(1);
        }
    }

    async function persistSignals(signals) {
        if (!window.supabaseClient) return;
        const strong = signals.filter(s => s.action.includes('STRONG'));
        for (const s of strong) {
            await window.supabaseClient.from('signals_history').insert([{
                symbol: s.symbol, action: s.action, price: s.price, 
                confidence: s.confidence, change_pct: s.changePct, message: s.message
            }]);
        }
    }

    async function loadWinningsHistory() {
        const historyList = document.getElementById('win-history');

        console.log("MAGA: Supabase Client Initialized:", !!window.supabaseClient);
        if (!window.supabaseClient) {
            historyList.innerHTML = '<div class="no-data">OFFLINE MODE: SUPABASE CLIENT NOT INITIALIZED.</div>';
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('winnings')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) {
                console.error("MAGA: Winnings Fetch Error:", error);
                throw error;
            }

            console.log("MAGA: Winnings Data Received:", data);

            if (data && data.length > 0) {
                historyList.innerHTML = data.map(win => `
                    <div class="history-item glass-panel gold-border">
                        <div class="win-info">
                            <span class="win-symbol">${win.symbol}</span>
                            <span class="win-action">${win.action}</span>
                        </div>
                        <div class="win-profit text-green">+${win.profit_pct}%</div>
                        <div class="win-date">${new Date(win.timestamp).toLocaleDateString()}</div>
                    </div>
                `).join('');
            } else {
                historyList.innerHTML = '<div class="no-data">NO WINNINGS YET. WE ARE GOING TO WIN SO MUCH!</div>';
            }
        } catch (err) {
            console.error('Fetch Winnings Fail:', err);
            historyList.innerHTML = `<div class="no-data">FAILED TO RETRIEVE THE TROPHY ROOM.</div>`;
        }
    }

    // Make loadWinningsHistory globally available
    window.loadWinningsHistory = loadWinningsHistory;

    async function loadRealNews() {
        newsFeed.innerHTML = '<div class="loader-placeholder">FETCHING INTELLIGENCE...</div>';
        try {
            // Aggregate RSS feeds
            let allItems = [];
            for (const url of AppState.rssFeeds) {
                const items = await window.SignalEngine.fetchNewsFromRSS(url);
                allItems = [...allItems, ...items];
            }

            // Shuffle or sort by date if available
            allItems = allItems.slice(0, 15); // Top 15

            const bullCount = document.getElementById('bull-count');
            const bearCount = document.getElementById('bear-count');
            const moodLabel = document.getElementById('mood-label');

            let bulls = 0, bears = 0;
            newsFeed.innerHTML = allItems.map(item => {
                const sentiment = window.SignalEngine.scoreText(item.title);
                if (sentiment > 5) bulls++;
                if (sentiment < -5) bears++;

                return `
                    <div class="news-item glass-panel">
                        <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
                        <div class="news-meta">
                            <span>SOURCE: PATRIOT INTEL</span>
                            <span class="${sentiment > 0 ? 'text-green' : (sentiment < 0 ? 'text-red' : '')}">SENTIMENT: ${sentiment > 0 ? '+' : ''}${sentiment}</span>
                        </div>
                    </div>
                `;
            }).join('');

            if (bullCount) bullCount.textContent = bulls;
            if (bearCount) bearCount.textContent = bears;
            
            // Adjust Mood Label
            if (moodLabel) {
                const diff = bulls - bears;
                moodLabel.textContent = diff > 5 ? 'EXTREME BULLISH' : (diff > 0 ? 'BULLISH' : (diff < -5 ? 'BEARISH' : 'NEUTRAL'));
            }

        } catch (err) {
            console.error("News Load Error:", err);
            newsFeed.innerHTML = '<div class="no-data">PATRIOT NEWS OFFLINE. CHECK CONNECTION.</div>';
        }
    }

    // Make loadRealNews globally available
    window.loadRealNews = loadRealNews;

    window.initTradingView = function(symbol, interval = 'D') {
        const container = document.getElementById('tradingview-widget');
        container.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = () => {
            let symbolMap = symbol;
            // Refined Mapping for Professional Intelligence
            if (symbol === 'CL=F' || symbol === 'USO') symbolMap = 'AMEX:USO';
            if (symbol === 'GC=F' || symbol === 'GLD') symbolMap = 'AMEX:GLD';
            if (symbol === 'SI=F') symbolMap = 'COMEX:SI1!';

            new TradingView.widget({
                "container_id": "tradingview-widget",
                "width": "100%",
                "height": "100%",
                "symbol": symbolMap.includes(':') ? symbolMap : (symbol.includes('USD') || symbol === 'BTC' ? `BINANCE:${symbol.replace('-','')}` : `NASDAQ:${symbol}`),
                "interval": interval,
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "hide_top_toolbar": false,
                "allow_symbol_change": true,
            });
        };
        document.body.appendChild(script);
    };

    window.changeChartInterval = function(interval) {
        AppState.currentChartInterval = interval;
        initTradingView(AppState.currentChartSymbol, interval);
        
        // Update active button state
        document.querySelectorAll('.chart-controls .sym-tab').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(interval === 'D' ? '1D' : (interval === 'W' ? '1W' : (interval === '240' ? '4H' : '1H')))) {
                btn.classList.add('active');
            }
        });
        
        if (typeof SoundEngine !== 'undefined') SoundEngine.play(600, 'triangle', 0.1);
    };

    const symTabs = document.querySelectorAll('#symbol-picker .sym-tab');
    symTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            symTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            AppState.currentChartSymbol = tab.dataset.symbol;
            initTradingView(AppState.currentChartSymbol, AppState.currentChartInterval);
            if (typeof SoundEngine !== 'undefined') SoundEngine.play(440, 'triangle', 0.1);
        });
    });

    // 10. Plans Modal Handler (FROM ORIGINAL - Now also accessible as view)
    const openPlansBtn = document.getElementById('open-plans-btn');
    if (openPlansBtn) {
        openPlansBtn.addEventListener('click', () => {
            // Check if we're using modal or view
            if (plansModal) {
                plansModal.style.display = 'flex';
                SoundEngine.play(800, 'square', 0.2);
            } else {
                showView('plans');
            }
        });
    }

    const closePlansBtn = document.getElementById('close-plans');
    if (closePlansBtn && plansModal) {
        closePlansBtn.addEventListener('click', () => {
            plansModal.style.display = 'none';
        });
    }

    if (plansModal) {
        window.onclick = (e) => {
            if (e.target === plansModal) plansModal.style.display = 'none';
        };
    }

    function updateCountdown() {
        const now = new Date();
        const target = new Date();
        target.setHours(23, 59, 59, 0); 
        const diff = target - now;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        document.getElementById('countdown-display').innerHTML = `<span class="digit">${h}</span>:<span class="digit">${m}</span>:<span class="digit">${s}</span>`;
    }

    function startApp() {
        SoundEngine.init();
        startMatrixTerminal();
        updateScanStatus();
        refreshDashboard();
        initTradingView(AppState.currentChartSymbol, AppState.currentChartInterval); 
        setInterval(refreshDashboard, 60000 * 5);
        AppState.countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Modal Entrance (FROM ORIGINAL)
    const riskCheck = document.getElementById('risk-check');
    const enterBtn = document.getElementById('enter-btn');

    riskCheck.addEventListener('change', () => {
        enterBtn.disabled = !riskCheck.checked;
        enterBtn.classList.toggle('disabled', !riskCheck.checked);
    });

    enterBtn.addEventListener('click', () => {
        if (!riskCheck.checked) return;
        AppState.riskAccepted = true;
        riskModal.style.display = 'none';
        appContainer.classList.remove('hidden');
        appContainer.classList.add('slide-up');
        startApp();
    });

    // Loading Sequence (FROM ORIGINAL - with responsive brick count)
    const wallGrid = document.getElementById('wall-bricks');
    // Responsive brick count based on screen width
    const brickCount = window.innerWidth < 768 ? 48 : 80;
    for (let i = 0; i < brickCount; i++) {
        const brick = document.createElement('div');
        brick.className = 'brick';
        wallGrid.appendChild(brick);
    }
    const bricks = document.querySelectorAll('.brick');
    let bIdx = 0;
    const buildInt = setInterval(() => {
        if (bIdx < bricks.length) bricks[bIdx++].classList.add('active');
        else {
            clearInterval(buildInt);
            document.getElementById('loading-text').classList.add('hidden');
            document.getElementById('secure-badge').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('loading-overlay').classList.add('slide-up');
                setTimeout(() => {
                    document.getElementById('loading-overlay').style.display = 'none';
                    AppState.isLoading = false;
                    riskModal.style.display = 'flex'; 
                }, 600);
            }, 1000);
        }
    }, 40);

    // Responsive Helpers (ADDED)
    function handleResize() {
        const width = window.innerWidth;

        // Adjust matrix lines based on screen size
        const terminal = document.getElementById('matrix-terminal');
        if (terminal) {
            const maxLines = width < 768 ? 6 : 8;
            while (terminal.children.length > maxLines) {
                terminal.removeChild(terminal.firstChild);
            }
        }
    }

    // Handle resize
    window.addEventListener('resize', handleResize);

    // Prevent zoom on double tap (mobile)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = 'none';

    // Patriot Functions: Reset the Wall & Navigation
    window.resetWall = function() {
        const overlay = document.getElementById('loading-overlay');
        const bricks = document.querySelectorAll('.brick');
        if (!overlay) return;

        // Confetti Burst
        createConfetti();

        // Reset Bricks
        bricks.forEach(b => b.classList.remove('active'));
        overlay.style.display = 'flex';
        overlay.classList.remove('slide-up');
        document.getElementById('loading-text').classList.remove('hidden');
        document.getElementById('secure-badge').classList.add('hidden');

        let bIdx = 0;
        const buildInt = setInterval(() => {
            if (bIdx < bricks.length) bricks[bIdx++].classList.add('active');
            else {
                clearInterval(buildInt);
                document.getElementById('loading-text').classList.add('hidden');
                document.getElementById('secure-badge').classList.remove('hidden');
                setTimeout(() => {
                    overlay.classList.add('slide-up');
                    setTimeout(() => { overlay.style.display = 'none'; }, 600);
                }, 1000);
            }
        }, 3000 / bricks.length);
    };

    window.handleStickyNav = function(view, anchor) {
        if (AppState.currentView !== view) {
            showView(view);
        }
        if (anchor) {
            setTimeout(() => {
                const el = document.getElementById(anchor);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    function createConfetti() {
        const colors = ['#FFD700', '#B22234', '#3C3B6E', '#FFFFFF'];
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDuration = (Math.random() * 3 + 2) + 's';
            c.style.opacity = Math.random();
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 5000);
        }
    }
});

// Service Worker Registration (for PWA) (ADDED)
    // Service Worker disabled for now (to avoid 404/MIME error)
    if ('serviceWorker' in navigator && false) {
        // ...
    }
