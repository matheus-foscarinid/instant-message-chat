# Documentacao dos Comandos

## Iniciar conversa
 - Precisa receber o E-mail nos parâmetros de autenticação
 - Se for um Email já conectado ou um Email inválido ele nega a autenticação/conexão
 - Se tiver tudo OK retorna que deu certo e já retorna o histórico anterior de mensagens


## Enviar uma mensagem
> SEND MSG <message>
 - Passa a mensagem que quer enviar, se for válida envia para todo o mundo
 - Salva no histórico e possui um ID único

## Nova mensagem recebida
> NEW MSG <message_info>
 - Recebe as informações da mensagem, incluindo: conteúdo, autor, ID único e horário

## Nova mensagem de administrador recebida
> ADN MSG <message_info>
 - Recebe as informações da mensagem de admin, incluindo: conteúdo e horário


## Consultar usuários
> WHOS THERE
 - Pergunta quais são os usuários que estão conectados

## Resposta da consulta usuários
> USERS <emails_list>
 - Recebe todos os Emails de usuários conectados naquele exato momento


## Editar uma mensagem
> EDIT MSG <id> <mensagem>
 - Passa o Id da mensagem que quer editar e o novo conteúdo dela
 - Atualiza no histório, e reenvia para o restante dos usuários

## Nova mensagem recebida
> MSG EDITED <message_info>
 - Recebe as informações da mensagem, incluindo: conteúdo, autor, ID único e horário para atualizar


## Editar uma mensagem
> DELETE MSG <id>
 - Passa o Id da mensagem que quer deletar
 - Remove do histório, e reenvia para o restante dos usuários

## Nova mensagem recebida
> MSG DELETED <id>
 - Recebe o id da mensagem apagada

