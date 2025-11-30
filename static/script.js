class JobScraperUI {
    constructor() {
        this.isScraping = false;
        this.statusInterval = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('startScraping').addEventListener('click', () => {
            this.startScraping();
        });
    }

    async startScraping() {
        const jobTitles = document.getElementById('jobTitles').value
            .split('\n')
            .map(title => title.trim())
            .filter(title => title.length > 0);

        const locations = document.getElementById('locations').value
            .split('\n')
            .map(location => location.trim())
            .filter(location => location.length > 0);

        const jobsPerSearch = parseInt(document.getElementById('jobsPerSearch').value);

        if (jobTitles.length === 0 || locations.length === 0) {
            this.showError('Please enter at least one job title and one location');
            return;
        }

        if (jobsPerSearch < 1 || jobsPerSearch > 50) {
            this.showError('Please enter a number between 1 and 50 for jobs per search');
            return;
        }

        this.isScraping = true;
        this.updateUIForScraping();

        try {
            const response = await fetch('/start_scraping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_titles: jobTitles,
                    locations: locations,
                    jobs_per_search: jobsPerSearch
                })
            });

            const data = await response.json();

            if (data.error) {
                this.showError(data.error);
                return;
            }

            this.startStatusPolling();

        } catch (error) {
            this.showError('Failed to start scraping: ' + error.message);
        }
    }

    startStatusPolling() {
        this.statusInterval = setInterval(async () => {
            try {
                const response = await fetch('/scraping_status');
                const status = await response.json();

                this.updateStatusDisplay(status);

                if (!status.is_running) {
                    clearInterval(this.statusInterval);
                    this.isScraping = false;
                    this.updateUIAfterScraping();

                    if (status.error) {
                        this.showError(status.error);
                    } else if (status.results) {
                        this.showResults(status.results);
                    }
                }
            } catch (error) {
                console.error('Error polling status:', error);
            }
        }, 2000);
    }

    updateStatusDisplay(status) {
        const statusElement = document.getElementById('status');
        const statusContent = document.getElementById('statusContent');
        const progressFill = document.getElementById('progressFill');

        statusElement.classList.remove('hidden');

        if (status.is_running) {
            const progress = status.total > 0 ? (status.progress / status.total) * 100 : 0;
            progressFill.style.width = `${progress}%`;

            statusContent.innerHTML = `
                <div class="status-update">
                    <strong>🔍 Scraping in progress...</strong><br>
                    Progress: ${status.progress}/${status.total} searches<br>
                    Jobs found: ${status.jobs_found}<br>
                    ${status.current_search ? `Current: ${status.current_search}` : ''}
                </div>
            `;
        }
    }

    showResults(results) {
        const resultsElement = document.getElementById('results');
        const resultsContent = document.getElementById('resultsContent');
        const downloadLinks = document.getElementById('downloadLinks');

        resultsElement.classList.remove('hidden');

        // Show summary
        resultsContent.innerHTML = `
            <div class="status-update">
                <strong>🎉 Scraping completed!</strong><br>
                Total jobs found: ${results.total_jobs}<br>
                Files have been saved and are ready for download.
            </div>
        `;

        // Show download links
        if (results.file_paths) {
            const csvFilename = results.file_paths.csv.split('/').pop();
            const excelFilename = results.file_paths.excel.split('/').pop();

            downloadLinks.innerHTML = `
                <h3>📥 Download Results</h3>
                <a href="/download/${csvFilename}" class="download-btn">Download CSV</a>
                <a href="/download/${excelFilename}" class="download-btn">Download Excel</a>
            `;
        }

        // Show sample jobs
        if (results.jobs && results.jobs.length > 0) {
            const sampleJobs = results.jobs.slice(0, 3);
            let jobsHTML = '<h3>📋 Sample Jobs</h3>';

            sampleJobs.forEach(job => {
                jobsHTML += `
                    <div class="job-card">
                        <div class="job-title">${this.escapeHtml(job.title)}</div>
                        <div class="job-company">🏢 ${this.escapeHtml(job.company)}</div>
                        <div class="job-location">📍 ${this.escapeHtml(job.location)}</div>
                        <div class="job-type">${this.escapeHtml(job.job_type)} | ${this.escapeHtml(job.seniority_level)}</div>
                    </div>
                `;
            });

            resultsContent.innerHTML += jobsHTML;
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error');
        const errorContent = document.getElementById('errorContent');

        errorElement.classList.remove('hidden');
        errorContent.textContent = message;

        this.updateUIAfterScraping();
    }

    updateUIForScraping() {
        document.getElementById('startScraping').disabled = true;
        document.getElementById('startScraping').textContent = '⏳ Scraping...';
        document.getElementById('error').classList.add('hidden');
        document.getElementById('results').classList.add('hidden');
    }

    updateUIAfterScraping() {
        document.getElementById('startScraping').disabled = false;
        document.getElementById('startScraping').textContent = '🚀 Start Scraping';
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JobScraperUI();
});