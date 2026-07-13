"use client";

import React, { useState } from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { HelpCircle, MessageSquare, Plus, Minus, Send, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '@/utils/api';

interface FAQ {
  question: string;
  answer: string;
}

export default function SupportPage() {
  const { data: faqs, isLoading } = useFetchData<FAQ[]>('/support/faqs');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const [feedback, setFeedback] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/support/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      setSubmitted(true);
      setFeedback({ subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div>
        <h2 className="text-[24px] font-bold text-text-primary">Help & Support</h2>
        <p className="text-text-muted text-[14px] mt-1">Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-brand-accent" />
            <h3 className="text-[18px] font-bold text-text-primary">Frequently Asked Questions</h3>
          </div>
          
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-surface border border-border-subtle rounded-xl animate-pulse"></div>
            ))
          ) : faqs?.map((faq: FAQ, i: number) => (
            <div key={i} className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <span className="font-semibold text-[15px] text-text-primary pr-4">{faq.question}</span>
                {openFaq === i ? <Minus className="w-5 h-5 text-brand-accent shrink-0" /> : <Plus className="w-5 h-5 text-text-muted shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-1 text-[14px] text-text-muted leading-relaxed border-t border-border-subtle mt-1 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Terminal */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-brand-accent" />
            <h3 className="text-[18px] font-bold text-text-primary">Contact Support</h3>
          </div>

          <div className="bg-surface rounded-xl border border-border-subtle p-6 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <h4 className="font-bold text-[18px] text-text-primary mb-1">Message Sent!</h4>
                <p className="text-[14px] text-text-muted mb-6">Our support team will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-text-primary">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Briefly describe your issue..." 
                    className="input-field w-full bg-canvas text-[14px]"
                    value={feedback.subject}
                    onChange={(e) => setFeedback({...feedback, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-text-primary">Message Details</label>
                  <textarea 
                    placeholder="Provide as much detail as possible..." 
                    className="input-field w-full bg-canvas text-[14px] min-h-[120px] resize-y"
                    value={feedback.message}
                    onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2 h-[42px] disabled:opacity-70">
                  {isSubmitting ? 'Sending...' : <span className="flex items-center justify-center">Send Message <Send className="w-4 h-4 ml-2" /></span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
