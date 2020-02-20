//configurando o servidor
const express = require("express")
const server = express()

//configurar servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended:true}))

//configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'Gabriel',
    host:'localhost',
    port:5432,
    database:'doe'

})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express:server,
    noCache:true,
})

/*
//Lista de doadores: vetor ou array
const donors = [
    {
        name:"Diego fernandes",
        blood:"AB+",
    },

    {
        name:"Gabriel Moreno",
        blood:"B+",
    },

    {
        name:"Tiago Akira",
        blood:"A+",
    },

    {
        name:"Gustavo Moreno",
        blood:"O+",
    },
]*/

//configurar apresentação da pagina
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors",function(err,result){
        if (err) return res.send("Erro no banco de dados!!")
        const donors = result.rows
        return res.render("index.html",{donors})
    })
   
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    /*
    //coloco valores no array
    donors.push({
        name:name,
        blood:blood,

    })*/
    
    if(name == ""||email == ""||blood == ""){
        return res.send("Todos os campos são obrigatórios!!")
    }

    //coloco valores dentro do banco de dados
    const query = `INSERT INTO donors("name", "email", "blood") VALUES ($1,$2,$3)`
    const values =[name,email,blood]

    db.query(query,values,function(err){
        if(err) return res.send("Erro no banco de dados")
        return res.redirect("/")
    })

})

// Ligar o server e permitir acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o server")
})
