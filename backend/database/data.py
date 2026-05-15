users = ("User-1", "User-2")
appointments = appts = [
    {"time": "08:30", "patient": "Ahmed Hassan", "doctor": "Dr. Nour", "type": "Consultation", "status": "done"},
    {"time": "09:00", "patient": "Sara Khalil", "doctor": "Dr. Mostafa", "type": "Follow-up", "status": "done"},
    {"time": "10:15", "patient": "Mohamed Ali", "doctor": "Dr. Nour", "type": "Surgery Prep", "status": "active"},
    {"time": "11:00", "patient": "Laila Omar", "doctor": "Dr. Sara", "type": "Radiology", "status": "active"},
    {"time": "12:30", "patient": "Youssef Adel", "doctor": "Dr. Mostafa", "type": "Consultation", "status": "pending"},
]
companies= [
  {'name':"Misr Insurance",    'type':"National",      'color':"#1B4F8A",'init':"MI",'claims':87,'limit':"500,000",'end':"Dec 2026",'status':"active"},
  {'name':"AXA Egypt",         'type':"International", 'color':"#1AAB8A",'init':"AX",'claims':64,'limit':"750,000",'end':"Aug 2026",'status':"expiring"},
  {'name':"MetLife Egypt",     'type':"Private",       'color':"#7B1FA2",'init':"ML",'claims':41,'limit':"400,000",'end':"May 2027",'status':"active"},
  {'name':"Allianz Egypt",     'type':"International", 'color':"#E65100",'init':"AL",'claims':53,'limit':"600,000",'end':"Jan 2027",'status':"active"},
  {'name':"GlobeMed",          'type':"International", 'color':"#0277BD",'init':"GM",'claims':38,'limit':"350,000",'end':"Jul 2026",'status':"expiring"},
  {'name':"Egypt Insurance",   'type':"National",      'color':"#2E7D32",'init':"EI",'claims':29,'limit':"300,000",'end':"Apr 2027",'status':"active"},
  {'name':"Solidarity Egypt",  'type':"National",      'color':"#AD1457",'init':"SO",'claims':18,'limit':"250,000",'end':"Sep 2026",'status':"active"},
  {'name':"Wataniya Insurance",'type':"National",      'color':"#4527A0",'init':"WI",'claims':12,'limit':"200,000",'end':"Nov 2027",'status':"active"},
]
claimsData = [
    {"id": "CLM-2405", "patient": "Ahmed Hassan", "ins": "Misr Insurance", "amount": 3200, "date": "May 4", "status": "pending"},
    {"id": "CLM-2404", "patient": "Sara Khalil", "ins": "AXA Egypt", "amount": 1800, "date": "May 4", "status": "approved"},
    {"id": "CLM-2403", "patient": "Mohamed Ali", "ins": "MetLife Egypt", "amount": 5600, "date": "May 3", "status": "pending"},
    {"id": "CLM-2402", "patient": "Laila Omar", "ins": "Allianz Egypt", "amount": 2100, "date": "May 3", "status": "approved"},
    {"id": "CLM-2401", "patient": "Youssef Adel", "ins": "GlobeMed", "amount": 4300, "date": "May 2", "status": "rejected"},
    {"id": "CLM-2400", "patient": "Nour Ibrahim", "ins": "Misr Insurance", "amount": 900, "date": "May 2", "status": "approved"},
    {"id": "CLM-2399", "patient": "Khaled Samir", "ins": "Egypt Insurance", "amount": 7200, "date": "May 1", "status": "pending"},
    {"id": "CLM-2398", "patient": "Dina Mostafa", "ins": "Solidarity", "amount": 1500, "date": "Apr 30", "status": "pending"},
]

approvalsData = [
    {"ref": "AUTH-881", "patient": "Ahmed Hassan", "proc": "MRI Brain", "ins": "Misr Insurance", "date": "May 4", "amount": 4800},
    {"ref": "AUTH-880", "patient": "Sara Khalil", "proc": "Knee Surgery", "ins": "AXA Egypt", "date": "May 3", "amount": 18500},
    {"ref": "AUTH-879", "patient": "Mohamed Ali", "proc": "Chemotherapy", "ins": "MetLife Egypt", "date": "May 3", "amount": 12000},
    {"ref": "AUTH-878", "patient": "Laila Omar", "proc": "Echo Cardiogram", "ins": "Allianz Egypt", "date": "May 2", "amount": 2200},
    {"ref": "AUTH-877", "patient": "Youssef Adel", "proc": "Hip Replacement", "ins": "GlobeMed", "date": "May 2", "amount": 32000},
]   

homePatients = [
    {"name": "Ahmed Hassan", "arName": "أحمد حسن", "init": "AH", "age": 42, "doctor": "Dr. Nour", "arDoc": "د. نور", "ins": "Misr Insurance", "date": "May 4", "status": "active"},
    {"name": "Sara Khalil", "arName": "سارة خليل", "init": "SK", "age": 29, "doctor": "Dr. Mostafa", "arDoc": "د. مصطفى", "ins": "AXA Egypt", "date": "May 4", "status": "done"},
    {"name": "Mohamed Ali", "arName": "محمد علي", "init": "MA", "age": 55, "doctor": "Dr. Nour", "arDoc": "د. نور", "ins": "MetLife Egypt", "date": "May 3", "status": "pending"},
    {"name": "Laila Omar", "arName": "ليلى عمر", "init": "LO", "age": 38, "doctor": "Dr. Sara", "arDoc": "د. سارة", "ins": "Allianz Egypt", "date": "May 3", "status": "active"},
    {"name": "Youssef Adel", "arName": "يوسف عادل", "init": "YA", "age": 61, "doctor": "Dr. Mostafa", "arDoc": "د. مصطفى", "ins": "GlobeMed", "date": "May 2", "status": "done"},
]
