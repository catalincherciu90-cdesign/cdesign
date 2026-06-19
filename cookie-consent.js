/**
 * Cookie Consent Banner — GDPR compliant
 * Manages consent for GA4 (Google Analytics) and Meta Pixel (Facebook)
 * Fires custom event 'cookie-consent-granted' when user accepts
 */

(function() {
  const CONSENT_KEY = 'cdCookieConsent';
  const TIMESTAMP_KEY = 'cdCookieConsentTime';

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
  }

  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consimțământ pentru cookies');
    banner.innerHTML = `
      <div class="cc-content">
        <div class="cc-header">
          <h2>Utilizăm cookies</h2>
        </div>
        <div class="cc-text">
          <p>Utilizăm Google Analytics și Meta Pixel pentru a înțelege cum folosești site-ul nostru. Aceste instrumente ne ajută să îmbunătățim experiența ta.</p>
          <p><a href="/politica-confidentialitate" class="cc-link">Citește Politica de Confidențialitate</a></p>
        </div>
        <div class="cc-actions">
          <button class="cc-btn cc-btn-accept" id="cc-accept">Accept</button>
          <button class="cc-btn cc-btn-decline" id="cc-decline">Doar Necesare</button>
        </div>
      </div>
    `;
    return banner;
  }

  function loadTrackingScripts() {
    // Loader-ul efectiv (GA4 + Meta Pixel) trăiește inline în fiecare pagină,
    // ascultă evenimentul de mai jos și are propriul guard anti-dublare.
    // Aici doar semnalăm consimțământul, ca să nu încărcăm scripturile de două ori.
    window.dispatchEvent(new CustomEvent('cookie-consent-granted'));
  }

  function removeBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.add('cc-hidden');
      setTimeout(() => banner.remove(), 300);
    }
  }

  function init() {
    const consent = getConsent();

    // If user already made a choice, don't show banner
    if (consent === 'granted' || consent === 'denied') {
      // If granted, load tracking immediately
      if (consent === 'granted') {
        loadTrackingScripts();
      }
      return;
    }

    // Show banner for first-time visitors
    const banner = createBanner();
    document.body.appendChild(banner);

    // Inject CSS
    if (!document.getElementById('cc-styles')) {
      const style = document.createElement('style');
      style.id = 'cc-styles';
      style.textContent = `
        #cookie-consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: var(--bg2, #0d1117);
          border-top: 1px solid var(--border, rgba(255,255,255,0.07));
          padding: 24px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform: translateY(0);
          opacity: 1;
          box-shadow: 0 -2px 16px rgba(0,0,0,0.3);
        }

        #cookie-consent-banner.cc-hidden {
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
        }

        .cc-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: center;
          color: var(--text, #e8edf2);
        }

        .cc-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text, #e8edf2);
          margin: 0;
          margin-bottom: 8px;
        }

        .cc-text {
          color: var(--muted, #6a7585);
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .cc-text p {
          margin: 0 0 12px 0;
        }

        .cc-text p:last-child {
          margin-bottom: 0;
        }

        .cc-link {
          color: var(--teal, #00c8b4);
          text-decoration: underline;
          transition: opacity 0.2s;
        }

        .cc-link:hover {
          opacity: 0.8;
        }

        .cc-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .cc-btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-family: inherit;
        }

        .cc-btn-accept {
          background: var(--teal, #00c8b4);
          color: var(--bg, #080b0e);
        }

        .cc-btn-accept:hover {
          background: var(--teal-lt, #33d4c3);
          transform: translateY(-1px);
        }

        .cc-btn-decline {
          background: transparent;
          color: var(--text, #e8edf2);
          border: 1px solid var(--border-soft, rgba(255,255,255,0.11));
        }

        .cc-btn-decline:hover {
          background: var(--bg3, #111820);
          border-color: var(--teal-border, rgba(0,200,180,0.28));
          color: var(--teal, #00c8b4);
        }

        .cc-btn:focus {
          outline: 2px solid var(--teal, #00c8b4);
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .cc-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .cc-actions {
            justify-content: stretch;
          }

          .cc-btn {
            flex: 1;
            min-width: 120px;
          }

          #cookie-consent-banner {
            padding: 20px 16px;
          }

          .cc-text {
            font-size: 0.8rem;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Accept button
    document.getElementById('cc-accept').addEventListener('click', () => {
      setConsent('granted');
      loadTrackingScripts();
      removeBanner();
    });

    // Decline button
    document.getElementById('cc-decline').addEventListener('click', () => {
      setConsent('denied');
      removeBanner();
    });
  }

  // Expose function to reopen banner (for "Setări cookies" link in footer)
  window.openCookieConsentBanner = function() {
    const existing = document.getElementById('cookie-consent-banner');
    if (existing) {
      existing.remove();
    }
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
    init();
  };

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
