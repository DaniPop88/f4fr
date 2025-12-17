let autoRefreshInterval = null;

async function initDashboard() {
    showLoading(true);
    hideError();
    
    try {
        await dataFetcher.fetchData();
        updateDashboard();
        updateLastUpdateTime();
        showLoading(false);
    } catch (error) {
        showError('Failed to load data:  ' + error.message);
        showLoading(false);
    }
}

function updateDashboard() {
    const stats = dataFetcher.getStatistics();
    
    // Update stats cards
    document.getElementById('totalEntries').textContent = stats.totalEntries;
    document.getElementById('uniqueContests').textContent = stats.uniqueContests;
    document.getElementById('uniqueDrawDates').textContent = stats.uniqueDrawDates;
    document.getElementById('pendingEntries').textContent = stats.pendingEntries;
    
    // Update contest breakdown
    updateBreakdown('contestBreakdown', stats.contestBreakdown, 'Contest');
    
    // Update date breakdown
    updateBreakdown('dateBreakdown', stats.dateBreakdown, 'Draw Date');
    
    // Update recent entries table
    updateRecentEntriesTable();
}

function updateBreakdown(elementId, data, labelPrefix) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    Object.entries(data).sort((a, b) => b[1] - a[1]).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <div class="label">${labelPrefix} ${key}</div>
            <div class="value">${value}</div>
        `;
        container.appendChild(item);
    });
}

function updateRecentEntriesTable() {
    const tbody = document.getElementById('recentEntriesBody');
    tbody.innerHTML = '';
    
    const entries = dataFetcher.getAllEntries().slice(0, 10);
    
    entries.forEach(entry => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${entry.registrationDateTime}</td>
            <td>${entry.gameId}</td>
            <td>${entry.whatsapp}</td>
            <td><strong>${entry.chosenNumbers.join(', ')}</strong></td>
            <td>${entry.drawDate}</td>
            <td><span class="badge badge-primary">${entry.contest}</span></td>
            <td>${entry.ticketNumber}</td>
            <td><span class="badge badge-pending">${entry.status}</span></td>
        `;
    });
}

function showLoading(show) {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.style. display = show ? 'block' : 'none';
    }
}

function hideError() {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
}

function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
}

function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate && dataFetcher.lastFetchTime) {
        lastUpdate.textContent = dataFetcher.lastFetchTime.toLocaleString('pt-BR');
    }
}

function setupAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(async () => {
        try {
            await dataFetcher.fetchData();
            updateDashboard();
            updateLastUpdateTime();
        } catch (error) {
            console.error('Auto-refresh failed:', error);
        }
    }, 60000); // 60 seconds
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupAutoRefresh();
    
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', initDashboard);
    }
});