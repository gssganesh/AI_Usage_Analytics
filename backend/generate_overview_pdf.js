const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument({ margin: 50 });
const outPath = 'd:\\project_codes\\antiAIusageprjct\\Student_AI_Dashboard_Overview.pdf';

const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

// Add styling
doc.fontSize(22).fillColor('#4338ca').text('Student AI Analytics Dashboard', { align: 'center' });
doc.fontSize(16).fillColor('#1e293b').text('Complete Project Overview & Documentation', { align: 'center' });
doc.moveDown(2);

doc.fontSize(11).fillColor('#334155').text(
    'The Student AI Analytics Dashboard is a comprehensive, full-stack web application designed to track, analyze, and interpret how students use Artificial Intelligence tools (like ChatGPT) and how those habits correlate with their academic performance, digital literacy, and mental well-being.',
    { align: 'justify' }
);
doc.moveDown();
doc.text('The application blends a powerful Node.js backend with a beautiful, modern React frontend built on a high-end "Glassmorphism" aesthetic.');
doc.moveDown(2);

doc.fontSize(14).fillColor('#0f766e').text('1. Core Architecture');
doc.moveDown(0.5);
doc.fontSize(10).fillColor('#334155');
doc.text('• Frontend (React + Vite): Uses recharts for native, interactive charting and custom CSS for the immersive glassmorphic UI. This means all the tiles and cards are visually translucent and float beautifully over a modern classroom-themed background.');
doc.text('• Backend (Node.js + Express + MySQL): An API server that connects to a relational database containing thousands of student records. It performs complex mathematical aggregations, sorts data, and packages it for the frontend in milliseconds.');
doc.text('• Global Filters Component: A centralized drop-down filter panel exists across all analytics views. It allows administrators to globally slice data by variables like State, Education Level, Stream, and Specific AI Tool.');
doc.moveDown();

doc.fontSize(14).fillColor('#0f766e').text('2. Navigational Tabs & Features');
doc.moveDown(0.5);

doc.fontSize(12).fillColor('#1e293b').text('A. AI Usage Dashboard (Main Analytics Hub)');
doc.fontSize(10).fillColor('#334155');
doc.text('• Top Statistics Layer: Shows core aggregates based on the active filters (Avg CGPA, Avg Exam Score, Avg AI Hours, Avg AI Helpfulness).');
doc.text('• Visualizations: Bar charts for grouping streams and regions, continuous line charts for studying trends, and numeric scatter plots for mapping individual test correlations against reported AI Helpfulness.');
doc.text('• Exports Engine: Admins can securely export the entire dataset mapped to their current filters as a CSV, JSON, PDF, or natively assembled OpenXML Microsoft Word (.docx) file.');
doc.moveDown();

doc.fontSize(12).fillColor('#1e293b').text('B. Actionable Insights & Alerts');
doc.fontSize(10).fillColor('#334155');
doc.text('• Mathematical Detection: The backend actively scans your filtered data and mathematically detects anomalies, presenting them as Insights.');
doc.text('• Impact Tiers: High Impact alerts are rendered in Red, Medium in Blue, and Low in Green badges.');
doc.text('• Telegram Alert System: Every insight card contains a button that effortlessly dispatches a live warning notification via the Telegram Bot API to an enrolled administrator\'s mobile device.');
doc.moveDown();

doc.fontSize(12).fillColor('#1e293b').text('C. AI Risk Assessment Pipeline');
doc.fontSize(10).fillColor('#334155');
doc.text('• Predictive Tiers: Sorts students into Risk Tiers based on a dangerous combination of high AI reliance and dropping manual study hours.');
doc.text('• Verification Flow: Reviewers visually "Verify" severe risks to ensure no student falls through the cracks and computes exact AI Efficiency markers.');
doc.moveDown();

doc.addPage();

doc.fontSize(12).fillColor('#1e293b').text('D. Tableau Reports Hub');
doc.fontSize(10).fillColor('#334155');
doc.text('• Immersive Native Embbeds: Bypasses clunky IFRAMES to implement native Javascript rendering of powerful dashboards (Learning Behaviors, Well-being, and Accessibility).');
doc.text('• Tableau Story Toggle: Stacks specialized interactive narrative presentation slides vertically to share discoveries natively in meetings.');
doc.moveDown();

doc.fontSize(12).fillColor('#1e293b').text('E. Individual Student Search (Student Profile)');
doc.fontSize(10).fillColor('#334155');
doc.text('• Allows an admin to input a specific Student ID to fetch and render an isolated profile card summarizing exactly what AI tool that student uses alongside their internet connection status and exact CGPA.');
doc.moveDown();

doc.fontSize(14).fillColor('#0f766e').text('3. The Design Aesthetic (UI/UX)');
doc.moveDown(0.5);
doc.fontSize(10).fillColor('#334155');
doc.text('• Immersive Glassmorphism: The entire application uses translucent tiles using backdrop-filter blur properties. Every element rests over a rich educational backdrop.');
doc.text('• Responsive Integrity: The dashboards utilize modern flexbox wrapping to seamlessly scale impact badges, button frames, and graphs onto varying monitor dimensions.');
doc.moveDown();

doc.fontSize(14).fillColor('#0f766e').text('4. Summary of Value');
doc.moveDown(0.5);
doc.fontSize(10).fillColor('#334155');
doc.text(
    'In totality, this project represents an Enterprise-Grade Educational Analytics Suite. You have built a pipeline capable of taking massive unorganized surveys about Student AI Habits and transforming them into beautiful charts, automated Telegram text alerts, predictive risk rosters, Word Doc generators, and native Tableau presentations!',
    { align: 'justify' }
);

doc.end();

stream.on('finish', () => {
    console.log('PDF Generated Successfully at ' + outPath);
});
