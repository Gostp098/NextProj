import requests
import csv
import json
from bs4 import BeautifulSoup
import time
from datetime import datetime
import re
from urllib.parse import quote, urljoin
import warnings

warnings.filterwarnings('ignore')

class DetailedJobScraper:
    def __init__(self):
        self.all_jobs = []
        self.session = requests.Session()
        self.setup_session()

    def setup_session(self):
        """Setup session with proper headers"""
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
        })

    def search_jobs(self, job_titles, locations, jobs_per_search):
        """Search for jobs and get descriptions"""
        print(f"\n🚀 Starting LinkedIn Job Search")
        print(f"💼 Jobs: {', '.join(job_titles)}")
        print(f"🌍 Locations: {', '.join(locations)}")
        print(f"📥 Target: {jobs_per_search} jobs per combination")
        print("=" * 60)

        total_combinations = len(job_titles) * len(locations)
        current_combo = 1

        for job_title in job_titles:
            for location in locations:
                print(f"\n🔍 Search {current_combo}/{total_combinations}:")
                print(f"   Job: {job_title}")
                print(f"   Location: {location}")

                jobs = self.single_search(job_title, location, jobs_per_search)
                self.all_jobs.extend(jobs)
                current_combo += 1

                print(f"   ✅ Found {len(jobs)} jobs with descriptions")
                time.sleep(2)

        print(f"\n🎉 Search completed! Total jobs collected: {len(self.all_jobs)}")
        return self.all_jobs

    def single_search(self, job_title, location, max_jobs):
        """Perform a single job search"""
        jobs = []
        
        try:
            # Use LinkedIn's public jobs search page
            search_url = f"https://www.linkedin.com/jobs/search/?keywords={quote(job_title)}&location={quote(location)}"
            print(f"   🔗 Searching: {search_url[:80]}...")
            
            response = self.session.get(search_url, timeout=15)
            
            if response.status_code == 200:
                # Use html.parser instead of lxml
                job_listings = self.parse_search_results(response.content, max_jobs)
                print(f"   📋 Found {len(job_listings)} job listings")
                
                # Get detailed information for each job
                detailed_jobs = []
                for i, job in enumerate(job_listings):
                    if i >= max_jobs:
                        break
                        
                    detailed_job = self.get_job_details(job)
                    if detailed_job:
                        detailed_job.update({
                            'search_job': job_title,
                            'search_location': location
                        })
                        detailed_jobs.append(detailed_job)
                        print(f"     ✅ ({i+1}/{len(job_listings)}) {job['title'][:50]}...")
                    
                    time.sleep(1.5)  # Respectful delay
                
                return detailed_jobs
            else:
                print(f"   ❌ HTTP {response.status_code}: {response.reason}")
                
        except Exception as e:
            print(f"   ⚠️ Search error: {e}")
            
        return []

    def parse_search_results(self, html_content, max_jobs):
        """Parse job listings from search results using html.parser"""
        # Use html.parser instead of lxml
        soup = BeautifulSoup(html_content, 'html.parser')
        jobs = []
        
        # Try different selectors for job cards
        selectors = [
            'div.base-card',
            'li.job-result-card',
            'div.job-search-card',
            'section.jobs-search__results-list li',
            '[data-entity-urn*="jobPosting"]'
        ]
        
        for selector in selectors:
            job_cards = soup.select(selector)
            if job_cards:
                print(f"   🔎 Found {len(job_cards)} job cards with: {selector}")
                
                for card in job_cards[:max_jobs]:
                    job_data = self.extract_job_info(card)
                    if job_data and job_data.get('title') not in ['N/A', '']:
                        jobs.append(job_data)
                break
        
        return jobs

    def extract_job_info(self, card):
        """Extract job information from a job card"""
        try:
            # Title
            title_selectors = [
                'h3.base-search-card__title',
                'h3.job-result-card__title',
                '.base-search-card__title',
                'span.sr-only'
            ]
            
            title = 'N/A'
            for selector in title_selectors:
                title_elem = card.select_one(selector)
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    break
            
            # Company
            company_selectors = [
                'h4.base-search-card__subtitle',
                'a.job-result-card__company',
                '.base-search-card__subtitle'
            ]
            
            company = 'N/A'
            for selector in company_selectors:
                company_elem = card.select_one(selector)
                if company_elem:
                    company = company_elem.get_text(strip=True)
                    break
            
            # Location
            location_selectors = [
                'span.job-search-card__location',
                'span.job-result-card__location',
                '.job-search-card__location'
            ]
            
            location = 'N/A'
            for selector in location_selectors:
                location_elem = card.select_one(selector)
                if location_elem:
                    location = location_elem.get_text(strip=True)
                    break
            
            # Link
            link_selectors = [
                'a.base-card__full-link',
                'a.job-result-card__full-card-link',
                '.base-card__full-link'
            ]
            
            link = 'N/A'
            for selector in link_selectors:
                link_elem = card.select_one(selector)
                if link_elem and link_elem.get('href'):
                    link = link_elem.get('href')
                    if link.startswith('/'):
                        link = urljoin('https://www.linkedin.com', link)
                    break
            
            return {
                'title': title,
                'company': company,
                'location': location,
                'link': link
            }
            
        except Exception as e:
            print(f"     ⚠️ Error parsing job card: {e}")
            return None

    def get_job_details(self, job):
        """Get detailed job information including description"""
        if not job.get('link') or job['link'] == 'N/A':
            return None
            
        try:
            job_url = job['link']
            print(f"     🔍 Fetching details: {job_url[:80]}...")
            
            response = self.session.get(job_url, timeout=15)
            
            if response.status_code == 200:
                # Use html.parser instead of lxml
                soup = BeautifulSoup(response.content, 'html.parser')
                
                description = self.extract_description(soup)
                job_type = self.extract_job_type(soup)
                seniority = self.extract_seniority_level(soup)
                
                detailed_job = {
                    'job_id': self.extract_job_id(job['link']),
                    'title': job['title'],
                    'company': job['company'],
                    'location': job['location'],
                    'link': job['link'],
                    'job_type': job_type,
                    'seniority_level': seniority,
                    'industry': "Not specified",
                    'description': description,
                    'description_length': len(description),
                    'scraped_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                
                return detailed_job
            else:
                print(f"     ❌ HTTP {response.status_code} for job details")
                
        except Exception as e:
            print(f"     ⚠️ Could not get job details: {e}")
            
        return None

    def extract_description(self, soup):
        """Extract job description from page"""
        selectors = [
            '.description__text',
            '.show-more-less-html__markup',
            '.jobs-box__html-content',
            '.description',
            '.jobs-description__content',
            'div.description__text'
        ]

        for selector in selectors:
            desc_elem = soup.select_one(selector)
            if desc_elem:
                text = desc_elem.get_text(strip=True)
                text = re.sub(r'\s+', ' ', text)
                return text[:5000]

        return "Description not available"

    def extract_job_type(self, soup):
        """Extract job type"""
        selectors = [
            '.jobs-description-details__list-item span',
            '.jobs-unified-top-card__job-insight',
            '.jobs-details-top-card__job-type'
        ]

        for selector in selectors:
            elements = soup.select(selector)
            for elem in elements:
                text = elem.get_text(strip=True).lower()
                if any(word in text for word in ['full-time', 'part-time', 'contract', 'internship', 'temporary']):
                    return text.title()

        return "Not specified"

    def extract_seniority_level(self, soup):
        """Extract seniority level"""
        selectors = [
            '.jobs-description-details__list-item span',
            '.jobs-unified-top-card__job-insight'
        ]

        for selector in selectors:
            elements = soup.select(selector)
            for elem in elements:
                text = elem.get_text(strip=True).lower()
                if any(level in text for level in ['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'manager', 'director']):
                    return text.title()

        return "Not specified"

    def extract_job_id(self, link):
        """Extract job ID from link"""
        if '-' in link:
            return link.split('-')[-1]
        elif '=' in link:
            return link.split('=')[-1]
        elif '/' in link:
            parts = link.split('/')
            for part in reversed(parts):
                if part.isdigit():
                    return part
        return 'N/A'

    def save_results(self, filename_prefix="linkedin_jobs"):
        """Save results to CSV and JSON files (without pandas)"""
        if not self.all_jobs:
            print("❌ No data to save")
            return None

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save to CSV
        csv_filename = f"static/{filename_prefix}_{timestamp}.csv"
        if self.all_jobs:
            with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = self.all_jobs[0].keys()
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for job in self.all_jobs:
                    writer.writerow(job)

        # Save to JSON
        json_filename = f"static/{filename_prefix}_{timestamp}.json"
        with open(json_filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(self.all_jobs, jsonfile, indent=2, ensure_ascii=False)

        print(f"💾 Files saved:")
        print(f"   - {csv_filename}")
        print(f"   - {json_filename}")

        return {
            'csv': csv_filename,
            'json': json_filename
        }