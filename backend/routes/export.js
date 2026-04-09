const express = require('express');
const PDFDocument = require('pdfkit');
const docx = require('docx');
const db = require('../config/db');

const router = express.Router();

const COLUMN_MAP = {
    student_id:         'student_id',
    name:               'student_id',
    age:                'age',
    gender:             'gender',
    state:              'state',
    city_tier:          'city_tier',
    education_level:    'education_level',
    academic_stream:    'stream',
    ai_tool:            'primary_ai_tool',
    ai_usage_frequency: 'ai_usage_frequency',
    ai_usage_hours_per_week:  'ai_usage_hours_per_week',
    ai_helpfulness_score:     'ai_helpfulness_score',
    study_hours_per_week:     'study_hours_per_week',
    cgpa:               'cgpa',
    exam_score:         'exam_score_percentage',
    assignment_completion_pct: 'assignments_completed_pct',
    digital_literacy_score:    'digital_literacy_score',
    mental_stress_score:       'mental_stress_score',
    internet_quality:   'internet_quality',
    scholarship_support: 'scholarship_received',
    plagiarism_flag:    'plagiarism_flag'
};

var TABLE_NAME = 'olsstudent_ai_dataset_csv';

function dbCol(f) { return '`' + (COLUMN_MAP[f] || f) + '`'; }

function buildSelect(fields) {
    return fields.map(function(f) { return dbCol(f) + ' AS ' + f; }).join(', ');
}

var ALL_FIELDS = Object.keys(COLUMN_MAP);

function buildFilters(query) {
    var conditions = [];
    var params = [];
    var map = { state: 'state', stream: 'academic_stream', education_level: 'education_level', ai_usage_frequency: 'ai_usage_frequency', city_tier: 'city_tier', ai_tool: 'ai_tool', gender: 'gender' };
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (query[k] && query[k] !== 'All') {
            conditions.push(dbCol(map[k]) + ' = ?');
            params.push(query[k]);
        }
    }
    var where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    return { where: where, params: params };
}

