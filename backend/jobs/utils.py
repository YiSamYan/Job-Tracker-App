from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import WebDriverException, TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
from openai import OpenAI
import logging
import json
import os
from dotenv import load_dotenv
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# env_path = Path(__file__).resolve().parents[2] / '.env.docker'
# load_dotenv(dotenv_path=env_path)
# client = OpenAI(api_key=os.getenv('OPEN_AI_KEY'))

openai_api_key = os.getenv('OPEN_AI_KEY')

if not openai_api_key:
    raise ValueError("OpenAI API key is missing. Please check your environment variables.")

client = OpenAI(api_key=openai_api_key)

def query_chatgpt(page_text):
    """
    Send the scraped text to ChatGPT and process the response into a structured dictionary.
    """
    try:
        messages = [
            {
                "role": "system",
                "content": "You are an assistant that extracts job descriptions from raw text and identifies key parts such as title, company, description, and requirements. Please do not reword any of the text."
            },
            {
                "role": "user",
                "content": f"Is the following text a valid job description? If yes, return it in the following JSON format: {{'title': title, 'company': company, 'description': description, 'requirements': requirements (if any)}}. If it's not a valid job description, just return 'not valid/cannot be processed'.\n\n{page_text}"
            }
        ]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.5,
            max_tokens=1000,
        )

        # Extract the response as a dictionary and get the content
        response_dict = response.to_dict()
        result_text = response_dict['choices'][0]['message']['content'].strip()

        # Log the raw response for debugging purposes
        logger.info(f"Raw response from ChatGPT: {result_text}")

        if "not valid" in result_text.lower() or "cannot be processed" in result_text.lower():
            return "Not valid/cannot be processed. Please note certain websites block scraping attempts."

        # Attempt to parse the response as JSON
        try:
            job_details = json.loads(result_text)
            return job_details
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode ChatGPT response as JSON: {str(e)}")
            logger.info(f"ChatGPT raw response: {result_text}")
            return "Error: ChatGPT response could not be parsed as a valid job description."

    except Exception as e:
        logger.error(f"Error occurred while querying ChatGPT: {str(e)}")
        return f"Error: Failed to process text with ChatGPT - {str(e)}"

def scrape_job_details(url):
    try:
        # Configure Chrome options
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920x1080')
        options.add_argument('--disable-extensions')
        options.add_argument('--start-maximized')
        options.add_argument('--disable-infobars')

        # Initialize Chrome WebDriver
        logger.info(f"Starting WebDriver for URL: {url}")
        driver = webdriver.Chrome(options=options)
        
        driver.set_page_load_timeout(30)

        # Try loading the URL
        driver.get(url)

        # Extract text from the page
        try:
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')

            page_text = soup.body.get_text(separator="\n").strip()
            
            logger.info(f"Successfully scraped the page content from: {url}")
        except NoSuchElementException as e:
            logger.error(f"Failed to find the body tag in the page: {url} - {e}")
            page_text = ""
        finally:
            # Ensure the driver is closed even if an error occurs
            driver.quit()

        # If no page text found, return an error
        if not page_text:
            return "Error: Could not extract text from the page."

        # Pass the extracted text to ChatGPT for validation and processing
        chatgpt_result = query_chatgpt(page_text)

        return chatgpt_result

    except TimeoutException as e:
        logger.error(f"Page load timed out for URL: {url} - {e}")
        return "Error: Page load timeout occurred."
    
    except WebDriverException as e:
        logger.error(f"WebDriver error occurred while trying to load URL: {url} - {e}")
        return f"Error: WebDriver error occurred: {str(e)}"
    
    except Exception as e:
        logger.error(f"An unexpected error occurred while scraping URL: {url} - {e}")
        return f"Error: Unexpected issue occurred: {str(e)}"