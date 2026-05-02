import os

BASE_URL = "https://shuilink.com/hibachi"

pages = [
    "index.html",
    "book-online.html",
    "menu.html",
    "cities.html",
    "gallery.html",
    "faq.html",
    "contact.html"
]

# 自动抓所有城市页面
city_pages = []
for file in os.listdir():
    if file.endswith("-hibachi.html"):
        city_pages.append(file)

all_pages = pages + city_pages

xml = ['<?xml version="1.0" encoding="UTF-8"?>']
xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

for page in all_pages:
    url = f"{BASE_URL}/{page}"
    xml.append(f"""
    <url>
        <loc>{url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    """)

xml.append('</urlset>')

with open("sitemap.xml", "w") as f:
    f.write("\n".join(xml))

print("✅ sitemap generated")