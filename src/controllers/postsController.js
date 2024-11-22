import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";
import { getTodosPosts, adicionarPost, mudarPost } from "../models/postsModels.js";

export async function listarPosts(req, res) {
    // Obtém todos os posts
    const posts = await getTodosPosts();
    // Envia os posts como resposta JSON com status 200 (OK)
    res.status(200).json(posts);
}

export async function criarPost(req, res) {
    // Extrai o título e o conteúdo do corpo da requisição
    const novoPost = req.body;

    try {
        const post = await adicionarPost(novoPost);
        res.status(201).json(post);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Falha na requisição" });
    }
}

export async function uploadImagem(req, res) {
    // Extrai o título e o conteúdo do corpo da requisição
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const post = await adicionarPost(novoPost);
        const imagemAtualizada = `uploads/${post.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(201).json(post);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Falha na requisição" });
    }
}

export async function atualizarPost(req, res) {
    // Extrai o título e o conteúdo do corpo da requisição
    const id = req.params.id;
    const urlImg = `http://localhost:3000/${id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const updatePost = {
            imgUrl: urlImg,
            descricao: descricao,
            alt: req.body.alt
        }
        const post = await mudarPost(id, updatePost);
        res.status(201).json(post);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Falha na requisição" });
    }
}