function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    };
}

function buildQs(filters) {
    var p = new URLSearchParams();
    if (filters) {
        var keys = Object.keys(filters);
        for (var i = 0; i < keys.length; i++) {
            var v = filters[keys[i]];
            if (v && v !== 'All' && v !== '') {
                p.append(keys[i], v);
            }
        }
    }
    var s = p.toString();
    return s ? '?' + s : '';
}

async function makeReq(url) {
    var res = await fetch('/api' + url, { headers: getHeaders() });
    if (res.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired');
    }
    if (!res.ok) {
        var e = await res.json().catch(function() { return { message: 'Failed' }; });
        throw new Error(e.message);
    }
    return res.json();
}

var api = {
    getStudents: function(f) { return makeReq('/students' + buildQs(f)); },
    getStats: function(f) { return makeReq('/students/stats' + buildQs(f)); },
    getCGPADistribution: function(f) { return makeReq('/students/cgpa-distribution' + buildQs(f)); },
    getAIUsageByStream: function(f) { return makeReq('/students/ai-usage-by-stream' + buildQs(f)); },
    getFrequencyVsPerformance: function(f) { return makeReq('/students/frequency-vs-performance' + buildQs(f)); },
    getRegionalPatterns: function(f) { return makeReq('/students/regional-patterns' + buildQs(f)); },
    getStudentById: function(id) { return makeReq('/students/' + id); },
    getLearningConditions: function(f) { return makeReq('/students/learning-conditions' + buildQs(f)); },
    getScatterData: function(f) { return makeReq('/students/scatter-data' + buildQs(f)); },
    getStudyVsAIHours: function(f) { return makeReq('/students/study-vs-ai-hours' + buildQs(f)); },
    getMentalStressData: function(f) { return makeReq('/students/mental-stress-vs-study' + buildQs(f)); },
    getAssignmentVsAI: function(f) { return makeReq('/students/assignment-vs-ai' + buildQs(f)); },
    getFilterOptions: function() { return makeReq('/students/filter-options'); },
    getRiskAssessment: function(f, m) { return makeReq('/students/risk-assessment' + buildQs(f) + (m ? (buildQs(f) ? '&model=' : '?model=') + m : '')); },
    getAIEfficiency: function(f) { return makeReq('/students/efficiency' + buildQs(f)); },
    exportCSV: function(f) { return fetch('/api/export/csv' + buildQs(f), { headers: getHeaders() }); },
    exportJSON: function(f) { return fetch('/api/export/json' + buildQs(f), { headers: getHeaders() }); },
    exportPDF: function(f) { return fetch('/api/export/pdf' + buildQs(f), { headers: getHeaders() }); },
    exportDOCX: function(f) { return fetch('/api/export/docx' + buildQs(f), { headers: getHeaders() }); },
    sendAlert: async function(data) {
        var res = await fetch('/api/sms/send', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            var e = await res.json().catch(function() { return { message: 'Alert failed' }; });
            throw new Error(e.message);
        }
        return res.json();
    }
};

function downloadBlob(response, filename) {
    response.blob().then(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

export { api, downloadBlob };