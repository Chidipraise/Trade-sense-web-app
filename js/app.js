// Main Application JavaScript with API Integration
class TradeSenseApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.botStatus = 'stopped';
        this.apiKey = localStorage.getItem('apiKey');
        this.apiSecret = localStorage.getItem('apiSecret');
        this.useTestnet = localStorage.getItem('useTestnet') !== 'false';
        this.init();
    }

    async init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadMarketData();
        this.updateBotStatus();
        
        // Initialize trading bot with saved API keys
        if (this.apiKey && this.apiSecret) {
            await this.initializeTradingBot();
        }
    }

    async initializeTradingBot() {
        try {
            const result = await window.tradingBot.initialize(
                this.apiKey, 
                this.apiSecret, 
                this.useTestnet
            );
            
            if (result.success) {
                this.showNotification('Trading bot initialized successfully!', 'success');
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            this.showNotification('Failed to initialize trading bot: ' + error.message, 'error');
        }
    }

    // ... (keep previous methods, but update the trading methods)

    async startTradingBot() {
        try {
            if (!this.apiKey || !this.apiSecret) {
                this.showNotification('Please configure API keys first!', 'error');
                this.showSection('settings');
                return;
            }

            const startBtn = document.getElementById('startBot');
            startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
            startBtn.disabled = true;

            const result = await window.tradingBot.start();
            
            if (result.success) {
                this.botStatus = 'running';
                this.updateBotStatus();
                this.showNotification(result.message, 'success');
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            this.showNotification('Failed to start trading bot: ' + error.message, 'error');
            this.updateBotStatus();
        }
    }

    async executeManualTrade() {
        const form = document.getElementById('tradeForm');
        const symbol = form.querySelector('select').value.replace('/', '');
        const amount = form.querySelector('input[type="number"]').value;
        const tradeType = document.querySelector('.btn-group .btn.active').textContent;
        
        try {
            if (!this.apiKey || !this.apiSecret) {
                this.showNotification('Please configure API keys first!', 'error');
                return;
            }

            this.showNotification(`Executing ${tradeType} order...`, 'info');
            
            const trade = await window.tradingBot.executeManualTrade(symbol, tradeType, amount);
            
            this.showNotification(
                `${tradeType} order executed successfully at $${trade.price}`,
                'success'
            );
            
        } catch (error) {
            this.showNotification(`Trade execution failed: ${error.message}`, 'error');
        }
    }

    // Update settings form handler
    setupSettingsForm() {
        const settingsForm = document.querySelector('.settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const apiKey = settingsForm.querySelector('input[type="password"]:nth-child(2)').value;
                const apiSecret = settingsForm.querySelector('input[type="password"]:nth-child(3)').value;
                const useTestnet = settingsForm.querySelector('select').value === 'Binance Testnet';
                
                await this.saveApiSettings(apiKey, apiSecret, useTestnet);
            });

            // Test connection button
            const testBtn = settingsForm.querySelector('.btn-outline');
            if (testBtn) {
                testBtn.addEventListener('click', async () => {
                    await this.testApiConnection();
                });
            }
        }
    }

    async saveApiSettings(apiKey, apiSecret, useTestnet) {
        try {
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('apiSecret', apiSecret);
            localStorage.setItem('useTestnet', useTestnet);
            
            this.apiKey = apiKey;
            this.apiSecret = apiSecret;
            this.useTestnet = useTestnet;
            
            await this.initializeTradingBot();
            this.showNotification('API settings saved successfully!', 'success');
            
        } catch (error) {
            this.showNotification('Failed to save API settings: ' + error.message, 'error');
        }
    }

    async testApiConnection() {
        try {
            if (!this.apiKey || !this.apiSecret) {
                this.showNotification('Please enter API keys first!', 'error');
                return;
            }

            this.showNotification('Testing connection...', 'info');
            
            const result = await window.tradingBot.testConnection();
            
            if (result.success) {
                this.showNotification('✅ Connection successful! API keys are valid.', 'success');
            } else {
                this.showNotification('❌ Connection failed: ' + result.message, 'error');
            }
            
        } catch (error) {
            this.showNotification('Connection test failed: ' + error.message, 'error');
        }
    }
}