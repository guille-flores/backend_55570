import ticketsModel from '../dao/models/tickets.model.js';

class TicketService{
    async createTicket(data){
        try{
            let new_ticket = await ticketsModel.create({
                amount: data.amount,
                purchaser: data.email
            })
            return new_ticket
        }catch(error){
            throw new Error(error.message)
        }
    }
}

export default new TicketService();