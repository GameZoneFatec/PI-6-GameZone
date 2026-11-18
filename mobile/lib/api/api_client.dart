import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models.dart';

/// Erro devolvido pela API (a API responde { message, details }).
class ApiException implements Exception {
  ApiException(this.statusCode, this.message);

  final int statusCode;
  final String message;

  @override
  String toString() => message;
}

/// Cliente HTTP da API do SafePlay (a mesma usada pelo site).
class ApiClient {
  ApiClient({required String baseUrl, this.token, http.Client? httpClient})
      : baseUrl = normalizeBaseUrl(baseUrl),
        _http = httpClient ?? http.Client();

  final String baseUrl;
  final String? token;
  final http.Client _http;

  static const _timeout = Duration(seconds: 12);

  /// "192.168.0.10:3000/" → "http://192.168.0.10:3000"
  static String normalizeBaseUrl(String url) {
    var u = url.trim();
    if (u.isEmpty) return u;
    if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'http://$u';
    while (u.endsWith('/')) {
      u = u.substring(0, u.length - 1);
    }
    return u;
  }

  /// A API monta as URLs das imagens com o endereço configurado nela (ex.: localhost).
  /// No celular trocamos pelo endereço do servidor que o app está usando.
  String? mediaUrl(String? url) {
    if (url == null || url.isEmpty) return null;
    final i = url.indexOf('/media/');
    return i >= 0 ? '$baseUrl${url.substring(i)}' : url;
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  Uri _uri(String path, [Map<String, String?>? query]) {
    final q = <String, String>{};
    query?.forEach((k, v) {
      if (v != null && v.isNotEmpty) q[k] = v;
    });
    return Uri.parse('$baseUrl$path').replace(queryParameters: q.isEmpty ? null : q);
  }

  Future<dynamic> _send(Future<http.Response> request) async {
    final http.Response res;
    try {
      res = await request.timeout(_timeout);
    } on TimeoutException {
      throw ApiException(0, 'O servidor não respondeu. Confira o endereço e se o celular está na mesma rede.');
    } catch (_) {
      throw ApiException(0, 'Não foi possível conectar em $baseUrl. Confira o endereço do servidor.');
    }
    final body = res.body.isEmpty ? null : _decode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300) return body;
    final message = (body is Map && body['message'] != null) ? body['message'].toString() : 'Erro ${res.statusCode}';
    throw ApiException(res.statusCode, message);
  }

  dynamic _decode(String text) {
    try {
      return jsonDecode(text);
    } catch (_) {
      return null;
    }
  }

  Future<dynamic> get(String path, [Map<String, String?>? query]) => _send(_http.get(_uri(path, query), headers: _headers));

  Future<dynamic> post(String path, Object body) => _send(_http.post(_uri(path), headers: _headers, body: jsonEncode(body)));

  Future<dynamic> put(String path, Object body) => _send(_http.put(_uri(path), headers: _headers, body: jsonEncode(body)));

  Future<dynamic> delete(String path) => _send(_http.delete(_uri(path), headers: _headers));

  // ---------------- Endpoints ----------------

  /// POST /login → { token, userId, name, username, role, ... }
  Future<({String token, AppUser user})> login(String email, String password) async {
    final json = await post('/login', {'email': email.trim(), 'password': password}) as Map<String, dynamic>;
    return (token: json['token'] as String, user: AppUser.fromJson(json));
  }

  Future<List<GameSummary>> games({int page = 1, int pageSize = 20, String? search}) async {
    final list = await get('/games', {'page': '$page', 'pageSize': '$pageSize', 'search': search}) as List;
    return list.map((e) => GameSummary.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<GameDetail> game(int id, {String? userId}) async {
    final json = await get('/games/id', {'gameId': '$id', 'userId': userId}) as Map<String, dynamic>;
    return GameDetail.fromJson(json);
  }

  Future<List<Review>> reviews(int gameId, String userId, {int page = 1, int limit = 20}) async {
    final list = await get('/review/list/feed', {'gameId': '$gameId', 'userId': userId, 'page': '$page', 'limit': '$limit'}) as List;
    return list.map((e) => Review.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<LibraryEntry>> library(String userId, {GameStatus? status, int page = 1, int limit = 50}) async {
    final json = await get('/profile', {'userId': userId, 'page': '$page', 'limit': '$limit', 'status': status?.api}) as Map<String, dynamic>;
    return (json['data'] as List? ?? const []).map((e) => LibraryEntry.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Adiciona, troca o status ou remove o jogo da biblioteca. Devolve o id do item (null = removido).
  Future<String?> setLibraryStatus({required int gameId, String? entryId, GameStatus? status}) async {
    if (status == null) {
      if (entryId != null) await delete('/profile/delete/$entryId');
      return null;
    }
    if (entryId == null) {
      final json = await post('/profile', {'gameId': gameId, 'status': status.api}) as Map<String, dynamic>;
      return json['id']?.toString();
    }
    await put('/profile/update/$entryId', {'status': status.api});
    return entryId;
  }

  /// POST /review/:id/report → 202 { message, queued } (processada pelo worker via RabbitMQ)
  Future<String> report(String reviewId, ReportReason reason, {String? details}) async {
    final json = await post('/review/$reviewId/report', {
      'reason': reason.api,
      if (details != null && details.trim().isNotEmpty) 'details': details.trim(),
    }) as Map<String, dynamic>;
    return json['message']?.toString() ?? 'Denúncia enviada';
  }
}
