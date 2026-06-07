import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // 👈 Direct functional import standard method

const DownloadReportButton = ({ filteredTrips, truckInfo, reportTitle }) => {

    const generateBulkReportPDF = () => {
        // Initialization
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // 1. FINANCIAL SUMMARY MATRIX CALCULATION
        const totalTripsCount = filteredTrips.length;
        const totalFreight = filteredTrips.reduce((sum, t) => sum + (Number(t.freightAmount) || 0), 0);
        const totalExpenses = filteredTrips.reduce((sum, t) => sum + (Number(t.totalExpenses) || 0), 0);
        const netProfit = totalFreight - totalExpenses;

        // 2. PREMIUM ENTERPRISE BLOCK HEADER
        doc.setFillColor(15, 23, 42); // #0f172a Deep Slate
        doc.rect(0, 0, 210, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold'); // 👈 'Inter' kadhun standard 'helvetica' kela (Warnings band hotil)
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
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 130, 24);
        doc.text(`Asset ID: ${truckInfo?.truckNumber || 'All Fleet'}`, 130, 29);

        // 3. STATS DASHBOARD HIGHLIGHT CARDS
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252); 
        doc.rect(15, 55, 180, 22, 'FD');

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL JOURNEYS', 20, 62);
        doc.text('GROSS FREIGHT (BHADA)', 60, 62);
        doc.text('TOTAL EXPENSES', 115, 62);
        doc.text('NET PROFIT LOG', 160, 62);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        doc.text(`${totalTripsCount}`, 20, 71);
        doc.setTextColor(16, 185, 129); 
        doc.text(`Rs.${totalFreight}`, 60, 71);
        doc.setTextColor(239, 68, 68); 
        doc.text(`Rs.${totalExpenses}`, 115, 71);
        doc.setTextColor(59, 130, 246); 
        doc.text(`Rs.${netProfit}`, 160, 71);

        // 4. HISTORICAL DYNAMIC LEDGER TABLE
        const tableBody = filteredTrips.map((trip, idx) => [
            idx + 1,
            new Date(trip.startDate).toLocaleDateString(),
            `${trip.source} to ${trip.destination}`,
            trip.status.toUpperCase(),
            `Rs.${trip.freightAmount}`,
            `Rs.${trip.totalExpenses || 0}`,
            `Rs.${trip.freightAmount - (trip.totalExpenses || 0)}`
        ]);

        // 👈 CHANGE HERE: doc.autoTable jagi direct autoTable(doc, { ... }) functional execution call kela
        autoTable(doc, {
            startY: 85,
            head: [['#', 'DATE', 'ROUTE MANIFEST', 'STATUS', 'FREIGHT', 'EXPENSES', 'NET PROFIT']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42], fontSize: 9, fontStyle: 'bold', font: 'helvetica' }, 
            bodyStyles: { fontSize: 9, textColor: [51, 65, 85], font: 'helvetica' },
            columnStyles: {
                0: { width: 8 },
                1: { width: 22 },
                2: { width: 50 },
                3: { width: 20 },
                4: { width: 25 },
                5: { width: 25 },
                6: { width: 30 }
            },
            margin: { left: 15, right: 15 }
        });

        // 5. SECURE PRODUCTION FOOTER
        // 👈 jsPDF AutoTable single package integration validation fallback read check
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('This audit statement aggregates dynamic platform telemetry logs securely directly from MongoDB Atlas cloud clusters.', 15, finalY);
        doc.text('TruckLogic Ledger Verification Copy Execution Code.', 15, finalY + 4);

        // 6. SAVE TRIGGER DOWNLOAD
        doc.save(`FleetReport-${reportTitle.replace(' ', '-')}-${new Date().toISOString().slice(0,10)}.pdf`);
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