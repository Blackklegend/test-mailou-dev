# Teste | Desenvolvedor Fullstack 👨‍💻

### 🎯 Objetivo

Por meio deste teste queremos validar sua aptidão e conhecimento para encarar o desafio de ser um **Desenvolvedor Fullstack** dentro da [Mailou Dev](https://dev.mailou.com.br).

---

### 🤔 Regra de negócio 

**Backend:** Você deverá desenvolver um servidor HTTPS que disponibilize API's REST para realizar um CRUD de produtos.

**Frontend:** Vocẽ deverá desenvolver uma tela que possua uma tabela listando todos os produtos já cadastrados. Nesta tela você deverá ter a opção de inserir, alterar e excluir produtos.

<table>
  <thead>
    <tr>
      <th>Campos</th>
      <th>Descrição</th>
    <tr>
  <thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>Chave primaria, obrigatório.</td>
    </tr>
    <tr>
      <td>name</td>
      <td>Texto, obrigatório e único conforme categoria. (se já houver um produto com esse nome e categoria o sistema não deve permitir cadastrar)</td>
    </tr>
    <tr>
      <td>description</td>
      <td>Texto, não obrigatório.</td>
    </tr>
    <tr>
      <td>category</td>
      <td>Lista de opções, obrigatório. (E = Eletrodoméstico | L = Limpeza | M = Móveis | I = Informática)</td>
    </tr>
    <tr>
      <td>price</td>
      <td>Numérico, obrigatório. (permitir 2 casas decimais)</td>
    </tr>
    <tr>
      <td>created_at</td>
      <td>Data e horário, obrigatório. </td>
    </tr>
  </tbody>
</table>

<br>

**Requisitos:**

* Apresente um código organizado. *(Clean Code)*;
* Arquitetura: MVC (Model View Controller);
* Tecnologias a serem utilizadas: 
    * **Backend:** Node.js ou Typescript;
    * **Frontend:** React.js;
* Armazene os produtos cadastrados em um banco de dados de sua preferência. *(Mysql, Postgres, etc.)*;
  
**Diferenciais:**
* Conhecimento em **Docker**. Exemplo de aplicação do teste: Subir o banco de dados;
* Conhecimento de **migrations**. Exemplo na aplicação do teste: Criar de forma automatica a tabela no banco de dados;
* Conhecimento em **Testes**. Exemplo na aplicação do teste: Criar teste para cada uma das funcionalidades (CRUD);

<br/>
<br/>

**Obs**.: Todas as tecnologias sugeridas são as que mais utilizamos em nossos projetos. Porém entendemos que a tecnologia não é a solução, mas sim o meio para chegar lá. Faça na stack de seu maior conhecimento, mas priorize o que sugerimos. 🤝
