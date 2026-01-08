import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink, Calendar, DollarSign } from 'lucide-react';

const LeaseSummaryCard = ({ propertyData }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Debug: Log the data structure
  console.log('LeaseSummaryCard - propertyData:', propertyData);

  // Extract and transform lease summary data
  const getLeaseSummaries = () => {
    if (!propertyData) {
      console.log('No propertyData');
      return [];
    }

    if (!propertyData.All_Reports) {
      console.log('No All_Reports in propertyData');
      return [];
    }

    const allReports = propertyData.All_Reports;
    console.log('All_Reports:', allReports);
    const summaries = [];

    // Process each report type (Form 10-k, etc.)
    Object.keys(allReports).forEach((reportType) => {
      console.log('Processing report type:', reportType);
      const reports = allReports[reportType];
      
      if (Array.isArray(reports)) {
        console.log(`Found ${reports.length} reports in ${reportType}`);
        reports.forEach((report, idx) => {
          console.log(`Report ${idx}:`, {
            hasLeaseSummary: !!report['Lease Summary'],
            leaseSummary: report['Lease Summary']?.substring(0, 50),
            filingDate: report['Filing Date']
          });
          
          // Only include reports that have a Lease Summary
          if (report['Lease Summary']) {
            summaries.push({
              filing_date: report['Filing Date'],
              total_revenue: formatRevenue(report['Total Revenue']),
              lease_summary: report['Lease Summary'],
              lease_count: Array.isArray(report.Leases) ? report.Leases.length : 0,
              url: report.URL,
              executive_officer: report['Executive Officer who signed the lease'],
              company_name: report['Company Name']
            });
          }
        });
      }
    });

    console.log('Total summaries found:', summaries.length);

    // Sort by filing date (most recent first)
    return summaries.sort((a, b) => 
      new Date(b.filing_date) - new Date(a.filing_date)
    );
  };

  const formatRevenue = (revenue) => {
    if (!revenue) return 'N/A';
    const num = parseFloat(revenue);
    if (isNaN(num)) return revenue;
    
    if (num >= 1000) {
      return `$${num.toLocaleString()}M`;
    }
    return `$${num}B`;
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const leaseSummaries = getLeaseSummaries();

  if (!propertyData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-2xl">
        <div className="text-center py-6 text-gray-500 text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Lease Summaries</h3>
          {propertyData.company_ticker && (
            <span className="text-sm text-gray-500">({propertyData.company_ticker})</span>
          )}
        </div>
        {leaseSummaries.length > 0 && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {leaseSummaries.length} Report{leaseSummaries.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Lease Items */}
      {leaseSummaries.length > 0 ? (
        <div className="space-y-2">
          {leaseSummaries.map((report, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-md hover:border-blue-300 transition-colors"
            >
              {/* Compact Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700 whitespace-nowrap">
                      {new Date(report.filing_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{report.total_revenue}</span>
                  </div>

                  {report.lease_count > 0 && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      {report.lease_count} lease{report.lease_count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {expandedIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {report.lease_summary}
                  </p>
                  {report.executive_officer && (
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-medium">Signed by:</span> {report.executive_officer}
                    </p>
                  )}
                  {report.url && (
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View 10-K Filing
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">
          No lease summaries available for this property
        </div>
      )}
    </div>
  );
};

export default LeaseSummaryCard;