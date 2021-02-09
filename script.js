//  Logica para abrir e fechar caixa Modal  de Novas trsações

const Modal = {
  open() {
    //abrir modal, add class active
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    //fechar modal, remover class active
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  set(transactions){
    localStorage.setItem("dev.finances:transactions", JSON.stringify
    (transactions))
  }
}

// Calculo de entrada, saida e total das transações

const Transaction = {
  all: Storage.get(), 

  add(transaction){
    Transaction.all.push(transaction)

    App.reload()
    
  },

  remove(index){
    Transaction.all.splice(index, 1)
    App.reload()
  },
  incomes() {// somar entradas
    let income = 0;
    //pegar tosas as trasações
    //para cada trasação, 
    Transaction.all.forEach(transaction => {
      // se for maior que zer
      if( transaction.amount > 0){
        //somar a uma variavel e retornar a variavel
        income += transaction.amount;
      }
    })
    return income;
  },
  expenses() {
    let expense = 0;
    //pegar tosas as trasações
    //para cada trasação, 
    Transaction.all.forEach(transaction => {
      // se for maior que zer
      if( transaction.amount < 0){
        //somar a uma variavel e retornar a variavel
        expense += transaction.amount;
      }
    })
    return expense;
  },
  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

// substituir os dados do HMTL pelo os do JS

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td classe="date">${transaction.date}</td>
            <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
            </td>
        ` 
        return html     
    },

    updateBalance(){
      document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
      document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
      document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())


    },
    clearTransactions(){
      DOM.transactionsContainer.innerHTML = ""
    }
}

// formatar estetica dos valores das transações add sinal - e R$ 
const Utils = {
  formatAmount(value){
    value = Number(value.replace(/\,\./g, ""))*100
    return value
  },

  formatDate(date){
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value)/100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

   return signal + value
  }
}

const Form = {
  // capturar input do HTML
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value 
    }
  },

  //verificar se todas informações foram preenchidas
  validateFields(){
    const { description, amount, date } = Form.getValues()

    if(description.trim() === "" ||
      amount.trim() === ""||
      date.trim() === ""){
        throw new Error("Por favor, preencha todos os campos")
      }
  },

  //formatar dados para salvar
  formatValues(){
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return { description, amount, date }

  },
 

   // apagar os dados do formulario 
  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()
    
    try{
      Form.validateFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      //fechar o modal ao concluir
      Modal.close()

    }catch(error){
      alert(error.message)
    }

  }
}

const App = {
  init(){

    Transaction.all.forEach(DOM.addTransaction)
         
    DOM.updateBalance()

    Storage.set(Transaction.all)
    
  },
  reload(){
    DOM.clearTransactions()
    App.init()
  }
}

App.init()

// [
//   {
//     description: "Luz",
//     amount: -50000,
//     date: "23/01/2021",
//   },
//   {
//     description: "website",
//     amount: 500000,
//     date: "23/01/2021",
//   },
//   {
//     description: "internet",
//     amount: -20012,
//     date: "23/01/2021",
//   },
//   {
//     description: "app",
//     amount: 200000,
//     date: "23/01/2021",
//   }
// ]