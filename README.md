FindCar


Descrição do Projeto

O FindCar é um aplicativo desenvolvido em React Native para dispositivos móveis, que permite aos usuários anunciar e procurar carros à venda. Ele inclui funcionalidades como autenticação de usuários, cadastro e edição de anúncios, e exibição de detalhes dos veículos. O backend do aplicativo utiliza o Firebase para autenticação e gerenciamento de dados.
O projeto foi desenvolvido para suportar a versão Expo SDK 51 e a Expo Go Client versão 2.31.2, garantindo compatibilidade com os dispositivos mais recentes e um ambiente de desenvolvimento ágil.


Estrutura do Projeto

O projeto é organizado em uma estrutura de pastas que reflete a divisão lógica entre componentes, páginas, utilitários e configurações.

1. types
routes.d.ts: Contém as definições de rotas estáticas do aplicativo, assegurando a tipagem das URLs e rotas utilizadas.
2. app
tabs: Define o layout principal do aplicativo com duas abas:
Home: Exibe a lista de anúncios disponíveis.
Cadastrar Anúncio: Permite criar um novo anúncio de carro.
pages: Telas adicionais do app, incluindo:
Detalhar Anúncio: Exibe detalhes de um anúncio específico.
Editar Anúncio: Permite a edição de anúncios criados pelo usuário.
Register User: Tela de cadastro de novos usuários.
Login (index.tsx): Tela inicial para autenticação de usuários.
layout.tsx: Configura o roteamento e o layout geral do app, incluindo modais e telas iniciais.
3. components
Button.tsx: Componente reutilizável de botões estilizados.
Container.tsx: Define contêineres estilizados para componentes.
HeaderButton.tsx: Botão no cabeçalho da navegação.
TabBarIcon.tsx: Ícones personalizados para as abas de navegação.
4. utils
firebase.ts: Configuração e funções de interação com o Firebase, como CRUD de anúncios, registro de usuários e autenticação.
5. assets
Diretório para armazenar imagens e outros recursos estáticos.
Requisitos
Node.js versão 14 ou superior
Expo CLI
Expo SDK 51
Expo Go Client versão 2.31.2
Conta no Firebase
Configuração e Instalação
Clone o Repositório

git clone https://github.com/SEU_REPOSITORIO/FindCar.git
cd FindCar
Instale as Dependências

npm install
Configuração do Firebase

Crie um projeto no Firebase e configure os serviços de Authentication e Firestore.
Atualize as variáveis de ambiente no arquivo .env com as credenciais do Firebase.

Inicie o Projeto

npx expo start

Funcionalidades

Telas

Home: Lista de anúncios de carros.

Cadastrar Anúncio: Permite a criação de novos anúncios.

Detalhar Anúncio: Mostra detalhes de um anúncio específico, incluindo fotos, descrição e contato do anunciante.

Editar Anúncio: Edita os anúncios criados pelo usuário.

Login e Cadastro: Gerenciamento de autenticação de usuários.

Firebase

Gerenciamento de anúncios no Firestore.

Autenticação com email e senha.

Relacionamento entre anúncios e usuários autenticados.

Contribuidores

[Tiago Lima e Bryan Campos] - Desenvolvedores

