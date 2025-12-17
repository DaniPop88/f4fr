class LotteryValidator {
    constructor() {
        this.contestResults = this.loadResults();
    }

    loadResults() {
        const stored = localStorage.getItem('contestResults');
        return stored ? JSON.parse(stored) : {};
    }

    saveResults() {
        localStorage.setItem('contestResults', JSON.stringify(this.contestResults));
    }

    saveContestResult(contest, drawDate, winningNumbers) {
        const key = `${contest}_${drawDate}`;
        this.contestResults[key] = {
            contest:  contest,
            drawDate: drawDate,
            winningNumbers:  winningNumbers,
            savedAt: new Date().toISOString()
        };
        this.saveResults();
    }

    getContestResult(contest, drawDate) {
        const key = `${contest}_${drawDate}`;
        return this.contestResults[key];
    }

    getAllResults() {
        return Object.values(this.contestResults);
    }

    deleteResult(contest, drawDate) {
        const key = `${contest}_${drawDate}`;
        delete this.contestResults[key];
        this.saveResults();
    }

    matchNumbers(chosenNumbers, winningNumbers) {
        let matches = 0;
        const matchedNumbers = [];
        
        chosenNumbers.forEach(num => {
            if (winningNumbers.includes(num)) {
                matches++;
                matchedNumbers.push(num);
            }
        });
        
        return {
            count: matches,
            matchedNumbers: matchedNumbers
        };
    }

    getPrizeTier(matchCount) {
        switch(matchCount) {
            case 5:
                return { 
                    tier: 'GRAND PRIZE', 
                    color: 'gold', 
                    priority: 1,
                    badge: 'badge-gold'
                };
            case 4:
                return { 
                    tier: '2nd PRIZE', 
                    color: 'silver', 
                    priority: 2,
                    badge: 'badge-silver'
                };
            case 3:
                return { 
                    tier: '3rd PRIZE', 
                    color:  '#CD7F32', 
                    priority: 3,
                    badge: 'badge-bronze'
                };
            case 2:
                return { 
                    tier: 'CONSOLATION', 
                    color: 'green', 
                    priority: 4,
                    badge: 'badge-green'
                };
            default:
                return { 
                    tier: 'NO PRIZE', 
                    color: 'gray', 
                    priority: 5,
                    badge: ''
                };
        }
    }

    validateEntry(entry) {
        const result = this.getContestResult(entry.contest, entry.drawDate);
        
        if (! result) {
            return {
                validated: false,
                message: 'No winning numbers set for this contest'
            };
        }

        const matchResult = this.matchNumbers(entry.chosenNumbers, result.winningNumbers);
        const prizeTier = this.getPrizeTier(matchResult.count);

        return {
            validated: true,
            matches: matchResult.count,
            matchedNumbers: matchResult.matchedNumbers,
            prizeTier:  prizeTier,
            winningNumbers: result.winningNumbers
        };
    }

    validateAllEntries(entries) {
        return entries.map(entry => {
            const validation = this.validateEntry(entry);
            return {
                ...entry,
                validation: validation
            };
        });
    }

    getWinners(entries) {
        const validated = this.validateAllEntries(entries);
        return validated
            .filter(entry => entry. validation.validated && entry.validation.matches >= 2)
            .sort((a, b) => b.validation.matches - a.validation.matches);
    }

    getWinnersByContest(entries, contest) {
        const contestEntries = entries.filter(e => e.contest === contest);
        return this.getWinners(contestEntries);
    }

    getWinnersReport(entries) {
        const winners = this. getWinners(entries);
        const report = {
            grandPrize: winners.filter(w => w.validation.matches === 5),
            secondPrize: winners.filter(w => w.validation.matches === 4),
            thirdPrize: winners.filter(w => w.validation.matches === 3),
            consolation: winners.filter(w => w.validation.matches === 2),
            totalWinners: winners.length
        };
        return report;
    }
}

// Global instance
const validator = new LotteryValidator();