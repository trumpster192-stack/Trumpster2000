/**
 * ============================================================
 *  TRUMPSTER 2000 — app.js (Magnificent Edition)
 *  The Greatest Application Logic Ever Built.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. State & Constants
    const WATCHLIST = ['DJT', 'NVDA', 'TSLA', 'SPY', 'QQQ', 'BTC-USD', 'ETH-USD', 'AAPL'];
    let currentChartSymbol = 'DJT';

    // 3. Elements
    const signalsFeed = document.getElementById('signals-feed');
    const matrixTerminal = document.getElementById('matrix-terminal');
    const scanStatus = document.getElementById('scan-status');
    const newsFeed = document.getElementById('news-feed');
    const appContainer = document.getElementById('app');

    // 4. Matrix Intelligence Effect
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
        setInterval(() => {
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

    // 5. Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.dashboard-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            views.forEach(v => {
                v.classList.add('hidden');
                if (v.id === `view-${view}`) {
                    v.classList.remove('hidden');
                    v.classList.add('slide-up');
                }
            });

            if (view === 'chart') initTradingView(currentChartSymbol);
            if (view === 'speech') loadRealNews();
            if (view === 'winning') loadWinningsHistory();
        });
    });

    // 6. Signal Engine Integration
    async function refreshDashboard() {
        try {
            const signals = await window.SignalEngine.scanWatchlist(WATCHLIST);
            renderSignals(signals);
            updateHeatmap(signals);
            updateSentiment(signals);
            persistSignals(signals);
        } catch (err) {
            console.error('Telemetery Fail:', err);
        }
    }

    function renderSignals(signals) {
        signalsFeed.innerHTML = signals.map((sig, i) => `
            <div class="signal-card glass-panel gold-border slide-up" style="animation-delay: ${i * 0.1}s">
                <div class="signal-header">
                    <div class="symbol-info">
                        <span class="symbol-box">${sig.action}</span>
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
                <p class="signal-message">${sig.message}</p>
            </div>
        `).join('');
    }

    function updateHeatmap(signals) {
        const heatmap = document.getElementById('heatmap-viz');
        heatmap.innerHTML = signals.map(sig => {
            const type = sig.changePct > 2 ? 'heat-positive' : (sig.changePct < -2 ? 'heat-negative' : 'heat-neutral');
            const size = Math.min(100, Math.max(40, Math.abs(sig.changePct) * 10 + 60));
            return `<div class="heat-cell ${type}" style="width: ${size}px; height: 60px;">
                <span>${sig.symbol}</span>
                <span style="font-size: 0.6rem">${sig.changePct}%</span>
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

    // 7. News & Sentiment logic
    async function loadRealNews() {
        newsFeed.innerHTML = '<div class="loader-placeholder">FETCHING INTELLIGENCE...</div>';
        try {
            const news = await window.SignalEngine.fetchNews();
            const bullCount = document.getElementById('bull-count');
            const bearCount = document.getElementById('bear-count');
            
            let bulls = 0, bears = 0;
            newsFeed.innerHTML = news.map(item => {
                if (item.sentiment > 0.1) bulls++;
                if (item.sentiment < -0.1) bears++;
                return `
                    <div class="news-item glass-panel">
                        <a href="${item.url}" target="_blank" class="news-title">${item.title}</a>
                        <div class="news-meta">
                            <span>RELEVANCE: ${Math.round(item.relevance * 100)}%</span>
                            <span class="${item.sentiment > 0 ? 'text-green' : 'text-red'}">SENTIMENT: ${item.sentiment}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            bullCount.textContent = bulls;
            bearCount.textContent = bears;
        } catch (err) {
            newsFeed.innerHTML = '<div class="no-data">NEWS FEED OFFLINE.</div>';
        }
    }

    // 8. Chart Logic
    window.initTradingView = function(symbol) {
        const container = document.getElementById('tradingview-widget');
        container.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = () => {
            new TradingView.widget({
                "container_id": "tradingview-widget",
                "width": "100%",
                "height": "100%",
                "symbol": symbol.includes('USD') ? `CRYPTO:${symbol.replace('-','')}` : `NASDAQ:${symbol}`,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "allow_symbol_change": true,
            });
        };
        document.body.appendChild(script);
    };

    const symTabs = document.querySelectorAll('.sym-tab');
    symTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            symTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentChartSymbol = tab.dataset.symbol;
            initTradingView(currentChartSymbol);
        });
    });

    // 9. Countdown
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

    // 10. Initialization
    function startApp() {
        startMatrixTerminal();
        updateScanStatus();
        refreshDashboard();
        setInterval(refreshDashboard, 60000 * 5);
        setInterval(updateCountdown, 1000);
    }

    // Modal Entrance
    const riskCheck = document.getElementById('risk-check');
    const enterBtn = document.getElementById('enter-btn');
    const riskModal = document.getElementById('risk-modal');

    riskCheck.addEventListener('change', () => {
        enterBtn.classList.toggle('disabled', !riskCheck.checked);
    });

    enterBtn.addEventListener('click', () => {
        if (!riskCheck.checked) return;
        riskModal.style.display = 'none';
        appContainer.classList.remove('hidden');
        appContainer.classList.add('slide-up');
        startApp();
    });

    // Wall Animation
    const wallGrid = document.getElementById('wall-bricks');
    for (let i = 0; i < 40; i++) {
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
                    riskModal.style.display = 'flex';
                }, 600);
            }, 1000);
        }
    }, 50);
});
