import json

from flask_login import UserMixin

class LoggedInUser(UserMixin):
    def __init__ (self, person_token, user_id):
        self.person_token = person_token
        self.user_id = user_id
        self.id = json.dumps({ 'person_token': self.person_token, 'user_id': self.user_id })

    def __repr__(self):
        return 'LoggedInUser(person_token={}, user_id={})'.format(self.person_token, self.user_id)

def get_logged_in_user(user_json):
    try:
        user_info = json.loads(user_json)
    except (TypeError, json.decoder.JSONDecodeError):
        return None
    return LoggedInUser(user_info['person_token'], user_info['user_id'])
