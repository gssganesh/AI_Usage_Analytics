export default function CGPAIndicator({ distribution }) {
    if (!distribution || !distribution.length) return null;
    const total = distribution.reduce((s, d) => s + d.count, 0);
    return (
        <div className="cgpa-indicators">
            <h3>CGPA Performance Color Indicator</h3>
            <div className="cgpa-bar-container">
                {distribution.map(item => {
                    const pct = total > 0 ? (item.count / total) * 100 : 0;
                    return (
                        <div className="cgpa-bar-item" key={item.category}>
                            <div className="cgpa-bar-label">{item.category}</div>
                            <div className="cgpa-bar-track">
                                <div className="cgpa-bar-fill" style={{ width: `${Math.max(pct, 2)}%`, background: item.color }}>{pct.toFixed(0)}%</div>
                            </div>
                            <div className="cgpa-bar-count">{item.count}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}