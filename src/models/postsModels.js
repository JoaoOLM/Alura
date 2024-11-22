import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados MongoDB usando a string de conexão do ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para obter todos os posts da coleção "posts"
export async function getTodosPosts() {
    // Obtém o banco de dados "Backend"
    const db = conexao.db("Backend");
    // Obtém a coleção "posts"
    const colecao = db.collection("posts");
    // Retorna todos os documentos da coleção como um array
    return colecao.find().toArray();
}

export async function adicionarPost(novoPost) {
    // Obtém o banco de dados "Backend"
    const db = conexao.db("Backend");
    // Obtém a coleção "posts"
    const colecao = db.collection("posts");
    // Insere um novo documento na coleção
    return colecao.insertOne(novoPost);
}

export async function mudarPost(id, updatePost) {
    const db = conexao.db("Backend");
    const colecao = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objectId)}, {$set: updatePost});
}