# from .enums import status
import json
import pathlib

file_name = "data.json"
file = pathlib.Path(__file__).parent/file_name

# initizalize variables to avoid NameError when using partial before assignment
users = appointments = companies = phones = invoices = claimsData = approvalsData = homePatients = dict()


def load_data():
    with open(file, "r", encoding="utf-8") as f:
        for k, v in json.load(f).items():
            globals()[k] = v


def save_data():
    data = {
        "users": users,
        "appointments": appointments,
        "companies": companies,
        "phones": phones,
        "invoices": invoices,
        "claimsData": claimsData,
        "approvalsData": approvalsData,
        "homePatients": homePatients,
    }

    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# now use some_key directly (but avoid this)
# users = ("User-1", "User-2")
# appointments = [
#     {"time": "08:30", "patient": "Ahmed Hassan", "doctor": "Dr. Nour",
#         "type": "Consultation", "status": status.DONE},
#     {"time": "09:00", "patient": "Sara Khalil",
#         "doctor": "Dr. Mostafa", "type": "Follow-up", "status": status.DONE},
#     {"time": "10:15", "patient": "Mohamed Ali", "doctor": "Dr. Nour",
#         "type": "Surgery Prep", "status": status.ACTIVE},
#     {"time": "11:00", "patient": "Laila Omar", "doctor": "Dr. Sara",
#         "type": "Radiology", "status": status.ACTIVE},
#     {"time": "12:30", "patient": "Youssef Adel", "doctor": "Dr. Mostafa",
#         "type": "Consultation", "status": status.PENDING},
# ]
# companies = [
#     {'name': "Misr Insurance",    'type': "National",      'color': "#1B4F8A", 'init': "MI",
#         'claims': 87, 'limit': "500,000", 'end': "Dec 2026", 'status': status.ACTIVE},
#     {'name': "AXA Egypt",         'type': "International", 'color': "#1AAB8A", 'init': "AX",
#      'claims': 64, 'limit': "750,000", 'end': "Aug 2026", 'status': status.EXPIRING},
#     {'name': "MetLife Egypt",     'type': "Private",       'color': "#7B1FA2", 'init': "ML",
#      'claims': 41, 'limit': "400,000", 'end': "May 2027", 'status': status.ACTIVE},
#     {'name': "Allianz Egypt",     'type': "International", 'color': "#E65100", 'init': "AL",
#      'claims': 53, 'limit': "600,000", 'end': "Jan 2027", 'status': status.ACTIVE},
#     {'name': "GlobeMed",          'type': "International", 'color': "#0277BD", 'init': "GM",
#      'claims': 38, 'limit': "350,000", 'end': "Jul 2026", 'status': status.EXPIRING},
#     {'name': "Egypt Insurance",   'type': "National",      'color': "#2E7D32", 'init': "EI",
#      'claims': 29, 'limit': "300,000", 'end': "Apr 2027", 'status': status.ACTIVE},
#     {'name': "Solidarity Egypt",  'type': "National",      'color': "#AD1457", 'init': "SO",
#      'claims': 18, 'limit': "250,000", 'end': "Sep 2026", 'status': status.ACTIVE},
#     {'name': "Wataniya Insurance", 'type': "National",      'color': "#4527A0",
#         'init': "WI", 'claims': 12, 'limit': "200,000", 'end': "Nov 2027", 'status': status.ACTIVE},
# ]
# phones = ["010-1234-5678", "012-9876-5432",
#           "011-5555-1234", "010-8888-7777", "012-3333-2222"]

