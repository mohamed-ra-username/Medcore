users = ("User-1", "User-2")

def get_user(id):
    try:
        return users[id]
    except KeyError,IndexError:
        return None

def get_users():
    return users