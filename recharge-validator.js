const RECHARGE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1c6gnCngs2wFOvVayd5XpM9D3LOlKUxtSjl7gfszXcMg/export?format=csv&gid=0';

class RechargeValidator {
    constructor() {
        this.recharges = [];
        this.validatedEntries = [];
        this.lastFetchTime = null;
    }

    async fetchRechargeData() {
        try {
            const response = await fetch(RECHARGE_SHEET_CSV_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch recharge data from Google Sheets');
            }
            const csvText = await response.text();
            this.parseRechargeCSV(csvText);
            this.lastFetchTime = new Date();
            return this.recharges;
        } catch (error) {
            console.error('Error fetching recharge data:', error);
            throw error;
        }
    }

    parseRechargeCSV(csvText) {
        const lines = csvText.split('\n');
        const recharges = [];
        
        // Skip header (line 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = this.parseCSVLine(line);
            if (values.length < 9) continue;
            
            // Column mapping from Chinese CSV:
            // 0: 会员id (gameId)
            // 1: 订单号 (rechargeId) 
            // 5: 记录时间 (rechargeTime)
            // 6: 账变类型 (type, should be "充值")
            // 8: 变化金额 (amount)
            
            // Only process recharge records (充值)
            if (values[6] !== '充值') continue;
            
            const recharge = {
                gameId: values[0],
                rechargeId: values[1],
                rechargeTime: values[5], // Format: 2025-12-15 23:59:27.185
                rechargeAmount: parseFloat(values[8]),
                rechargeStatus: 'VALID', // Default, can be changed if needed
                rechargeSource: values[7] || '三方' // 三方 = third party
            };
            
            // Parse datetime to comparable format
            recharge.rechargeTimeObj = this.parseBrazilTime(recharge.rechargeTime);
            
            recharges.push(recharge);
        }
        
        this.recharges = recharges;
        return recharges;
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    parseBrazilTime(timeString) {
        // Format: "2025-12-15 23:59:27.185"
        // Convert to Date object
        try {
            return new Date(timeString.replace(' ', 'T') + '-03:00');
        } catch (e) {
            console.error('Failed to parse time:', timeString);
            return null;
        }
    }

    parseTicketTime(timeString) {
        // Assuming ticket time is in format similar to recharge time
        // Adjust this based on actual ticket time format from your Google Sheet
        try {
            // If format is "15/12/2025 23:59:27", convert it
            if (timeString.includes('/')) {
                const parts = timeString.split(' ');
                const dateParts = parts[0].split('/');
                const timePart = parts[1] || '00:00:00';
                // Convert DD/MM/YYYY to YYYY-MM-DD
                const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                return new Date(`${isoDate}T${timePart}-03:00`);
            }
            // If already in YYYY-MM-DD format
            return new Date(timeString.replace(' ', 'T') + '-03:00');
        } catch (e) {
            console.error('Failed to parse ticket time:', timeString);
            return null;
        }
    }

