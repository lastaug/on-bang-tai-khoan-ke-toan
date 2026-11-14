import json

with open("data/accounts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

js_content = f"// Du lieu he thong tai khoan ke toan theo Thong tu 99/2025/TT-BTC\nexport const ACCOUNTS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open("src/data/accountsData.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Generated src/data/accountsData.js successfully!")
