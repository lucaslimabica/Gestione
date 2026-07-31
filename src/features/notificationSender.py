import requests
import datetime

url = "https://whatsapp.liberica.pt/message/sendText/Lucas"

from datetime import datetime

def sendPlainAlert(number, title, due_date, text, responsible, location):
    if due_date:
        date_obj = datetime.fromisoformat(due_date)
        date_str = f" para *{date_obj.strftime('%d/%m')}*"
    else:
        date_str = ""

    message = f"*TAREFA PENDENTE!*\n\nA tarefa: *{title}*{date_str} não foi marcada como concluída ainda.\n\nAbaixo seguem mais informações a respeito dela:\n"
    if responsible:
        message += f"\n👤 *Responsável:* {responsible}"
    if location:
        message += f"\n📍 *Local:* {location}"
    if text:
        message += f"\n📝 *Descrição:* {text}"

    payload = {
        "number": f"{number}",
        "text": message,
        "delay": 123
    }
    headers = {
        "apikey": "_oBVm*@VYccEzDbtqx7B.Z!qzfnG8kY8mNNpWr7rwBYuqNdN*w",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    print(response.text)
    return response.status_code

