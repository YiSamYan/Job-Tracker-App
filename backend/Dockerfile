# Stage 1: Base dependencies and Chrome installation
FROM python:3.10-slim AS base

# Install required dependencies and clean up unnecessary files
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    unzip \
    gnupg2 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y --no-install-recommends \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set up environment variables for Chrome
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROME_DRIVER=/usr/local/bin/chromedriver

# Install ChromeDriver
ARG CHROMEDRIVER_VERSION=128.0.6613.119
RUN wget -q https://storage.googleapis.com/chrome-for-testing-public/$CHROMEDRIVER_VERSION/linux64/chromedriver-linux64.zip \
    && unzip chromedriver-linux64.zip -d /usr/local/bin/ \
    && rm chromedriver-linux64.zip

# Stage 2: Application dependencies
FROM base AS app

RUN apt-get update && apt-get install -y libpq-dev

# Set the working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Add static files to S3
# RUN python manage.py collectstatic --noinput

# Expose port 8000 for Django
EXPOSE 8000

# Apply database migrations and run the Django server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
