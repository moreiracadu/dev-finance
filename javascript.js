Modal = {
    open() {
        //Abrir Modal
        //Adicionar class Active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },

    close() {
        //Abrir Modal
        //Remover class Active do modal
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const Storage = {

    get(){

        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions));

    }
}

const transactions = [

]

const Transaction = {
    
    all : Storage.get(),

    remove(index) {
        Transaction.all.splice(index, 1);
        App.reload();
    },

    add(transaction){
        Transaction.all.push(transaction)
        App.reload();
    },

    income() {
        let income = 0;
        Transaction.all.forEach(transaction => {

            if (transaction.amount > 0) {

                income += transaction.amount;
            }
        })
        return income
    },

    expense() {
        let expense = 0;
        Transaction.all.forEach(transaction => {

            if (transaction.amount < 0) {

                expense += transaction.amount;
            }
        })
        return expense
    },

    total(){
        return Transaction.income() + Transaction.expense();
    },
    
}

const DOM = {

    transactionContainer : document.querySelector("#data-table tbody"),
    
    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
    `
        return html
    },

    updateBalance() {
        document
        .getElementById("incomeDisplay")
        .innerHTML = Utils.formatCurrency(Transaction.income())
        document
        .getElementById("expenseDisplay")
        .innerHTML = Utils.formatCurrency(Transaction.expense())
        document
        .getElementById("totalDisplay")
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionContainer.innerHTML = "";
    }
}

const Utils = {
    formatDate(date){
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatAmount(value){
         value = Number(value) * 100
         return value
    },

    formatCurrency(value) {
        
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value

    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){

        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }

    },

    validateFields(){

        const { description, amount, date } = Form.getValues();

        if (description === "" || amount === "" || date === ""){

            throw new Error("Todos os campos precisam ser preenchidos")
        }

    },

    formatValues(){
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description: description,
            amount: amount,
            date: date
        }
    },

    clearFields(){
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault();

        try { 
            Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.close();

        } catch (error) {
            alert(error.message)
        }
    },
}

const App = {

    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {

        DOM.clearTransactions();
        App.init();
    },
}

App.init()