from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

def init_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model, needed in Docker
    chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
    
    try:
        driver = webdriver.Chrome(service=Service('/usr/local/bin/chromedriver-linux64/chromedriver'), options=chrome_options)
    except Exception as e:
        return {'error': 'Cannot locate Chrome or Chromedriver.'}

    return driver

def scrape_job_details(url):

    # Indeed and LinkedIn blocks scrapping but the prove of concept is there
    if 'indeed.com' in url:
        return {'title': "Wizard", 'company': "Hogwarts", 'description': "You're a Wizard Harry"} #return scrape_indeed(url)
    elif 'linkedin.com' in url:
        return {'title': "Wizard", 'company': "Hogwarts", 'description': "You're a Wizard Harry"} #return scrape_linkedin(url)
    else:
        raise ValueError("Unsupported URL. Only Indeed and LinkedIn URLs are supported.")

def scrape_indeed(url):
    driver = init_driver()

    try:
        driver.get(url)
    except Exception as e:
        return {'error': 'Invalid URL. Ex. https://www.youtube.com/'}
    

    time.sleep(5)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    driver.quit()

    try:
        title_element = soup.find('h2', {'class': 'jobsearch-JobInfoHeader-title css-1t78hkx e1tiznh50'})
        title = title_element.text.strip() if title_element else 'Title not found'

        company_element = soup.find('a', {'class': 'css-1ioi40ne19afand0'})
        company = company_element.text.strip() if company_element else 'Company not found'

        description_element = soup.find('div', {'id': 'jobDescriptionText'})
        description = description_element.text.strip() if description_element else 'Description not found'

    except Exception as e:
        raise ValueError(f"Error scraping Indeed: {str(e)}")

    return {'title': title, 'company': company, 'description': description}

def scrape_linkedin(url):
    driver = init_driver()

    try:
        driver.get(url)
    except Exception as e:
        return {'error': 'Invalid URL. Ex. https://www.youtube.com/'}
    

    time.sleep(5)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    driver.quit()

    try:
        title_element = soup.find('h1', {'class': 'top-card-layout__title font-sans text-lg papabear:text-xl font-bold leading-open text-color-text mb-0 topcard__title'})
        title = title_element.text.strip() if title_element else 'Title not found'

        company_element = soup.find('a', {'class': 'topcard__org-name-link topcard__flavor--black-link'})
        company = company_element.text.strip() if company_element else 'Company not found'

        description_element = soup.find('div', {'class': 'show-more-less-html__markup relative overflow-hidden'})
        description = description_element.text.strip() if description_element else 'Description not found'
    except Exception as e:
        raise ValueError(f"Error scraping Indeed: {str(e)}")

    return {'title': title, 'company': company, 'description': description}