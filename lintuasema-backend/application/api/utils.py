import os

AUTH_TOKEN = os.getenv('AUTH_TOKEN')


def get_laji_api_headers(person_token=None, lang=None):
    headers =  {
        'Authorization': AUTH_TOKEN,
        'Api-Version': '1'
    }

    if person_token is not None:
        headers['Person-Token'] = person_token
    if lang is not None:
        headers['Accept-Language'] = lang

    return headers
