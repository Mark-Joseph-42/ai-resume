document.addEventListener('DOMContentLoaded', () => {
    const resumeInput = document.getElementById('resume-upload');
    const fileNameLabel = document.getElementById('file-name-label');
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = document.getElementById('btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const jobDescription = document.getElementById('job-description');
    const jsonPreview = document.getElementById('json-preview');
    const logContainer = document.getElementById('log-container');
    const matchScore = document.getElementById('match-score');
    const gaugeBar = document.getElementById('gauge-bar');
    const tempSlider = document.getElementById('temp-slider');
    const tempVal = document.getElementById('temp-val');

    // Update Temperature Display
    tempSlider.addEventListener('input', (e) => {
        tempVal.textContent = e.target.value;
    });

    // File Selection Feedback
    resumeInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameLabel.textContent = e.target.files[0].name;
            addLog(`Resume selected: ${e.target.files[0].name}`, 'SUCCESS');
        }
    });

    // Analysis Execution
    analyzeBtn.addEventListener('click', async () => {
        const file = resumeInput.files[0];
        const jd = jobDescription.value;

        if (!file) {
            alert('Please upload a resume (PDF).');
            return;
        }
        if (!jd || jd.length < 20) {
            alert('Please provide a job description (at least 20 chars).');
            return;
        }

        setLoading(true);
        addLog('Initializing analysis engine...', 'INFO');
        addLog('Extracting text from PDF (pdfminer.six)...', 'DEBUG');

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_description', jd);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Analysis failed');
            }

            const data = await response.json();
            addLog('Gemma-3-27b-it processing complete.', 'SUCCESS');
            addLog(`Token utilization: ${JSON.stringify(data.matched_skills.length)} skills found.`, 'DEBUG');
            
            updateUI(data);
            addLog('Analysis results synchronized.', 'SUCCESS');

        } catch (err) {
            addLog(`Error: ${err.message}`, 'ERROR');
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        analyzeBtn.disabled = isLoading;
        btnText.textContent = isLoading ? 'Processing...' : 'Execute Analysis';
        loadingSpinner.classList.toggle('hidden', !isLoading);
    }

    function addLog(message, level = 'INFO') {
        const p = document.createElement('p');
        const time = new Date().toLocaleTimeString();
        p.innerHTML = `<span class="text-slate-500">[${time}]</span> <span class="${getLevelClass(level)}">${level}:</span> ${message}`;
        logContainer.prepend(p);
    }

    function getLevelClass(level) {
        switch (level) {
            case 'SUCCESS': return 'text-emerald-400';
            case 'ERROR': return 'text-rose-400';
            case 'WARNING': return 'text-amber-400';
            case 'DEBUG': return 'text-blue-400';
            default: return 'text-indigo-400';
        }
    }

    function updateUI(data) {
        // Update Match Percentage & Gauge
        matchScore.textContent = `${Math.round(data.match_percentage)}%`;
        const rotation = 45 + (Math.round(data.match_percentage) * 1.8);
        gaugeBar.style.transform = `rotate(${rotation}deg)`;
        gaugeBar.style.borderTopColor = '#3b82f6';
        gaugeBar.style.borderRightColor = '#3b82f6';

        // Update JSON Preview
        jsonPreview.textContent = JSON.stringify(data, null, 2);

        // Update Radar Chart
        updateRadarChart(data);

        // Update Recommendations
        renderRecommendations(data);
    }

    function renderRecommendations(data) {
        const section = document.getElementById('recommendations-section');
        section.classList.remove('hidden');

        // Courses
        const courseList = document.getElementById('course-list');
        courseList.innerHTML = '';
        data.recommended_courses.forEach(c => {
            const div = document.createElement('div');
            div.className = 'p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer';
            div.innerHTML = `
                <p class="text-xs font-bold text-slate-800">${c.name}</p>
                <p class="text-[10px] text-slate-500 mt-1">${c.platform}</p>
            `;
            courseList.appendChild(div);
        });

        // Keywords
        const keywordList = document.getElementById('keyword-list');
        keywordList.innerHTML = '';
        data.missing_skills.forEach(s => {
            const span = document.createElement('span');
            span.className = 'px-2 py-1 bg-rose-50 text-rose-600 rounded text-[10px] font-medium border border-rose-100';
            span.textContent = s;
            keywordList.appendChild(span);
        });

        // Projects
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';
        data.project_suggestions.forEach(p => {
            const div = document.createElement('div');
            div.className = 'bg-slate-50 p-3 rounded-lg border border-slate-100';
            div.innerHTML = `
                <p class="text-xs font-bold text-slate-700">${p.title}</p>
                <p class="text-[10px] text-slate-600 mt-1 line-clamp-2">${p.description}</p>
                <div class="flex gap-1 mt-2">
                    ${p.skills_covered.map(s => `<span class="text-[8px] px-1 bg-white border border-slate-200 rounded text-slate-500">${s}</span>`).join('')}
                </div>
            `;
            projectList.appendChild(div);
        });
    }

    function updateRadarChart(data) {
        const svg = document.getElementById('radar-chart');
        svg.innerHTML = ''; // Clear

        // Background layer
        const bg1 = createPolygon('100,20 170,60 170,140 100,180 30,140 30,60', '#e5e7eb', 'none');
        const bg2 = createPolygon('100,60 135,80 135,120 100,140 65,120 65,80', '#e5e7eb', 'none');
        svg.appendChild(bg1);
        svg.appendChild(bg2);

        const skills = data.matched_skills.slice(0, 6);
        const center = 100;
        const radius = 80;
        const points = [];

        skills.forEach((s, i) => {
            const angle = (i * 2 * Math.PI / skills.length) - (Math.PI / 2);
            const score = s.relevance_score || 0.5;
            const x = center + radius * score * Math.cos(angle);
            const y = center + radius * score * Math.sin(angle);
            points.push(`${x},${y}`);

            // Label
            const lx = center + (radius + 15) * Math.cos(angle);
            const ly = center + (radius + 15) * Math.sin(angle);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', lx);
            text.setAttribute('y', ly);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#64748b');
            text.setAttribute('font-size', '8');
            text.textContent = s.skill.substring(0, 10);
            svg.appendChild(text);
        });

        if (points.length > 0) {
            const dataPoly = createPolygon(points.join(' '), '#4f46e5', 'rgba(79, 70, 229, 0.4)');
            dataPoly.setAttribute('stroke-width', '2');
            svg.appendChild(dataPoly);
        }
    }

    function createPolygon(points, stroke, fill) {
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', points);
        poly.setAttribute('stroke', stroke);
        poly.setAttribute('fill', fill);
        return poly;
    }
});
