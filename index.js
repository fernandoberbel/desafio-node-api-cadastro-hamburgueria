const express = require("express") // Importar o framework express ( gerenciamento de rotas e middlewares )
const app = express() // Criar váriavel para facilitar o uso do express
app.use(express.json()) // Avisa o express que iremos usar json por padrão no body

const uuid = require("uuid") // Importar biblioteca para gerar um id único e universal

const port = 3000 // Criar uma variável com a porta a ser ouvida
const orders = [] // Como neste projetos não fizemos um banco de dados é necessário criar uma variável para guardar as informações

// Middleware é um interceptador e tem o poder de parar ou rodar uma aplicação. As rotas tbm são middlewares.
const checkIdMw = (request, response, next) => {

    const { id } = request.params // Variável para requisitar o id da ordem a ser editada

    const index = orders.findIndex(order => order.id === id) // Verifica dentro da variável ou algum banco de dados se o Id existe

    if (index < 0) {
        return response.status(404).json({ Error: "Order not found" }) // Resposta para quando não encontrar o id
    }

    request.orderIndex = index // Verifica se o Id existe
    request.orderId = id // Requisição do Id

    next() // Parâmetro para dar sequência nas rotas sem para a aplicação
}

const statusMw = (request, response, next) => {

    const metodo = request.method // Requisição do metodo usado na rota
    const url = request.url // Requisição do url usado na rota

    console.log(metodo, url)

    next() // Parâmetro para dar sequência nas rotas sem para a aplicação
}

// Query params = Filtros
// Route params = Buscar, deletar e atualizar
// Request Body = Mandar informações pelo corpo da requisição

app.post("/orders", statusMw, (request, response) => { // Rota para criação dos pedidos. Metodo post (criação)

    const { order, clienteName, price } = request.body // Variável para requisitar as informações através do body do servidor

    const newOrder = { id: uuid.v4(), order, clienteName, price, status: "Em preparação" } // Criar variavel para armazenar as informações que chegam do body pelo id

    orders.push(newOrder) // Guarda os dados do body na variável criada para armazenamento

    return response.status(201).json(newOrder) // Retornar uma resposta para o front-end do status e as informações do body

})

app.get("/orders", statusMw, (request, response) => { // Rota para listar todos os pedidos. Metodo get (leitura)

    return response.json(orders) // Retornar uma resposta para o front-end

})

app.put("/orders/:id", checkIdMw, statusMw, (request, response) => { // Rota para atualizar um pedido através do id. Metodo put (atualização)

    const id = request.orderId // Vem do middleware
    const index = request.orderIndex // Vem do middleware

    const { order, clienteName, price } = request.body // Variável para requisitar as informações através do body do servidor

    const editOrder = { id, order, clienteName, price, status: "Em preparação" } // Criar variavel para armazenar as informações que chegam do body pelo id

    orders[index] = editOrder // Substituir as informações do ( servidor na variável) com a ordem editada através do id 

    return response.status(201).json(editOrder) // Retornar uma resposta para o front-end apenas da ordem editada

})

app.delete("/orders/:id", checkIdMw, statusMw, (request, response) => { // Rota para deletar um pedido.  Metodo get (leitura)

    const index = request.orderIndex // Vem do middleware

    orders.splice(index, 1) // Detelar pedido do id encontrado

    return response.status(204).json() // Retornar uma resposta para o front-end

})

app.get("/orders/:id", checkIdMw, statusMw, (request, response) => { // Rota para receber um id e retornar um pedido específico. Metodo get (leitura)

    const id = request.orderId // Vem do middleware

    const viewOrders = orders.filter(order => order.id === id) // Filtra um elemento no array através do Id e armazena na variável

    return response.json(viewOrders) // Retornar uma resposta para o front-end

})

app.patch("/orders/:id", checkIdMw, statusMw, (request, response) => { // Rota para atualizar o status do pedido

    const index = request.orderIndex // Vem do middleware

    orders[index].status = "Pronto" // Substituir as informações do ( servidor na variável) com a ordem editada através do id 
    
    return response.status(201).json(orders[index]) // Retornar uma resposta para o front-end apenas da ordem editada

})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
}) // Porta que esta sendo ouvida e mensagem para dizer que o servidor está sendo executado