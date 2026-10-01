import os
import httpx


async def send_whatsapp_message(to: str, message: str):
    phone_number_id = os.getenv("PHONE_NBR_ID")
    access_token = os.getenv("ACCESS_TOKEN")
    graph_api_version = "v23.0"

    print("Phone Number ID loaded:", bool(phone_number_id))
    print("Access token loaded:", bool(access_token))

    url = (
        f"https://graph.facebook.com/"
        f"{graph_api_version}/"
        f"{phone_number_id}/messages"
    )

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {
            "body": message,
        },
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers=headers,
            json=payload,
        )

    print("WhatsApp API:", response.status_code)
    print(response.text)

    response.raise_for_status()

    return response.json()