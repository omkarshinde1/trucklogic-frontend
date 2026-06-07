import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct functional import standard method

const DownloadReportButton = ({ filteredTrips, truckInfo, reportTitle }) => {

    const generateBulkReportPDF = () => {
        console.log("REAL DATABASE TRIPS DATA:", filteredTrips);
        // Initialization
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // --- DEV METRICS LOGGING FOR VERIFICATION ---
        console.log("Active Filtering System Payload Matrix:", filteredTrips);

        // 1. FINANCIAL SUMMARY MATRIX CALCULATION (BULLETPROOF AGGREGATION)
        const totalTripsCount = filteredTrips.length;
        const totalFreight = filteredTrips.reduce((sum, t) => sum + (Number(t.freightAmount) || 0), 0);
        
        // Dynamic Multi-fallback evaluation logic for accurate sub-document operations
        const totalExpenses = filteredTrips.reduce((sum, trip) => {
            let tripExpenseSum = 0;
            
            if (trip.expenses && Array.isArray(trip.expenses)) {
                // CASE A: It is an array of objects -> [{amount: 500}, {amount: 200}] kiva primitive numbers list
                tripExpenseSum = trip.expenses.reduce((subSum, exp) => {
                    const val = (exp && typeof exp === 'object') 
                        ? (Number(exp.amount) || Number(exp.price) || 0) 
                        : (Number(exp) || 0);
                    return subSum + val;
                }, 0);
            } else if (Number(trip.totalExpenses)) {
                // CASE B: Pre-aggregated database parameter fallback
                tripExpenseSum = Number(trip.totalExpenses);
            } else if (Number(trip.expense)) {
                // CASE C: Singular string metrics fallback
                tripExpenseSum = Number(trip.expense);
            }
            
            return sum + tripExpenseSum;
        }, 0);

        const netProfit = totalFreight - totalExpenses;

        // 2. PREMIUM ENTERPRISE BLOCK HEADER
        doc.setFillColor(15, 23, 42); // #0f172a Deep Slate
        doc.rect(0, 0, 210, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold'); 
        doc.setFontSize(22);
        doc.text('TRUCKLOGIC ENTERPRISE', 15, 18);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('Automated Commercial Fleet Statements & Operational Audit', 15, 25);

        // REPORT METADATA (Right Aligned)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${reportTitle.toUpperCase()}`, 130, 18);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 130, 24);
        doc.text(`Asset ID: ${truckInfo?.truckNumber || 'All Fleet'}`, 130, 29);

        // 3. STATS DASHBOARD HIGHLIGHT CARDS
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252); 
        doc.rect(15, 55, 180, 22, 'FD');

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL JOURNEYS', 20, 62);
        doc.text('GROSS FREIGHT (BHADA)', 52, 62);
        doc.text('TOTAL EXPENSES', 110, 62);
        doc.text('NET PROFIT LOG', 158, 62);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.text(`${totalTripsCount}`, 20, 71);
        doc.setTextColor(16, 185, 129); // Income Green
        doc.text(`Rs.${totalFreight.toLocaleString('en-IN')}`, 52, 71);
        doc.setTextColor(239, 68, 68);  // Expense Red
        doc.text(`Rs.${totalExpenses.toLocaleString('en-IN')}`, 110, 71);
        doc.setTextColor(59, 130, 246);  // Profit Blue
        doc.text(`Rs.${netProfit.toLocaleString('en-IN')}`, 158, 71);

        // 4. HISTORICAL DYNAMIC LEDGER TABLE (ACCURATE PIPELINE CELL MATRIX MAPPING)
        const tableBody = filteredTrips.map((trip, idx) => {
            let singleTripExpenses = 0;
            
            if (trip.expenses && Array.isArray(trip.expenses)) {
                singleTripExpenses = trip.expenses.reduce((subSum, exp) => {
                    const val = (exp && typeof exp === 'object') 
                        ? (Number(exp.amount) || Number(exp.price) || 0) 
                        : (Number(exp) || 0);
                    return subSum + val;
                }, 0);
            } else {
                singleTripExpenses = Number(trip.totalExpenses) || Number(trip.expense) || 0;
            }

            const freight = Number(trip.freightAmount) || 0;
            const netProfitLog = freight - singleTripExpenses;

            return [
                idx + 1,
                new Date(trip.startDate).toLocaleDateString('en-IN'), // Clean formatting
                `${trip.source} to ${trip.destination}`,
                trip.status.toUpperCase(),
                `Rs.${freight.toLocaleString('en-IN')}`,
                `Rs.${singleTripExpenses.toLocaleString('en-IN')}`,
                `Rs.${netProfitLog.toLocaleString('en-IN')}`
            ];
        });

        autoTable(doc, {
            startY: 85,
            head: [['#', 'DATE', 'ROUTE MANIFEST', 'STATUS', 'FREIGHT', 'EXPENSES', 'NET PROFIT']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42], fontSize: 9, fontStyle: 'bold', font: 'helvetica' }, 
            bodyStyles: { fontSize: 9, textColor: [51, 65, 85], font: 'helvetica' },
            columnStyles: {
                0: { width: 10 },
                1: { width: 24 },
                2: { width: 52 },
                3: { width: 22 },
                4: { width: 24 },
                5: { width: 24 },
                6: { width: 24 }
            },
            margin: { left: 15, right: 15 }
        });

        // 5. SECURE PRODUCTION FOOTER
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 160;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('This audit statement aggregates dynamic platform telemetry logs securely directly from MongoDB Atlas cloud clusters.', 15, finalY);
        doc.text('TruckLogic Ledger Verification Copy Execution Code.', 15, finalY + 4);

        // 6. SAVE TRIGGER DOWNLOAD
        doc.save(`FleetReport-${reportTitle.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.pdf`);
    };

    return (
        <button 
            onClick={generateBulkReportPDF}
            disabled={filteredTrips.length === 0}
            style={{
                padding: '12px 20px',
                backgroundColor: filteredTrips.length === 0 ? '#cbd5e1' : '#3b82f6', 
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: filteredTrips.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: filteredTrips.length === 0 ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
        >
            📥 Download Statement PDF ({filteredTrips.length})
        </button>
    );
};

export default DownloadReportButton;