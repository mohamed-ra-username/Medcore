
var counters = {
    money: {
        revenue: 84200,
        total_cost: 128400,
    },
    patients: {
        pending: 12,
        approved: 1284,
        rejected: 8,
        pending:24,
        get total() {
            return this.pending + this.rejected + this.approved
        }
    },
    appointments: {
        today: 18,
        pending: 12,
        approved: 47,
        rejected: 8,
        get total() {
            return + this.pending + this.rejected + this.approved
        }
    },
    claims: {
        pending: 12,
        approved: 47,
        rejected: 8,
        get total() {
            return this.pending + this.rejected + this.approved
        }
    },
    approvals:{
        active:0,
        pending:5,
        get total() {
            return this.active + this.pending + this.rejected + this.approved
        }
    }
}
function display_dashboard_counters(){
    let check_for = {
        "stat-patients":function(){ return counters.patients.total},
        "stat-appts":function(){ return counters.appointments.today},
        "stat-claims":function(){ return counters.claims.pending},
        "stat-revenue":function(){ return counters.money.revenue},
    }
    
}

function display_sidebar_badges(){
    let check_for = {
        "patients-badge": function(){return counters.patients.pending},
        "appointments-badge": function(){return counters.appointments.pending},
        "claims-badge": function(){return counters.claims.pending},
        "approvals-badge": function(){return counters.approvals.pending},
    } 

    badges = document.getElementsByClassName("badge");
    for (let index = 0; index < badges.length; index++) {
        const element = badges[index];
        elementId = element["id"]
        const get_amount = check_for[elementId]
        if (!get_amount){
            console.error(`Invalid badge id ${elementId}`)
        }
        element.innerHTML = get_amount()
        
    }
}
