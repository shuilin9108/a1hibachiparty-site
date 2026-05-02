# generate.py (SEO升级版)

from bs4 import BeautifulSoup

# ===== 模板 =====
with open("long-island-hibachi.html", "r", encoding="utf-8") as f:
    template = f.read()

# ===== 城市页面 =====
with open("cities.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

cards = soup.select(".city-card")

cities = []
for c in cards:
    h3 = c.find("h3")
    if h3:
        cities.append(h3.text.strip())

print("城市:", cities)

# ===== 每个城市的独特SEO文案 =====
city_descriptions = {
    "Brooklyn": "Perfect for rooftop parties, brownstone gatherings, and private urban events.",
    "Queens": "Ideal for family events, large gatherings, and multi-generational celebrations.",
    "Manhattan": "Best for luxury private dining experiences and upscale home events.",
    "Long Island": "Great for backyard parties, outdoor setups, and private chef experiences.",
    "Staten Island": "Perfect for spacious backyard events and family-style celebrations.",
    "Bronx": "Great for local celebrations, birthdays, and community-based events.",
    "Jersey City": "Ideal for modern apartments, rooftops, and city-style events.",
    "Hoboken": "Perfect for stylish, compact, and social gatherings.",
    "Westchester": "Best for suburban luxury homes and premium private events.",
    "Scarsdale": "High-end private chef experiences in elegant residential settings.",
    "Greenwich": "Premium luxury hibachi catering for upscale homes and events.",
    "Great Neck": "Popular for upscale family gatherings and backyard chef experiences.",
    "Manhasset": "Perfect for high-end private dining and premium events.",
    "Roslyn": "Great for intimate family celebrations and private parties.",
    "Port Washington": "Ideal for waterfront homes and outdoor hibachi setups.",
    "Garden City": "Well suited for organized family events and celebrations.",
    "Summit": "Great for suburban events and private gatherings.",
    "Short Hills": "Luxury private chef experience for upscale homes."
}

# ===== 生成页面 =====
for city in cities:

    filename = city.lower().replace(" ", "-") + "-hibachi.html"

    new_html = template

    # 替换基础
    new_html = new_html.replace("Long Island", city)
    new_html = new_html.replace("Long%20Island", city.replace(" ", "%20"))

    # ===== 插入独特内容 =====
    unique_text = city_descriptions.get(city, f"Private hibachi catering in {city} for all types of events.")

    new_html = new_html.replace(
        "Hibachi by ShuiLink brings a private hibachi chef experience to",
        f"{unique_text} Hibachi by ShuiLink brings a private hibachi chef experience to"
    )

    # 写入
    with open(filename, "w", encoding="utf-8") as f:
        f.write(new_html)

    print("生成:", filename)

print("✅ SEO优化城市页生成完成")