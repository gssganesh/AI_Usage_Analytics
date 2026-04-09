import { useState } from 'react';
import { Download } from 'lucide-react';
import { api, downloadBlob } from '../services/api';

export default function ExportButton({ format, filters }) {
    const [loading, setLoading] = useState(false);
    const labels = { csv: 'CSV', json: 'JSON', pdf: 'PDF', docx: 'DOCX' };

    const handleExport = async () => {
        setLoading(true);
        try {
            const exporters = { csv: api.exportCSV, json: api.exportJSON, pdf: api.exportPDF, docx: api.exportDOCX };
            const response = await exporters[format](filters);
            downloadBlob(response, `student_ai_data.${format}`);
        } catch (e) { alert(`Export failed: ${e.message}`); }
        finally { setLoading(false); }
    };

    return (
        <button className="export-btn" onClick={handleExport} disabled={loading}>
            <Download size={15} />{loading ? 'Exporting...' : labels[format]}
        </button>
    );
}