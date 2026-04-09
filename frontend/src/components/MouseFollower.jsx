import React, { useEffect, useRef, useState } from 'react';

const MouseFollower = () => {
    const followerRef = useRef(null);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        let requestId;
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            if (followerRef.current) {
                requestId = requestAnimationFrame(() => {
                    followerRef.current.style.left = `${clientX}px`;
                    followerRef.current.style.top = `${clientY}px`;
                });
            }
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(requestId);
        };
    }, []);

    return (
        <div
            ref={followerRef}
            className="mouse-follower"
            style={{
                opacity: opacity,
            }}
        />
    );
};

export default MouseFollower;
