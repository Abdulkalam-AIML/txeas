import { DemoRepository } from '@/lib/demoRepository';
import { ReportFilter, Transaction } from '@/types';

export const reportService = {
  async getAnalytics(timeframe: 'today' | '7days' | '30days' | '3months' | '1year' | 'all' = '30days') {
    return await DemoRepository.getDashboardAnalytics(timeframe);
  },

  async generateFilteredReport(filters: ReportFilter) {
    const transactions = await DemoRepository.searchTransactions({
      type: filters.transactionType,
      startDate: filters.startDate,
      endDate: filters.endDate,
      employeeId: filters.employeeId,
      locationId: filters.locationId,
      category: filters.category,
      paymentMethod: filters.paymentMethod,
      status: filters.status,
    });

    const completed = transactions.filter((t) => t.status === 'COMPLETED');
    const buys = completed.filter((t) => t.type === 'BUY');
    const sells = completed.filter((t) => t.type === 'SELL');

    const totalBuyValue = buys.reduce((acc, t) => acc + t.finalTotal, 0);
    const totalSellValue = sells.reduce((acc, t) => acc + t.finalTotal, 0);

    // Metal weight aggregates
    let goldGrams = 0;
    let silverOz = 0;
    let platinumGrams = 0;

    completed.forEach((t) => {
      t.items.forEach((i) => {
        let g = i.weight;
        if (i.unit === 'oz') g = i.weight * 31.1035;
        if (i.unit === 'dwt') g = i.weight * 1.55517;

        if (i.category === 'Gold') goldGrams += g;
        if (i.category === 'Silver') silverOz += i.unit === 'oz' ? i.weight : g / 31.1035;
        if (i.category === 'Platinum') platinumGrams += g;
      });
    });

    return {
      filters,
      generatedAt: new Date().toISOString(),
      recordCount: transactions.length,
      completedCount: completed.length,
      voidedCount: transactions.filter((t) => t.status === 'VOIDED').length,
      totalBuyCount: buys.length,
      totalBuyValue,
      totalSellCount: sells.length,
      totalSellValue,
      totalTurnover: totalBuyValue + totalSellValue,
      goldGrams: +goldGrams.toFixed(1),
      goldOz: +(goldGrams / 31.1035).toFixed(2),
      silverOz: +silverOz.toFixed(2),
      platinumGrams: +platinumGrams.toFixed(1),
      transactions,
    };
  },

  exportToCSV(reportData: { transactions: Transaction[] }, reportName = 'TexasGoldBuyers_Report.csv') {
    const headers = [
      'Transaction ID',
      'Invoice #',
      'Date',
      'Type',
      'Status',
      'Customer Name',
      'Customer Phone',
      'Employee',
      'Location',
      'Item Count',
      'Subtotal ($)',
      'Adjustment ($)',
      'Tax ($)',
      'Total ($)',
      'Payment Method',
      'Payment Ref',
    ];

    const rows = reportData.transactions.map((t) => [
      t.id,
      t.invoiceNumber,
      new Date(t.transactionDate).toISOString().split('T')[0],
      t.type,
      t.status,
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.customerPhone,
      `"${t.employeeName.replace(/"/g, '""')}"`,
      `"${t.locationName.replace(/"/g, '""')}"`,
      t.items.length,
      t.subtotal.toFixed(2),
      t.discountOrAdjustment.toFixed(2),
      t.taxAmount.toFixed(2),
      t.finalTotal.toFixed(2),
      t.payment.method,
      t.payment.referenceNumber,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', reportName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
