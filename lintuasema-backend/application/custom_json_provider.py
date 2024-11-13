from flask.json.provider import DefaultJSONProvider

class CustomJSONProvider(DefaultJSONProvider):
    def __init__(self, app):
        super().__init__(app)

    def dumps(self, o, **kw):
        o = self._del_none(o)
        return super().dumps(o, **kw)

    def _del_none(self, value):
        if isinstance(value, list):
            return [self._del_none(x) for x in value if x is not None]
        elif isinstance(value, dict):
            return {
                key: self._del_none(val)
                for key, val in value.items()
                if val is not None
            }
        else:
            return value