# invoices = [
#     {"id": "INV-1042", "patient": "Ahmed Hassan", "date": "May 4",
#         "amount": 3200, "ins": "Misr Insurance", "status": status.PENDING},
#     {"id": "INV-1041", "patient": "Sara Khalil", "date": "May 4",
#         "amount": 1800, "ins": "AXA Egypt", "status": status.DONE},
#     {"id": "INV-1040", "patient": "Mohamed Ali", "date": "May 3",
#         "amount": 5600, "ins": "MetLife Egypt", "status": status.PENDING},
#     {"id": "INV-1039", "patient": "Laila Omar", "date": "May 3",
#         "amount": 2100, "ins": "Allianz Egypt", "status": status.DONE},
#     {"id": "INV-1038", "patient": "Youssef", "date": "May 2",
#         "amount": 4300, "ins": "GlobeMed", "status": status.REJECTED},
# ]
# claimsData = [
#     {"id": "CLM-2405", "patient": "Ahmed Hassan", "ins": "Misr Insurance",
#         "amount": 3200, "date": "May 4", "status": status.PENDING},
#     {"id": "CLM-2404", "patient": "Sara Khalil", "ins": "AXA Egypt",
#         "amount": 1800, "date": "May 4", "status": "approved"},
#     {"id": "CLM-2403", "patient": "Mohamed Ali", "ins": "MetLife Egypt",
#         "amount": 5600, "date": "May 3", "status": status.PENDING},
#     {"id": "CLM-2402", "patient": "Laila Omar", "ins": "Allianz Egypt",
#         "amount": 2100, "date": "May 3", "status": "approved"},
#     {"id": "CLM-2401", "patient": "Youssef Adel", "ins": "GlobeMed",
#         "amount": 4300, "date": "May 2", "status": status.REJECTED},
#     {"id": "CLM-2400", "patient": "Nour Ibrahim", "ins": "Misr Insurance",
#         "amount": 900, "date": "May 2", "status": "approved"},
#     {"id": "CLM-2399", "patient": "Khaled Samir", "ins": "Egypt Insurance",
#         "amount": 7200, "date": "May 1", "status": status.PENDING},
#     {"id": "CLM-2398", "patient": "Dina Mostafa", "ins": "Solidarity",
#         "amount": 1500, "date": "Apr 30", "status": status.PENDING},
# ]

# approvalsData = [
#     {"ref": "AUTH-881", "patient": "Ahmed Hassan", "proc": "MRI Brain",
#         "ins": "Misr Insurance", "date": "May 4", "amount": 4800, "status": status.PENDING},
#     {"ref": "AUTH-880", "patient": "Sara Khalil", "proc": "Knee Surgery",
#         "ins": "AXA Egypt", "date": "May 3", "amount": 18500, "status": status.PENDING},
#     {"ref": "AUTH-879", "patient": "Mohamed Ali", "proc": "Chemotherapy",
#         "ins": "MetLife Egypt", "date": "May 3", "amount": 12000, "status": status.PENDING},
#     {"ref": "AUTH-878", "patient": "Laila Omar", "proc": "Echo Cardiogram",
#         "ins": "Allianz Egypt", "date": "May 2", "amount": 2200, "status": status.PENDING},
#     {"ref": "AUTH-877", "patient": "Youssef Adel", "proc": "Hip Replacement",
#         "ins": "GlobeMed", "date": "May 2", "amount": 32000, "status": status.PENDING},
# ]

# homePatients = [
#     {"name": "Ahmed Hassan", "arName": "أحمد حسن", "init": "AH", "age": 42, "doctor": "Dr. Nour",
#         "arDoc": "د. نور", "ins": "Misr Insurance", "date": "May 4", "status": status.ACTIVE},
#     {"name": "Sara Khalil", "arName": "سارة خليل", "init": "SK", "age": 29, "doctor": "Dr. Mostafa",
#         "arDoc": "د. مصطفى", "ins": "AXA Egypt", "date": "May 4", "status": status.DONE},
#     {"name": "Mohamed Ali", "arName": "محمد علي", "init": "MA", "age": 55, "doctor": "Dr. Nour",
#         "arDoc": "د. نور", "ins": "MetLife Egypt", "date": "May 3", "status": status.PENDING},
#     {"name": "Laila Omar", "arName": "ليلى عمر", "init": "LO", "age": 38, "doctor": "Dr. Sara",
#         "arDoc": "د. سارة", "ins": "Allianz Egypt", "date": "May 3", "status": status.ACTIVE},
#     {"name": "Youssef Adel", "arName": "يوسف عادل", "init": "YA", "age": 61, "doctor": "Dr. Mostafa",
#         "arDoc": "د. مصطفى", "ins": "GlobeMed", "date": "May 2", "status": status.DONE},
# ]
# import json

# data ={
#     "users":users,
#     "appointments":appointments,
#     "companies":companies,
#     "phones":phones,
#     "invoices":invoices,
#     "claimsData":claimsData,
#     "approvalsData":approvalsData,
#     "homePatients":homePatients,
# }

# with open(file, "w", encoding="utf-8") as f:
#     print(json.dumps(data, indent=4,ensure_ascii=False))
#     json.dump(data, f, indent=4,ensure_ascii=False)
