import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api/api_client.dart';
import '../models.dart';

/// Endereço inicial do servidor. Pode ser definido no build:
///   flutter run --dart-define=API_URL=http://192.168.0.10:3000
const _defaultApiUrl = String.fromEnvironment('API_URL', defaultValue: kIsWeb ? 'http://localhost:3000' : 'http://192.168.0.10:3000');

/// Sessão do app: endereço do servidor, token e usuário (salvos no aparelho).
class Session extends ChangeNotifier {
  static const _kUrl = 'api_url';
  static const _kToken = 'token';
  static const _kUser = 'user';

  String _apiUrl = _defaultApiUrl;
  String? _token;
  AppUser? _user;
  bool _ready = false;

  String get apiUrl => _apiUrl;
  AppUser? get user => _user;
  bool get isLoggedIn => _token != null && _user != null;
  bool get ready => _ready;

  ApiClient get api => ApiClient(baseUrl: _apiUrl, token: _token);

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _apiUrl = prefs.getString(_kUrl) ?? _defaultApiUrl;
    _token = prefs.getString(_kToken);
    final userJson = prefs.getString(_kUser);
    if (userJson != null) {
      try {
        _user = AppUser.fromJson(jsonDecode(userJson) as Map<String, dynamic>);
      } catch (_) {
        _token = null;
      }
    }
    _ready = true;
    notifyListeners();
  }

  Future<void> setApiUrl(String url) async {
    _apiUrl = ApiClient.normalizeBaseUrl(url);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kUrl, _apiUrl);
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    final out = await ApiClient(baseUrl: _apiUrl).login(email, password);
    _token = out.token;
    _user = out.user;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kToken, out.token);
    await prefs.setString(_kUser, jsonEncode(out.user.toJson()));
    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kToken);
    await prefs.remove(_kUser);
    notifyListeners();
  }
}

/// Disponibiliza a sessão para as telas: SessionScope.of(context).
class SessionScope extends InheritedNotifier<Session> {
  const SessionScope({super.key, required Session session, required super.child}) : super(notifier: session);

  static Session of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<SessionScope>()!.notifier!;

  /// Lê sem registrar dependência (para usar em callbacks).
  static Session read(BuildContext context) => context.getInheritedWidgetOfExactType<SessionScope>()!.notifier!;
}
