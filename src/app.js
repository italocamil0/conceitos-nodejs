const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const  {title, url, techs} = request.body;

  const newRepository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);  

  repositories.splice(repositoryIndex,1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  const repository = repositories[repositoryIndex];

  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
