// Market Data Management
class MarketData {
    constructor() {
        this.prices = {};
        this.symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'];
        this.updateInterval = 5000; // 5 seconds
    }

    async initialize() {
        await this.fetchAllPrices();
        this.startAutoUpdate();
    }

    async fetchAllPrices() {
        for (const symbol of this.symbols) {
            await this.fetchPrice(symbol);
        }
    }

    async fetchPrice(symbol) {
        try {
            // Simulate API call - replace with actual Binance API
            const mockPrice = {
                BTCUSDT: 35000 + Math.random() * 1000,
                ETHUSDT: 2000 + Math.random() * 100,
                ADAUSDT: 0.5 + Math.random() * 0.1
            };

            const price = mockPrice[symbol] || 0;
            const change = (Math.random() * 4 - 2); // -2% to +2%

            this.prices[symbol] = {
                price: price,
                change: change,
                lastUpdated: new Date()
            };

            this.updateUI(symbol, price, change);

        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
        }
    }

    updateUI(symbol, price, change) {
        // Update the UI with new price data
        const elements = {
            'BTCUSDT': { price: '.btc-price', change: '.btc-change' },
            'ETHUSDT': { price: '.eth-price', change: '.eth-change' },
            'ADAUSDT': { price: '.ada-price', change: '.ada-change' }
        };

        const element = elements[symbol];
        if (element) {
            const priceEl = document.querySelector(element.price);
            const changeEl = document.querySelector(element.change);

            if (priceEl) {
                priceEl.textContent = `$${price.toFixed(symbol === 'ADAUSDT' ? 4 : 2)}`;
            }

            if (changeEl) {
                changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                changeEl.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
            }
        }
    }

    startAutoUpdate() {
        setInterval(() => {
            this.fetchAllPrices();
        }, this.updateInterval);
    }

    getPrice(symbol) {
        return this.prices[symbol] || null;
    }

    getAllPrices() {
        return this.prices;
    }
}

// Initialize market data
const marketData = new MarketData();
marketData.initialize();