router.get('/csv', async function(req, res) {
    try {
        var f = buildFilters(req.query);
        var rows = await db.query('SELECT ' + buildSelect(ALL_FIELDS) + ' FROM ' + TABLE_NAME + ' ' + f.where, f.params);
        rows = rows[0];
        if (!rows || rows.length === 0) { return res.status(404).json({ message: 'No data.' }); }
        var headers = Object.keys(rows[0]);
        var csv = headers.join(',') + '\n';
        for (var i = 0; i < rows.length; i++) {
            var vals = [];
            for (var j = 0; j < headers.length; j++) {
                var v = rows[i][headers[j]];
                if (v === null || v === undefined) v = '';
                v = String(v);
                if (v.indexOf(',') >= 0 || v.indexOf('"') >= 0) { v = '"' + v.replace(/"/g, '""') + '"'; }
                vals.push(v);
            }
            csv += vals.join(',') + '\n';
        }
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=student_ai_data.csv');
        res.send(csv);
    } catch (e) { res.status(500).json({ message: 'CSV error: ' + e.message }); }
});

router.get('/json', async function(req, res) {
    try {
        var f = buildFilters(req.query);
        var rows = await db.query('SELECT ' + buildSelect(ALL_FIELDS) + ' FROM ' + TABLE_NAME + ' ' + f.where, f.params);
        rows = rows[0];
        if (!rows || rows.length === 0) { return res.status(404).json({ message: 'No data.' }); }
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=student_ai_data.json');
        res.json({ export_date: new Date().toISOString(), total: rows.length, data: rows });
    } catch (e) { res.status(500).json({ message: 'JSON error: ' + e.message }); }
});

router.get('/pdf', async function(req, res) {
    try {
        var f = buildFilters(req.query);
        var rows = await db.query('SELECT ' + buildSelect(ALL_FIELDS) + ' FROM ' + TABLE_NAME + ' ' + f.where, f.params);
        rows = rows[0];
        if (!rows || rows.length === 0) { return res.status(404).json({ message: 'No data.' }); }
        var doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=student_ai_report.pdf');
        doc.pipe(res);
        doc.fontSize(16).fillColor('#0f766e').text('Students AI Usage & Academic Performance Report', { align: 'center' });
        doc.fontSize(9).fillColor('#64748b').text('Generated: ' + new Date().toLocaleString() + ' | Records: ' + rows.length, { align: 'center' });
        doc.moveDown(0.4);
        var cols = ['Student ID', 'State', 'City Tier', 'Gender', 'Stream', 'AI Tool', 'Frequency', 'AI Hrs', 'Study Hrs', 'CGPA', 'Exam'];
        var keys = ['student_id', 'state', 'city_tier', 'gender', 'academic_stream', 'ai_tool', 'ai_usage_frequency', 'ai_usage_hours_per_week', 'study_hours_per_week', 'cgpa', 'exam_score'];
        var cw = [60, 60, 50, 45, 60, 60, 50, 45, 50, 40, 40];
        var sx = 30, sy = doc.y, x;
        doc.rect(sx, sy, 590, 18).fill('#0f766e');
        doc.fontSize(6.5).fillColor('#ffffff');
        x = sx;
        for (var c = 0; c < cols.length; c++) { doc.text(cols[c], x + 2, sy + 4, { width: cw[c] - 4, align: 'center' }); x += cw[c]; }
        sy += 18;
        doc.fontSize(6.5).fillColor('#334155');
        for (var i = 0; i < rows.length; i++) {
            if (sy > 510) {
                doc.addPage({ layout: 'landscape', margin: 30 }); sy = 30;
                doc.rect(sx, sy, 590, 18).fill('#0f766e');
                doc.fontSize(6.5).fillColor('#ffffff');
                x = sx;
                for (var c2 = 0; c2 < cols.length; c2++) { doc.text(cols[c2], x + 2, sy + 4, { width: cw[c2] - 4, align: 'center' }); x += cw[c2]; }
                sy += 18; doc.fontSize(6.5).fillColor('#334155');
            }
            doc.rect(sx, sy, 590, 14).fill(i % 2 === 0 ? '#f8fafc' : '#f1f5f9');
            x = sx;
            for (var j = 0; j < keys.length; j++) {
                doc.fillColor('#334155').text(String(rows[i][keys[j]] || ''), x + 2, sy + 3, { width: cw[j] - 4, align: 'center' });
                x += cw[j];
            }
            sy += 14;
        }
        doc.end();
    } catch (e) { res.status(500).json({ message: 'PDF error: ' + e.message }); }
});

router.get('/docx', async function(req, res) {
    try {
        var f = buildFilters(req.query);
        var rows = await db.query('SELECT ' + buildSelect(ALL_FIELDS) + ' FROM ' + TABLE_NAME + ' ' + f.where, f.params);
        rows = rows[0];
        if (!rows || rows.length === 0) { return res.status(404).json({ message: 'No data.' }); }
        
        var cols = ['Student ID', 'State', 'City Tier', 'Gender', 'Stream', 'AI Tool', 'Frequency', 'AI Hrs', 'Study Hrs', 'CGPA', 'Exam'];
        var keys = ['student_id', 'state', 'city_tier', 'gender', 'academic_stream', 'ai_tool', 'ai_usage_frequency', 'ai_usage_hours_per_week', 'study_hours_per_week', 'cgpa', 'exam_score'];

        var tableRows = [];
        
        // Header Row
        tableRows.push(new docx.TableRow({
            children: cols.map(c => new docx.TableCell({ 
                children: [new docx.Paragraph({ children: [new docx.TextRun({ text: c, bold: true })] })] 
            }))
        }));

        // Data Rows
        for (var i = 0; i < rows.length; i++) {
            tableRows.push(new docx.TableRow({
                children: keys.map(k => new docx.TableCell({ 
                    children: [new docx.Paragraph({ text: String(rows[i][k] || '') })] 
                }))
            }));
        }

        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    new docx.Paragraph({ children: [new docx.TextRun({ text: 'Students AI Usage & Academic Performance Report', bold: true, size: 28 })] }),
                    new docx.Paragraph({ children: [new docx.TextRun({ text: 'Generated: ' + new Date().toLocaleString() + ' | Records: ' + rows.length })] }),
                    new docx.Paragraph({ text: "" }),
                    new docx.Table({ rows: tableRows })
                ]
            }]
        });

        const buffer = await docx.Packer.toBuffer(doc);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename="student_ai_report.docx"');
        res.send(buffer);
    } catch (e) { res.status(500).json({ message: 'DOCX error: ' + e.message }); }
});

module.exports = router;