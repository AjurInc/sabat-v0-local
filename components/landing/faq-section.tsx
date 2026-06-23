"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

function GetFAQs(t: any) {
  return [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
  ];
}

function FAQItem({ question, answer, index, isOpen, onToggle }: any) {
  return (
    <div className="border-b border-foreground/10 last:border-0">
      <button
        onClick={() => onToggle(index)}
        className="w-full py-6 lg:py-8 flex items-start justify-between group text-left hover:text-foreground/80 transition-colors"
      >
        <span className="text-lg lg:text-xl font-display tracking-tight flex-1 pr-6">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 mt-1 text-muted-foreground transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-6 lg:pb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const { t } = useTranslation();
  const faqs = GetFAQs(t);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-sans text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {t('faq.title')}
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Frequently asked
            <br />
            <span className="text-muted-foreground">{t('faq.subtitle')}</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
              isOpen={openIndex === index}
              onToggle={setOpenIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
