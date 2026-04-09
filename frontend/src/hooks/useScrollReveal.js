import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollReveal() {
    const location = useLocation();

    useEffect(() => {
        // Skip login page
        if (location.pathname === '/' || location.pathname === '/login') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

        // Select elements to reveal
        const selectors = [
            '.main-content h1', '.main-content h2', '.main-content h3', 
            '.main-content h4', '.main-content p', '.stat-card', 
            '.chart-card', '.filter-panel', '.cgpa-indicators', '.export-bar'
        ];

        // Using a short timeout to let the DOM paint
        const timeoutId = setTimeout(() => {
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    if (!el.classList.contains('text-reveal')) {
                        // Adding custom transition logic class
                        el.classList.add('text-reveal');
                    }
                    // Apply delay sequentially if they are in a grid (optional, but CSS can handle the base)
                    observer.observe(el);
                });
            });
        }, 150);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [location.pathname]);
}
