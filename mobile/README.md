# SafePlay — app Flutter (R02)

O app do jogador usa a **mesma API** que o site. Ele tem quatro telas:
- **Entrar:** e-mail e senha do mesmo cadastro usado no site. O endereço do servidor pode ser trocado na própria tela.
- **Jogos:** catálogo próprio de jogos, com busca e rolagem infinita.
- **Detalhe do jogo:** informações, screenshots, botões **Backlog / Jogando / Finalizado / Abandonado** para a biblioteca e as análises da comunidade com o botão **Denunciar**. A denúncia passa pelo RabbitMQ e o worker oculta a análise.
- **Minha biblioteca:** os jogos do jogador, com filtro por status. São os mesmos dados de "Meus Jogos" no site.

## Rodar no PC de quem tem Flutter
Os arquivos gerados das plataformas (pasta `android/` completa, `web/`) não ficam no Git. Gere uma vez com:
```bash
cd mobile
flutter create . --org br.fatec.safeplay --project-name safeplay_mobile --platforms android,web
flutter pub get
```
O `flutter create` não sobrescreve `lib/`, `test/` nem `android/app/src/main/AndroidManifest.xml`. Esse manifest já libera o acesso à internet e o uso de `http`.

Para rodar no **Chrome**, sem celular, com a API rodando no mesmo PC:
```bash
flutter run -d chrome --dart-define=API_URL=http://localhost:3000
```

Para rodar no **celular Android pelo cabo USB**, com o modo desenvolvedor e a depuração USB ligados no aparelho:
```bash
flutter run --dart-define=API_URL=http://IP-DO-PC:3000
```

Testes e análise:
```bash
flutter analyze
flutter test
```

## Gerar o APK
```bash
flutter build apk --release --dart-define=API_URL=http://IP-DO-PC:3000
```
O arquivo sai em `build/app/outputs/flutter-apk/app-release.apk`.

**Pelo GitHub, sem instalar nada:** a cada push que muda `mobile/`, a action **App Flutter** compila o app, roda os testes e publica o APK. Para baixar, vá na aba **Actions** do repositório, abra a última execução e baixe **safeplay-apk**.

## Celular conversando com a API do notebook
1. Coloque o notebook e o celular **na mesma rede**. Pode ser o roteador do próprio celular.
2. Descubra o IP do notebook com `ipconfig` (o "Endereço IPv4", por exemplo `192.168.0.10`).
3. No `backend/.env`, defina `MEDIA_BASE_URL=http://192.168.0.10:3000`. É opcional: o app já troca o endereço das imagens sozinho.
4. Na tela de login do app, toque em **Servidor: ...** e informe `http://192.168.0.10:3000`.
5. Se não conectar, o **Firewall do Windows** pode estar bloqueando a porta 3000. Nesse caso, quem administra o notebook precisa liberar o Node.js para redes privadas.

## Estrutura
```text
lib/
  main.dart                 app + troca login/home conforme a sessão
  models.dart               jogos, análises, biblioteca, usuário
  api/api_client.dart       chamadas HTTP (login, jogos, biblioteca, denúncia)
  state/session.dart        servidor, token e usuário salvos no aparelho
  screens/                  login, home (abas), jogos, detalhe, biblioteca
  widgets/                  denúncia (bottom sheet), servidor, componentes
test/                       testes do cliente HTTP, dos modelos e da tela de login
```
