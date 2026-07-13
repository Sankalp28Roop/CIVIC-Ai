"use client";

import React, { useState } from 'react';
import { Activity, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/utils/api';

interface EligibilityResult {
  status: string;
  message: string;
  matches: Array<{
    id: string;
    title: string;
    reason: string;
  }>;
}

export default function EligibilityPage() {
  const [formData, setFormData] = useState({ state: '', income: '', occupation: '', category: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EligibilityResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/eligibility/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-[28px] font-bold text-text-primary">AI Eligibility Check</h2>
        <p className="text-text-muted text-[15px] mt-2 max-w-lg mx-auto">Answer a few questions and our AI engine will automatically match you with verified qualifying government schemes.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle shadow-sm p-6 md:p-10">
        {!results ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-text-primary">State of Residence</label>
                <select 
                  className="input-field w-full bg-canvas text-[14px]"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                >
                  <option value="">Select State</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="MH">Maharashtra</option>
                  <option value="DL">Delhi</option>
                  <option value="KA">Karnataka</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-text-primary">Annual Family Income</label>
                <select 
                  className="input-field w-full bg-canvas text-[14px]"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  required
                >
                  <option value="">Select Income Bracket</option>
                  <option value="< 2.5 Lakhs">&lt; 2.5 Lakhs</option>
                  <option value="2.5 - 5 Lakhs">2.5 - 5 Lakhs</option>
                  <option value="5 - 8 Lakhs">5 - 8 Lakhs</option>
                  <option value="> 8 Lakhs">&gt; 8 Lakhs</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-text-primary">Primary Occupation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Farmer, Student, Business" 
                  className="input-field w-full bg-canvas text-[14px]"
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-text-primary">Social Category</label>
                <select 
                  className="input-field w-full bg-canvas text-[14px]"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC/ST">SC/ST</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-border-subtle pt-6 mt-2 flex justify-end">
              <button type="submit" disabled={isLoading} className="btn-primary w-full md:w-auto h-[44px] px-8 disabled:opacity-70">
                {isLoading ? (
                  <span className="flex items-center"><Activity className="w-5 h-5 mr-2 animate-spin" /> Analyzing Profile...</span>
                ) : (
                  <span className="flex items-center">Check Eligibility <ChevronRight className="w-4 h-4 ml-1" /></span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-[15px]">Analysis Complete</h4>
                <p className="text-[13px] text-green-800">We found {results.matches?.length || 0} schemes you are highly likely to qualify for.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 mt-2">
              {results.matches?.map((match, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-canvas rounded-xl border border-border-subtle gap-4">
                  <div>
                    <h5 className="font-bold text-[16px] text-text-primary mb-1">{match.title}</h5>
                    <p className="text-[13px] text-text-muted flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> {match.reason}
                    </p>
                  </div>
                  <button className="btn-secondary whitespace-nowrap shadow-sm bg-surface shrink-0">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
            
            <button onClick={() => setResults(null)} className="text-[14px] font-medium text-text-muted hover:text-text-primary mt-4 self-center underline">
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
