/**
 * ============================================================
 *  TRUMPSTER 2000 — app.js (Real Data Intelligence Edition)
 *  The Greatest Application Logic Ever Built.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Loading Wall Sequence
    const wallGrid = document.getElementById('wall-bricks');
    const loadingOverlay = document.getElementById('loading-overlay');
    const appContainer = document.getElementById('app');
    const secureBadge = document.getElementById('secure-badge');
    const loadingText = document.getElementById('loading-text');

    const TOTAL_BRICKS = 60;
    for (let i = 0; i < TOTAL_BRICKS; i++) {
        const brick = document.createElement('div');
        brick.className = 'brick';
        wallGrid.appendChild(brick);
    }

    const bricks = document.querySelectorAll('.brick');
    let brickIndex = 0;

    const buildWall = setInterval(() => {
        if (brickIndex < bricks.length) {
            bricks[brickIndex].classList.add('active');
            brickIndex++;
        } else {
            clearInterval(buildWall);
            loadingText.classList.add('hidden');
            secureBadge.classList.replace('hidden', 'slide-up');
            
            setTimeout(() => {
                loadingOverlay.classList.add('slide-up');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    checkRiskAcknowledgment();
                }, 600);
            }, 1000);
        }
    }, 40);

    // 3. Tab Switching Intelligence
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.dashboard-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetViewId = `view-${item.dataset.view}`;
            
            // Switch tabs visual
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Switch views visual
            views.forEach(section => {
                section.classList.add('hidden');
                if (section.id === targetViewId) {
                    section.classList.remove('hidden');
                    section.classList.add('slide-up');
                }
            });

            // Special logic for View-Chart
            if (item.dataset.view === 'chart') {
                loadTradingViewWidget();
            }

            // Special logic for View-Winning
            if (item.dataset.view === 'winning') {
                loadWinningsHistory();
            }
        });
    });

    // 4. Signal Engine Integration (Real Data)
    const WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'SPY', 'QQQ', 'DJT', 'BTC-USD'];
    const signalsFeed = document.getElementById('signals-feed');

    async function loadRealSignals() {
        signalsFeed.innerHTML = '<div class="loader-placeholder">SCANNING MARKETS...</div>';
        try {
            const signals = await window.SignalEngine.scanWatchlist(WATCHLIST);
            renderSignals(signals);
            updateHeatmap(signals);
            updateSentiment(signals);
            
            // Persist Strong Signals to Supabase if connected
            if (window.supabaseClient) {
                const strongSignals = signals.filter(s => s.action.includes('STRONG'));
                for (const sig of strongSignals) {
                    await window.supabaseClient.from('signals_history').insert([{
                        symbol: sig.symbol,
                        action: sig.action,
                        price: sig.price,
                        confidence: sig.confidence,
                        change_pct: sig.changePct,
                        message: sig.message
                    }]);
                }
            }
        } catch (err) {
            console.error('Signal Scan Fail:', err);
            signalsFeed.innerHTML = '<div class="no-data">WHATEVER HAPPENED TO THE CONNECTION? SAD!</div>';
        }
    }

    async function loadWinningsHistory() {
        const historyList = document.getElementById('win-history');
        if (!window.supabaseClient) {
            historyList.innerHTML = '<div class="no-data">OFFLINE MODE: NO SUPABASE CONNECTED.</div>';
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('winnings')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;

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
                historyList.innerHTML = '<div class="no-data">NO WINNINGS YET. WE ARE GOING TO WIN SO MUCH YOU GET BORED OF WINNING!</div>';
            }
        } catch (err) {
            console.error('Fetch Winnings Fail:', err);
            historyList.innerHTML = '<div class="no-data">FAILED TO RETRIEVE THE TROPHY ROOM.</div>';
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

    // 5. Heatmap Sync
    function updateHeatmap(signals) {
        const heatmap = document.getElementById('heatmap-viz');
        heatmap.innerHTML = signals.map(sig => {
            const type = sig.changePct > 2 ? 'heat-positive' : (sig.changePct < -2 ? 'heat-negative' : 'heat-neutral');
            const size = Math.abs(sig.changePct) * 10 + 60;
            return `
              <div class="heat-cell ${type}" style="width: ${size}px; height: 60px;">
                <div class="sym">${sig.symbol}</div>
                <div class="perf">${sig.changePct >= 0 ? '+' : ''}${sig.changePct}%</div>
              </div>
            `;
        }).join('');
    }

    // 6. Sentiment Hub logic
    function updateSentiment(signals) {
        const needle = document.getElementById('sentiment-needle');
        const avgComposite = signals.reduce((sum, s) => sum + s.composite, 0) / signals.length;
        // Map composite -100..100 to rotate -90 to 90
        const rotation = (avgComposite / 100) * 90;
        needle.style.transform = `rotate(${rotation}deg)`;
    }

    // 7. TradingView Widget Loader
    function loadTradingViewWidget() {
        const widgetContainer = document.getElementById('tradingview-widget');
        if (widgetContainer.innerHTML !== '') return; // Already loaded

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = () => {
            new TradingView.widget({
                "width": "100%",
                "height": 400,
                "symbol": "NASDAQ:AAPL",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview-widget"
            });
        };
        document.body.appendChild(script);
    }

    // 8. Global Updates
    function startLiveTelemetry() {
        loadRealSignals();
        updateCountdown();
        setInterval(updateCountdown, 1000);
        setInterval(loadRealSignals, 60000 * 5); // Scan every 5 mins to respect AV quota
    }

    function updateCountdown() {
        const now = new Date();
        const target = new Date();
        target.setHours(23, 59, 59, 0); 
        const diff = target - now;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        const display = document.getElementById('countdown-display');
        display.innerHTML = `<span class="digit">${h}</span>:<span class="digit">${m}</span>:<span class="digit">${s}</span>`;
    }

    // 9. Enter Sequence logic
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
        startLiveTelemetry();
    });

    function checkRiskAcknowledgment() {
        riskModal.style.display = 'flex';
    }
});
