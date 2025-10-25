// Chart Management
class TradingCharts {
    constructor() {
        this.chart = null;
        this.currentSymbol = 'BTCUSDT';
        this.currentTimeframe = '1h';
        this.init();
    }

    init() {
        this.createChart();
        this.loadChartData();
    }

    createChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(24),
                datasets: [{
                    label: 'BTC/USDT',
                    data: this.generatePriceData(24, 35000, 500),
                    borderColor: '#3366ff',
                    backgroundColor: 'rgba(51, 102, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#3366ff',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ccc'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ccc',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    generateTimeLabels(count) {
        const labels = [];
        const now = new Date();
        
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
            labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        
        return labels;
    }

    generatePriceData(count, basePrice, volatility) {
        const data = [];
        let price = basePrice;
        
        for (let i = 0; i < count; i++) {
            // Random walk with some volatility
            const change = (Math.random() - 0.5) * volatility;
            price += change;
            data.push(price);
        }
        
        return data;
    }

    async loadChartData() {
        // Simulate loading chart data
        // In a real app, this would fetch from your backend API
        this.updateChartData();
        
        // Update chart data periodically
        setInterval(() => {
            this.updateChartData();
        }, 10000); // Update every 10 seconds
    }

    updateChartData() {
        if (!this.chart) return;

        // Add new data point and remove oldest
        const currentData = this.chart.data.datasets[0].data;
        const lastPrice = currentData[currentData.length - 1];
        const newPrice = lastPrice + (Math.random() - 0.5) * 100;
        
        // Update labels (shift and add new time)
        const now = new Date();
        const newTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        this.chart.data.labels.push(newTime);
        this.chart.data.labels.shift();
        
        this.chart.data.datasets[0].data.push(newPrice);
        this.chart.data.datasets[0].data.shift();
        
        this.chart.update('none');
    }

    changeSymbol(symbol) {
        this.currentSymbol = symbol;
        this.chart.data.datasets[0].label = symbol;
        this.updateChartData();
    }

    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        // Adjust chart data based on timeframe
        this.updateChartData();
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tradingCharts = new TradingCharts();
});