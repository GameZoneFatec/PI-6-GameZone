# PI-4-Semestre

# 1. Introdução

## 1.1 O que o projeto é  
O **SafePlay** é um sistema web onde usuários podem visualizar informações sobre jogos e organizar sua própria lista pessoal. Dentro da plataforma, o usuário pode classificar cada jogo pelos status: **Backlog (A jogar)**, **Jogando**, **Finalizado** e **Dropado**, mantendo tudo organizado de forma simples e rápida.  
O objetivo do projeto é ajudar jogadores a não se perderem no volume de jogos disponíveis e manterem controle claro do que pretendem jogar, do que já jogaram e do que não querem mais continuar.

---

## 1.2 Qual problema o projeto resolve  
O SafePlay resolve o problema de desorganização que muitos jogadores enfrentam ao tentar acompanhar todos os jogos que possuem, querem jogar ou já começaram.  
Com a grande quantidade de títulos disponíveis hoje, é fácil esquecer o que estava jogando, o que queria iniciar ou quais jogos já foram finalizados.  
A plataforma centraliza tudo em um único lugar, permitindo que o usuário organize seus jogos por status e mantenha controle claro do seu avanço.

---

## 1.3 Para quem é  
O SafePlay é feito para jogadores que querem manter seus jogos organizados de forma simples e clara.  
A plataforma atende principalmente **jovens e jovens adultos** que consomem muitos jogos e precisam de um lugar centralizado para registrar:  
- o que estão jogando  
- o que pretendem jogar  
- o que já finalizaram  
- o que abandonaram  

---

## 1.4 Tecnologias Utilizadas  

### 🖥️ Backend  
- **Node.js** – Ambiente de execução  
- **TypeScript** – Tipagem estática  
- **Express** – Criação das rotas e APIs  
- **Prisma** – ORM para comunicação com o banco  
- **PostgreSQL** – Banco de dados relacional  

### 🌐 Frontend  
- **React** – Interface web do usuário  

### 🧰 Infraestrutura  
- **Docker** – Containers para padronizar o ambiente  
- **Docker Compose** – Orquestração dos serviços  

### 💸 Pagamentos  
- **Mercado Pago** – Assinatura premium e pagamentos via Pix  

### 🎮 APIs Externas  
- **RAWG API** – Busca de informações detalhadas de jogos  

### 📊 Diagramas  
- **Draw.io** – Criação de diagramas (arquitetura, fluxo, casos de uso)

---

# 2. Requisitos Funcionais (RF)

## 2.1 Usuário e Autenticação
### RF01 – Cadastro de Usuário
O sistema deve permitir que o usuário crie uma conta informando nome,username, email e senha.  
Campos opcionais: foto de perfil e biografia.

### RF02 – Login / Autenticação
O sistema deve permitir que o usuário entre na plataforma usando email e senha.

### RF03 – Perfil do Usuário
O sistema deve permitir visualizar e editar informações do perfil (nome, bio, foto, username etc.).



---

## 2.2 Jogos (RAWG API + Lista Pessoal)

### RF04 – Área do Usuário (Perfil)
O usuário deve visualizar sua lista, quantidade de jogos por status.

### RF05 – Listagem de Jogos (RAWG API)
O sistema deve exibir uma lista de jogos obtidos da RAWG API com nome, imagem, plataformas, nota etc.

### RF06 – Visualização Detalhada do Jogo
O sistema deve apresentar uma página com informações detalhadas de um jogo.

### RF07 – Adicionar Jogo à Lista Pessoal
O usuário deve poder adicionar um jogo à sua lista pessoal.

### RF08 – Alterar Status do Jogo na Lista
O usuário deve poder alterar o status para:
- Backlog  
- Jogando  
- Finalizado  
- Dropado  

### RF09 – Editar Informações do Jogo
O usuário deve poder editar anotações, notas e status dos jogos da sua lista.

### RF10 – Remover Jogo da Lista
O usuário deve poder remover um jogo da sua lista pessoal.

### RF11 – Listagem de Jogos do Usuário
O usuário deve visualizar todos os jogos adicionados na sua lista pessoal.

### RF12 – Filtro por Status
Na listagem de jogos do usuário, deve haver filtro por status.

---

## 2.3 Avaliações e Interações
### RF13 – Análises de Jogos (Premium)
O usuário premium deve poder criar análises sobre jogos.

### RF14 – Listagem de Avaliações
O sistema deve exibir avaliações feitas por outros usuários.

### RF15 – Filtro/Pesquisa de Análises por Nome
O sistema deve permitir pesquisar análises pelo nome/título.

### RF16 – Likes em Avaliações
O usuário deve poder curtir avaliações de outros usuários.

---

## 2.4 Assinatura Premium e Pagamentos
### RF17 – Assinatura Premium (Mercado Pago)
O sistema deve permitir que o usuário contrate um plano premium através de pagamento.

### RF18 – Webhook de Pagamento
O sistema deve processar notificações de pagamento via webhook e atualizar o status do usuário.

### RF19 – Expiração da Assinatura Premium
O sistema deve remover o status premium quando o pagamento não ocorrer ou o plano expirar.


---

# 3. Requisitos Não Funcionais (RNF)

## 3.1 Desempenho
- **RNF01** – O sistema deve carregar a página inicial em até 5 segundos.  
- **RNF02** – As listagens devem retornar resultados em até 5 segundos para até 100 jogos.

## 3.2 Usabilidade
- **RNF03** – A navegação entre telas principais deve ocorrer em no máximo 3 cliques.

## 3.3 Confiabilidade e Disponibilidade
- **RNF04** – O sistema deve exibir mensagens de erro de forma clara e amigável.  
- **RNF05** – Em falha da RAWG API, o sistema deve continuar funcional e informar o usuário adequadamente.

## 3.4 Segurança
- **RNF06** – As senhas dos usuários devem ser armazenadas com hash seguro.  
- **RNF07** – Rotas sensíveis devem exigir autenticação.  

## 3.5 Manutenibilidade
- **RNF08** – O backend deve seguir padrão em camadas (controllers, services, repositories).  

## 3.6 Escalabilidade
- **RNF09** – A arquitetura deve permitir separação futura entre frontend e backend em serviços independentes.  

## 3.7 Compatibilidade
- **RNF10** – O frontend deve funcionar nos navegadores modernos (Chrome, Edge, Firefox).  
- **RNF11** – O sistema deve se comunicar corretamente com a RAWG API e Mercado Pago.

