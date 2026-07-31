import os
import time
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from notificationSender import *

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SECRET_KEY")

# print("URL:", url)
# print("-" * 30)
# print("KEY:", key)

if not url or not key:
    raise ValueError("Variáveis de ambiente VITE_SUPABASE_URL ou SUPABASE_SECRET_KEY não foram encontradas no .env")

supabase: Client = create_client(url, key)

response = (
    supabase.table("post_its")
    .select("created_at, title, content, deadline, responsible, location")
    .neq("done", True)
    .execute()
)
# Access the data
data = response.data   

#for post in data:
#    sendPlainText("351933329124", post["title"], post["deadline"], post["content"], post["responsible"], post["location"])
#    time.sleep(10)
#

for post in data:
    sendPlainAlert("351914595490", post["title"], post["deadline"], post["content"], post["responsible"], post["location"])
    time.sleep(10)