import requests
print(requests.__version__)
import json
import logging

# Setup basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# OAuth Credentials
CLIENT_ID = 'c3c40ced430544298ddf3cfc8b205e93'
CLIENT_SECRET = 'df34d41018f638dc1a10607207a10b89'
REFRESH_TOKEN = '73ffa4316dba1e26b7f12c9862d1a095-1714484570'
SHOP_NAME = '1c6332-64'  # e.g., 'my-shop' if your shop URL is my-shop.myshopify.com
OAUTH_TOKEN_URL = f"https://{SHOP_NAME}.myshopify.com/admin/oauth/access_token"
API_BASE_URL = f"https://{SHOP_NAME}.myshopify.com/admin/api/2024-04"

def get_access_token():
    payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': REFRESH_TOKEN,
        'grant_type': 'refresh_token'
    }
    response = requests.post(OAUTH_TOKEN_URL, json=payload)
    if response.status_code == 200:
        try:
            return response.json()['access_token']
        except json.JSONDecodeError:
            logging.error(f"Failed to decode JSON: {response.text}")
    else:
        logging.error(f"Failed to get access token: {response.status_code} {response.text}")
    return None

def get_products(access_token):
    products = []
    url = f"{API_BASE_URL}/products.json"
    headers = {"X-Shopify-Access-Token": access_token}
    while url:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            try:
                data = response.json()
                products.extend(data['products'])
                next_link = response.links.get('next', {}).get('url')
                url = next_link
                logging.info(f"Fetched {len(data['products'])} products.")
            except json.JSONDecodeError:
                logging.error(f"Failed to decode JSON: {response.text}")
                break
        else:
            logging.error(f"Failed to fetch products: {response.status_code} {response.text}")
            break
    return products

def update_product_tags(access_token, product_id, tags):
    url = f"{API_BASE_URL}/products/{product_id}.json"
    payload = {"product": {"id": product_id, "tags": ", ".join(tags)}}
    headers = {"X-Shopify-Access-Token": access_token}
    response = requests.put(url, json=payload, headers=headers)
    if response.status_code == 200:
        logging.info(f"Successfully updated tags for product {product_id}.")
    else:
        logging.error(f"Failed to update product tags: {response.status_code} {response.text}")

def main():
    access_token = get_access_token()
    if access_token:
        products = get_products(access_token)
        for product in products:
            tags = ["example_tag1", "example_tag2"]  # Implement actual logic here
            update_product_tags(access_token, product['id'], tags)

if __name__ == "__main__":
    main()