    validateEntries(entries) {
        if (this.recharges.length === 0) {
            console.warn('No recharge data loaded. Upload recharge CSV first.');
            return entries.map(entry => ({
                ...entry,
                validity: 'UNKNOWN',
                invalidReasonCode: 'NO_RECHARGE_DATA',
                boundRechargeId: null
            }));
        }

        // Group by gameId
        const entriesByGameId = {};
        entries.forEach(entry => {
            if (!entriesByGameId[entry.gameId]) {
                entriesByGameId[entry.gameId] = [];
            }
            entriesByGameId[entry.gameId].push(entry);
        });

        const rechargesByGameId = {};
        this.recharges.forEach(recharge => {
            if (!rechargesByGameId[recharge.gameId]) {
                rechargesByGameId[recharge.gameId] = [];
            }
            rechargesByGameId[recharge.gameId].push(recharge);
        });

        const validatedEntries = [];

        // Process each gameId
        Object.keys(entriesByGameId).forEach(gameId => {
            const gameEntries = entriesByGameId[gameId];
            const gameRecharges = rechargesByGameId[gameId] || [];

            // Sort recharges by time
            gameRecharges.sort((a, b) => 
                (a.rechargeTimeObj?.getTime() || 0) - (b.rechargeTimeObj?.getTime() || 0)
            );

            // Sort tickets by registration time
            gameEntries.forEach(entry => {
                entry.ticketTimeObj = this.parseTicketTime(entry.registrationDateTime);
            });
            
            gameEntries.sort((a, b) => 
                (a.ticketTimeObj?.getTime() || 0) - (b.ticketTimeObj?.getTime() || 0)
            );

            // Binding algorithm: timeline-based
            const consumedRecharges = new Set();
            
            gameEntries.forEach(ticket => {
                let boundRecharge = null;
                let validity = 'INVALID';
                let invalidReasonCode = 'NO_RECHARGE_BEFORE_TICKET';

                // Find the first unconsumed recharge that happened BEFORE this ticket
                for (let recharge of gameRecharges) {
                    if (consumedRecharges.has(recharge.rechargeId)) {
                        continue; // Already used
                    }
                    
                    // Check if recharge happened before ticket
                    if (recharge.rechargeTimeObj && ticket.ticketTimeObj &&
                        recharge.rechargeTimeObj <= ticket.ticketTimeObj) {
                        boundRecharge = recharge;
                        break;
                    }
                }

                if (boundRecharge) {
                    // Check if recharge is valid
                    if (boundRecharge.rechargeStatus === 'VALID') {
                        validity = 'VALID';
                        invalidReasonCode = null;
                        consumedRecharges.add(boundRecharge.rechargeId);
                    } else {
                        validity = 'INVALID';
                        invalidReasonCode = 'RECHARGE_INVALIDATED';
                    }
                } else {
                    // Check if there's any recharge after this ticket (shouldn't bind)
                    const hasRechargeAfter = gameRecharges.some(r => 
                        r.rechargeTimeObj && ticket.ticketTimeObj &&
                        r.rechargeTimeObj > ticket.ticketTimeObj
                    );
                    
                    if (hasRechargeAfter) {
                        invalidReasonCode = 'NO_RECHARGE_BEFORE_TICKET';
                    }
                }

                // Check for cutoff shift (recharge before 20:00, ticket after 20:00)
                let cutoffFlag = false;
                if (boundRecharge && boundRecharge.rechargeTimeObj && ticket.ticketTimeObj) {
                    const rechargeHour = boundRecharge.rechargeTimeObj.getHours();
                    const rechargeMinute = boundRecharge.rechargeTimeObj.getMinutes();
                    const ticketHour = ticket.ticketTimeObj.getHours();
                    const ticketMinute = ticket.ticketTimeObj.getMinutes();
                    
                    const rechargeBeforeCutoff = (rechargeHour < 20) || (rechargeHour === 20 && rechargeMinute === 0);
                    const ticketAfterCutoff = (ticketHour > 20) || (ticketHour === 20 && ticketMinute > 0);
                    
                    if (rechargeBeforeCutoff && ticketAfterCutoff) {
                        cutoffFlag = true;
                    }
                }

                validatedEntries.push({
                    ...ticket,
                    validity: validity,
                    invalidReasonCode: invalidReasonCode,
                    boundRechargeId: boundRecharge?.rechargeId || null,
                    boundRechargeTime: boundRecharge?.rechargeTime || null,
                    boundRechargeAmount: boundRecharge?.rechargeAmount || null,
                    cutoffFlag: cutoffFlag
                });
            });
        });

        this.validatedEntries = validatedEntries;
        return validatedEntries;
    }

    getReasonCodeText(code) {
        const reasons = {
            'NO_RECHARGE_DATA': 'No recharge data uploaded',
            'NO_RECHARGE_BEFORE_TICKET': 'No recharge found before this ticket',
            'RECHARGE_ALREADY_USED': 'Recharge was already used by another ticket',
            'RECHARGE_INVALIDATED': 'Bound recharge was invalidated',
            'RECHARGE_ID_DUPLICATE': 'Recharge ID is duplicated in system'
        };
        return reasons[code] || 'Unknown reason';
    }

    getStatistics() {
        const validCount = this.validatedEntries.filter(e => e.validity === 'VALID').length;
        const invalidCount = this.validatedEntries.filter(e => e.validity === 'INVALID').length;
        const unknownCount = this.validatedEntries.filter(e => e.validity === 'UNKNOWN').length;
        const cutoffFlagCount = this.validatedEntries.filter(e => e.cutoffFlag).length;

        const reasonCounts = {};
        this.validatedEntries.forEach(e => {
            if (e.invalidReasonCode) {
                reasonCounts[e.invalidReasonCode] = (reasonCounts[e.invalidReasonCode] || 0) + 1;
            }
        });

        return {
            totalRecharges: this.recharges.length,
            validTickets: validCount,
            invalidTickets: invalidCount,
            unknownTickets: unknownCount,
            cutoffShiftCases: cutoffFlagCount,
            invalidReasons: reasonCounts
        };
    }

    getValidatedEntries() {
        return this.validatedEntries;
    }

    getRecharges() {
        return this.recharges;
    }
}

// Global instance
const rechargeValidator = new RechargeValidator();
