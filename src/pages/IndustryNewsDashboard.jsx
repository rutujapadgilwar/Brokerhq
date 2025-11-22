import React, { useState, useEffect } from "react";
import { TrendingUp, Building, ArrowUp, BarChart3 } from "lucide-react";
import Navbar from '../components/dashboard/Navbar';
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendUrl}/api/industryAnalysis`;

// Individual Industry Card
const IndustryCard = ({ industryData, index }) => {
  const { industry, metrics, growth_drivers, relevance, icon, color_scheme } = industryData;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tenant?industry=${encodeURIComponent(industry)}`);
  };
  return (
    <div 
      onClick={handleClick}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 hover:border-blue-200 overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Animated accent border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      {/* Content */}
      <div className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            {icon || <Building className="w-8 h-8 text-white" />}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors duration-300">
              {industry}
            </h3>
            
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(metrics).map(([label, value]) => (
            <div key={label} className="bg-gray-50 hover:bg-blue-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-all duration-300 group/metric">
              <div className="text-3xl font-bold text-gray-800 mb-2 group-hover/metric:text-blue-600 group-hover/metric:scale-105 transition-all duration-300">
                {value}
              </div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Growth Drivers */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Key Growth Drivers</h4>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <p className="text-gray-700 leading-relaxed text-base font-medium">
              {growth_drivers}
            </p>
          </div>
        </div>

        {/* Real Estate Relevance */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Real Estate Impact</h4>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <p className="text-gray-700 leading-relaxed text-base font-medium">
              {relevance}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center">
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin animation-delay-150"></div>
    </div>
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h3>
      <p className="text-gray-600 font-medium">Fetching the latest industry insights...</p>
    </div>
  </div>
);

// Main Dashboard Component
const IndustryNewsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    if (!loading) setRefreshing(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please check the backend server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Connection Error</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="pt-32 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className=" text-5xl md:text-6xl font-black text-gray-900 mb-2">
                Industry Performance
              </h1>
              <div className="h-2 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium mb-6">
            Comprehensive real-time analysis of top-performing industries driving real estate demand across key markets
          </p>
          
          {dashboardData?.as_of && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-semibold">Live Data • Updated {dashboardData.as_of}</span>
            </div>
          )}
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {dashboardData.analysis.map((item, idx) => (
            <IndustryCard key={idx} industryData={item} index={idx} />
          ))}
        </div>

        {/* Economic Context */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Economic Overview
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
            </div>
          </div>

          {/* Economic Stats */}
          {dashboardData.economic_context && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {Object.entries(dashboardData.economic_context)
                .filter(([key]) => key !== 'summary')
                .map(([label, value], idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="text-4xl font-black text-gray-800 mb-3 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300">
                    {value}
                  </div>
                  <div className="text-gray-600 font-bold uppercase tracking-wide text-sm">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Economic Context Summary */}
          {dashboardData.economic_context?.summary && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                {dashboardData.economic_context.summary}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
    </div>
  );
};

export default IndustryNewsDashboard;