"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatedWave } from "./animated-wave";

function GetFooterLinks(t: any) {
  return {
    Services: [
      { name: t('contact.corporate_accommodation'), href: "#services" },
      { name: t('contact.transfers_hospitality'), href: "#services" },
      { name: t('contact.business_travel_operations'), href: "#services" },
    ],
    Company: [
      { name: t('nav.about'), href: "#about" },
      { name: t('industries.title'), href: "#industries" },
      { name: t('nav.faq'), href: "#faq" },
      { name: t('contact.title'), href: "#contact" },
    ],
    Legal: [
      { name: 'Privacy Policy', href: "#" },
      { name: 'Terms of Service', href: "#" },
      { name: 'Confidentiality', href: "#" },
    ],
  };
}

export function FooterSection() {
  const { t } = useTranslation();
  const footerLinks = GetFooterLinks(t);
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
              <div>
                <a href="#" className="inline-flex items-center gap-2 mb-6">
                  <span className="text-2xl font-display font-bold">SABAT</span>
                </a>

                <p className="text-muted-foreground leading-relaxed mb-4 max-w-xs">
                  Professional corporate travel management. Expert coordination for exceptional business journeys.
                </p>

                {/* Address Section */}
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Address</p>
                  <p>Tehran, Iran</p>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-foreground text-background rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              24/7 Support Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
