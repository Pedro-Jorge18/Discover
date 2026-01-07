import React, { useState } from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Search, ChevronDown, HelpCircle, Home, Users, CreditCard, Shield, MessageCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function HelpCenter({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'bookings', label: t('helpCenter.category.bookings'), icon: Home },
    { id: 'hosts', label: t('helpCenter.category.hosts'), icon: Users },
    { id: 'payments', label: t('helpCenter.category.payments'), icon: CreditCard },
    { id: 'security', label: t('helpCenter.category.security'), icon: Shield },
    { id: 'cancellation', label: t('helpCenter.category.cancellation'), icon: AlertCircle },
  ];

  const faqs = {
    bookings: [
      {
        question: t('helpCenter.bookings.q1'),
        answer: t('helpCenter.bookings.a1'),
      },
      {
        question: t('helpCenter.bookings.q2'),
        answer: t('helpCenter.bookings.a2'),
      },
      {
        question: t('helpCenter.bookings.q3'),
        answer: t('helpCenter.bookings.a3'),
      },
      {
        question: t('helpCenter.bookings.q4'),
        answer: t('helpCenter.bookings.a4'),
      },
    ],
    hosts: [
      {
        question: t('helpCenter.hosts.q1'),
        answer: t('helpCenter.hosts.a1'),
      },
      {
        question: t('helpCenter.hosts.q2'),
        answer: t('helpCenter.hosts.a2'),
      },
      {
        question: t('helpCenter.hosts.q3'),
        answer: t('helpCenter.hosts.a3'),
      },
      {
        question: t('helpCenter.hosts.q4'),
        answer: t('helpCenter.hosts.a4'),
      },
    ],
    payments: [
      {
        question: t('helpCenter.payments.q1'),
        answer: t('helpCenter.payments.a1'),
      },
      {
        question: t('helpCenter.payments.q2'),
        answer: t('helpCenter.payments.a2'),
      },
      {
        question: t('helpCenter.payments.q3'),
        answer: t('helpCenter.payments.a3'),
      },
      {
        question: t('helpCenter.payments.q4'),
        answer: t('helpCenter.payments.a4'),
      },
    ],
    security: [
      {
        question: t('helpCenter.security.q1'),
        answer: t('helpCenter.security.a1'),
      },
      {
        question: t('helpCenter.security.q2'),
        answer: t('helpCenter.security.a2'),
      },
      {
        question: t('helpCenter.security.q3'),
        answer: t('helpCenter.security.a3'),
      },
      {
        question: t('helpCenter.security.q4'),
        answer: t('helpCenter.security.a4'),
      },
    ],
    cancellation: [
      {
        question: t('helpCenter.cancellation.q1'),
        answer: t('helpCenter.cancellation.a1'),
      },
      {
        question: t('helpCenter.cancellation.q2'),
        answer: t('helpCenter.cancellation.a2'),
      },
      {
        question: t('helpCenter.cancellation.q3'),
        answer: t('helpCenter.cancellation.a3'),
      },
      {
        question: t('helpCenter.cancellation.q4'),
        answer: t('helpCenter.cancellation.a4'),
      },
    ],
  };

  const filteredFaqs = selectedCategory === 'all' 
    ? Object.values(faqs).flat()
    : faqs[selectedCategory];

  const searchedFaqs = filteredFaqs.filter(
    faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-44 pb-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-10 h-10" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              {t('helpCenter.title')}
            </h1>
          </div>
          <p className="text-xl text-blue-100 mb-8">
            {t('helpCenter.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('helpCenter.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white border border-white"
            />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 sm:px-10 py-16">
        
        {/* Category Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setExpandedFaq(null);
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {t('helpCenter.allCategories')}
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setExpandedFaq(null);
                  }}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-4 mb-16">
          {searchedFaqs.length > 0 ? (
            searchedFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-start justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {t('helpCenter.noResults')}
              </p>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('helpCenter.additionalHelp.title')}
          </h3>
          <p className="text-gray-700 mb-6">
            {t('helpCenter.additionalHelp.description')}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/termos" className="px-6 py-2 bg-white border border-blue-300 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              {t('helpCenter.additionalHelp.terms')}
            </a>
            <a href="/privacidade" className="px-6 py-2 bg-white border border-blue-300 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              {t('helpCenter.additionalHelp.privacy')}
            </a>
            <a href="/empresa" className="px-6 py-2 bg-white border border-blue-300 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              {t('helpCenter.additionalHelp.company')}
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default HelpCenter;
