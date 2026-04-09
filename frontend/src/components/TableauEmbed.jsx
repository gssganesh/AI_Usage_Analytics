import { useEffect, useRef } from 'react';

export default function TableauEmbed({ dashboard = 'ai-usage', height = 700 }) {
    const containerRef = useRef(null);
    const scriptAdded = useRef(false);

    useEffect(() => {
        if (scriptAdded.current) return;
        scriptAdded.current = true;

        const container = containerRef.current;
        if (!container) return;

        const configMap = {
            'ai-usage': {
                path: 'shared/KZ9SPDMSZ',
                rss: 'KZ/KZ9SPDMSZ/1_rss.png',
                png: 'KZ/KZ9SPDMSZ/1.png',
                alt: 'AI Usage & Academic Performance',
                filter: "<param name='filter' value='publish=yes' />"
            },
            'learning': {
                path: 'shared/K4GWNGGP7',
                rss: 'K4/K4GWNGGP7/1_rss.png',
                png: 'K4/K4GWNGGP7/1.png',
                alt: 'Learning Behavior & Student Well-being',
                filter: ""
            },
            'adoption': {
                path: 'shared/SSX98798Q',
                rss: 'SS/SSX98798Q/1_rss.png',
                png: 'SS/SSX98798Q/1.png',
                alt: 'AI Adoption & Accessibility',
                filter: "<param name='filter' value='publish=yes' />"
            },
            'story': {
                path: 'shared/7HRMW8JP4',
                rss: '7H/7HRMW8JP4/1_rss.png',
                png: '7H/7HRMW8JP4/1.png',
                alt: 'AI Usage & Academic Performance Story',
                filter: "<param name='filter' value='publish=yes' />"
            },
            'story2': {
                name: 'dashboards_17752771313360/Story3',
                rss: 'da/dashboards_17752771313360/Story3/1_rss.png',
                png: 'da/dashboards_17752771313360/Story3/1.png',
                alt: 'Story 3',
                filter: "<param name='filter' value='publish=yes' />"
            }
        };

        const config = configMap[dashboard] || configMap['ai-usage'];

        // Determine if we are using a shared 'path' or a standard 'name' embed code
        const embedTarget = config.path 
            ? `<param name='path' value='${config.path}' />`
            : `<param name='site_root' value='' /><param name='name' value='${config.name}' />`;

        container.innerHTML = `
            <div class='tableauPlaceholder' style='position: relative; width: 100%; height: ${height}px;'>
                <noscript>
                    <a href='#'><img alt='${config.alt}' src='https://public.tableau.com/static/images/${config.rss}' style='border: none' /></a>
                </noscript>
                <object class='tableauViz' style='display:none; width: 100%; height: ${height}px;'>
                    <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
                    <param name='embed_code_version' value='3' />
                    ${embedTarget}
                    <param name='toolbar' value='yes' />
                    <param name='static_image' value='https://public.tableau.com/static/images/${config.png}' />
                    <param name='animate_transition' value='yes' />
                    <param name='display_static_image' value='yes' />
                    <param name='display_spinner' value='yes' />
                    <param name='display_overlay' value='yes' />
                    <param name='display_count' value='yes' />
                    <param name='language' value='en-US' />
                    ${config.filter}
                </object>
            </div>
        `;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        
        script.onload = () => {
            setTimeout(() => {
                const divElement = container.querySelector('.tableauPlaceholder');
                if (divElement) {
                    const vizElement = divElement.getElementsByTagName('object')[0];
                    if (vizElement) {
                        vizElement.style.width = '100%';
                        vizElement.style.height = height + 'px';
                        vizElement.style.display = 'block';
                    }
                }
            }, 500);
        };
        
        container.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            scriptAdded.current = false;
        };
    }, [height, dashboard]);

    return (
        <div 
            ref={containerRef} 
            style={{ 
                width: '100%', 
                height: height + 'px',
                backgroundColor: 'transparent',
                borderRadius: '10px',
                overflow: 'hidden',
                border: 'none'
            }}
        ></div>
    );
}