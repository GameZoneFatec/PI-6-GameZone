import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:safeplay_mobile/api/api_client.dart';
import 'package:safeplay_mobile/models.dart';

http.Response jsonResponse(Object body, [int status = 200]) =>
    http.Response.bytes(utf8.encode(jsonEncode(body)), status, headers: {'content-type': 'application/json; charset=utf-8'});

void main() {
  group('endereço do servidor', () {
    test('normaliza o que o usuário digita', () {
      expect(ApiClient.normalizeBaseUrl('192.168.0.10:3000/'), 'http://192.168.0.10:3000');
      expect(ApiClient.normalizeBaseUrl(' https://api.exemplo.com// '), 'https://api.exemplo.com');
    });

    test('troca o host das imagens pelo servidor configurado no app', () {
      final api = ApiClient(baseUrl: 'http://192.168.0.10:3000');
      expect(api.mediaUrl('http://localhost:3000/media/games/hades/header.jpg'), 'http://192.168.0.10:3000/media/games/hades/header.jpg');
      expect(api.mediaUrl(null), isNull);
    });
  });

  group('modelos', () {
    test('lê o detalhe do jogo com o status na biblioteca', () {
      final d = GameDetail.fromJson({
        'userGame': {'userGameId': 'ug1', 'status': 'PLAYING'},
        'game': {
          'idGame': 1,
          'name': 'Grand Theft Auto V',
          'released': '2015-04-13',
          'metacritic': 96,
          'background_image': 'http://localhost:3000/media/games/gta/header.jpg',
          'description': ' Texto ',
          'genres': [
            {'id': 1, 'name': 'Ação'}
          ],
          'palatforms': [
            {'id': 1, 'name': 'PC'}
          ],
          'developers': [
            {'id': 1, 'name': 'Rockstar North'}
          ],
          'publishers': [],
          'screen_shots': [
            {'id': 1, 'image': 'http://localhost:3000/media/games/gta/ss1.jpg'}
          ],
        },
      });
      expect(d.summary.name, 'Grand Theft Auto V');
      expect(d.summary.year, '2015');
      expect(d.summary.platforms, ['PC']);
      expect(d.developers, ['Rockstar North']);
      expect(d.libraryStatus, GameStatus.playing);
      expect(d.libraryEntryId, 'ug1');
      expect(d.description, 'Texto');
      expect(d.screenshots, hasLength(1));
    });

    test('jogo fora da biblioteca vem sem status', () {
      final d = GameDetail.fromJson({
        'userGame': {'userGameId': null, 'status': null},
        'game': {'idGame': 2, 'name': 'Hades'},
      });
      expect(d.libraryStatus, isNull);
      expect(d.libraryEntryId, isNull);
    });
  });

  group('chamadas', () {
    test('login devolve token e usuário', () async {
      final client = MockClient((req) async {
        expect(req.url.path, '/login');
        expect(jsonDecode(req.body), {'email': 'jogador@safeplay.demo', 'password': 'x'});
        return jsonResponse({'token': 't0k', 'userId': 'u1', 'name': 'Jogador', 'username': 'jogador_demo', 'role': 'USER'});
      });
      final out = await ApiClient(baseUrl: 'http://srv', httpClient: client).login(' jogador@safeplay.demo ', 'x');
      expect(out.token, 't0k');
      expect(out.user.username, 'jogador_demo');
      expect(out.user.isAdmin, isFalse);
    });

    test('denúncia envia motivo com o token e devolve a mensagem da API', () async {
      final client = MockClient((req) async {
        expect(req.method, 'POST');
        expect(req.url.path, '/review/r1/report');
        expect(req.headers['Authorization'], 'Bearer t0k');
        expect(jsonDecode(req.body), {'reason': 'OFFENSIVE'});
        return jsonResponse({'reportId': 'rep1', 'status': 'PENDING', 'queued': true, 'message': 'Denúncia recebida e enviada para análise'}, 202);
      });
      final msg = await ApiClient(baseUrl: 'http://srv', token: 't0k', httpClient: client).report('r1', ReportReason.offensive);
      expect(msg, 'Denúncia recebida e enviada para análise');
    });

    test('erro da API vira ApiException com a mensagem dela', () async {
      final client = MockClient((_) async => jsonResponse({'message': 'Você já denunciou esta análise'}, 409));
      final api = ApiClient(baseUrl: 'http://srv', token: 't', httpClient: client);
      await expectLater(
        api.report('r1', ReportReason.spam),
        throwsA(isA<ApiException>().having((e) => e.statusCode, 'status', 409).having((e) => e.message, 'msg', contains('já denunciou'))),
      );
    });

    test('biblioteca: adiciona, troca status e remove', () async {
      final calls = <String>[];
      final client = MockClient((req) async {
        calls.add('${req.method} ${req.url.path}');
        if (req.method == 'POST') return jsonResponse({'id': 'ug9'}, 201);
        return jsonResponse({'message': 'ok'});
      });
      final api = ApiClient(baseUrl: 'http://srv', token: 't', httpClient: client);
      expect(await api.setLibraryStatus(gameId: 5, status: GameStatus.backlog), 'ug9');
      expect(await api.setLibraryStatus(gameId: 5, entryId: 'ug9', status: GameStatus.finished), 'ug9');
      expect(await api.setLibraryStatus(gameId: 5, entryId: 'ug9'), isNull);
      expect(calls, ['POST /profile', 'PUT /profile/update/ug9', 'DELETE /profile/delete/ug9']);
    });
  });
}
