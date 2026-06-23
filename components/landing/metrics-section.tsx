"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-6xl lg:text-8xl font-display tracking-tight">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

function GetMetrics(t: any) {
  return [
    { 
      value: 1500, 
      suffix: "+", 
      prefix: "",
      label: t('metrics.organization_partners'),
    },
    { 
      value: 99, 
      suffix: ".9%", 
      prefix: "",
      label: t('metrics.service_satisfaction'),
    },
    { 
      value: 5000, 
      suffix: "+", 
      prefix: "",
      label: t('metrics.hotel_partners'),
    },
    { 
      value: 50, 
      suffix: "+", 
      prefix: "",
      label: t('metrics.cities_covered'),
    },
  ];
}

export function MetricsSection() {
  const { t } = useTranslation();
  const metrics = GetMetrics(t);
  const [time, setTime] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLSection>(null);

  const timezones = [
    { city: "Tehran", offset: 3.5 },
    { city: "London", offset: 0 },
    { city: "New York", offset: -5 },
    { city: "Dubai", offset: 4 },
    { city: "Tokyo", offset: 9 },
    { city: "Sydney", offset: 10 },
  ];

  const getTimeInZone = (tzOffset: number) => {
    if (!time) return "--:--:-- --";
    const utc = new Date(time.getTime() + time.getTimezoneOffset() * 60000);
    const zoneTime = new Date(utc.getTime() + tzOffset * 3600000);
    return zoneTime.toLocaleTimeString();
  };

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
    <section id="metrics" ref={sectionRef} className="relative py-24 lg:py-32 border-y border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-16 lg:mb-24 text-center">
          <div>
            <span className="inline-flex items-center justify-center gap-3 text-sm font-sans text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {t('metrics.enterprise_trust')}
              <span className="w-8 h-px bg-foreground/30" />
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 text-center ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t('proven_partner')}
            </h2>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live </span>
            </div>
            <div className="flex flex-wrap gap-6 font-mono text-xs text-muted-foreground justify-center">
              {timezones.map((tz) => (
                <div key={tz.city} className="flex items-center gap-2">
                  <span className="text-foreground/70">{tz.city}</span>
                  <span className="text-foreground/50">{getTimeInZone(tz.offset)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-background p-8 lg:p-12 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter 
                end={typeof metric.value === 'number' ? metric.value : 0} 
                suffix={metric.suffix} 
                prefix={metric.prefix}
              />
              <div className="mt-4 text-lg text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
