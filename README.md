# Sistema de Mensagem Instantânea
Este projeto foi desenvolvido para comprovação dos conhecimentos da matéria de _Fundamentos de Redes_, da Unisinos. 
Ele faz a implementação de um sistema de mensagem instantânea, que possui o próprio protocolo de aplicação para suportá-lo.

As metas a comprir foram:

- [X] Consultar os usuários conectados no servidor
- [X] enviar mensagens para o servidor, as quais devem ser entregues imediatamente se o
usuário estiver conectado;
- [X] recuperar as mensagens entregues previamente no momento da conexão;
- [X] excluir mensagens no servidor e no lado cliente;
- [X] alterar mensagens no servidor e no lado cliente.


# Documentacao dos Comandos
<sup>Os valores entre parenteses "()" são o indicativo de onde vem cada comando, exemplo: (Client) significa que o comando é emitido a partir do lado client</sup>

### (CLIENT) Iniciar conversa
 - Precisa receber o E-mail nos parâmetros de autenticação
 - Se for um Email já conectado ou um Email inválido ele nega a conexão

### (SERVER) Avisa que uma conexão foi um sucesso
> AUTH OK <extra_infos>
 - Passa informações extras no momento do OK da conexão-
 - No momento apenas envia as mensagens anteriores a conexão do usuário

### (CLIENT) Enviar uma mensagem
> SEND MSG <message>
 - Passa a mensagem que quer enviar, se for válida envia para todo o mundo
 - Salva no histórico e possui um ID único

### (SERVER) Nova mensagem recebida
> NEW MSG <message_info>
 - Recebe as informações da mensagem, incluindo: conteúdo, autor, ID único e horário

### (SERVER) Nova mensagem de administrador recebida
> ADM MSG <message_info>
 - Recebe as informações da mensagem de admin, incluindo: conteúdo e horário

### (CLIENT) Consultar usuários
> WHOS THERE
 - Pergunta quais são os usuários que estão conectados

### (SERVER) Resposta da consulta usuários
> USERS <emails_list>
 - Recebe todos os Emails de usuários conectados naquele exato momento

### (CLIENT) Editar uma mensagem
> EDIT MSG <id> <mensagem>
 - Passa o Id da mensagem que quer editar e o novo conteúdo dela
 - Atualiza no histório, e reenvia para o restante dos usuários

### (SERVER) Nova mensagem editada
> MSG EDITED <message_info>
 - Recebe as informações da mensagem, incluindo: conteúdo, autor, ID único e horário para atualizar

### (CLIENT) Apagar uma mensagem
> DELETE MSG <id>
 - Passa o Id da mensagem que quer deletar
 - Remove do histório, e reenvia para o restante dos usuários

### (SERVER) Nova mensagem apagada
> MSG DELETED <id>
 - Recebe o id da mensagem apagada

