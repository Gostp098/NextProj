from flask import Flask, render_template, request, jsonify, send_file
from scraper import DetailedJobScraper
import os
import threading
from datetime import datetime

app = Flask(__name__)

# Global variable to store scraping status and results
scraping_status = {
    'is_running': False,
    'progress': 0,
    'total': 0,
    'current_search': '',
    'jobs_found': 0,
    'results': None,
    'error': None
}

def run_scraper(job_titles, locations, jobs_per_search):
    """Run the scraper in a separate thread"""
    global scraping_status
    
    try:
        scraper = DetailedJobScraper()
        scraping_status['total'] = len(job_titles) * len(locations)
        scraping_status['jobs_found'] = 0
        
        # Perform search
        jobs = scraper.search_jobs(job_titles, locations, jobs_per_search)
        
        # Save results
        file_paths = scraper.save_results()
        
        scraping_status['results'] = {
            'jobs': jobs,
            'file_paths': file_paths,
            'total_jobs': len(jobs)
        }
        scraping_status['is_running'] = False
        scraping_status['progress'] = scraping_status['total']
        
    except Exception as e:
        scraping_status['error'] = str(e)
        scraping_status['is_running'] = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_scraping', methods=['POST'])
def start_scraping():
    global scraping_status
    
    if scraping_status['is_running']:
        return jsonify({'error': 'Scraping is already running'})
    
    data = request.json
    job_titles = data.get('job_titles', [])
    locations = data.get('locations', [])
    jobs_per_search = data.get('jobs_per_search', 5)
    
    if not job_titles or not locations:
        return jsonify({'error': 'Job titles and locations are required'})
    
    # Reset status
    scraping_status = {
        'is_running': True,
        'progress': 0,
        'total': len(job_titles) * len(locations),
        'current_search': '',
        'jobs_found': 0,
        'results': None,
        'error': None
    }
    
    # Start scraping in a separate thread
    thread = threading.Thread(
        target=run_scraper,
        args=(job_titles, locations, jobs_per_search)
    )
    thread.daemon = True
    thread.start()
    
    return jsonify({'message': 'Scraping started successfully'})

@app.route('/scraping_status')
def get_scraping_status():
    return jsonify(scraping_status)

@app.route('/download/<filename>')
def download_file(filename):
    try:
        return send_file(f'static/{filename}', as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'})

if __name__ == '__main__':
    # Create static directory if it doesn't exist
    if not os.path.exists('static'):
        os.makedirs('static')
    
    app.run(debug=True, host='0.0.0.0', port=5000)