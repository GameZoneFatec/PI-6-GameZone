import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'state/session.dart';
import 'theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final session = Session()..load();
  runApp(SafePlayApp(session: session));
}

class SafePlayApp extends StatelessWidget {
  const SafePlayApp({super.key, required this.session});

  final Session session;

  @override
  Widget build(BuildContext context) {
    return SessionScope(
      session: session,
      child: MaterialApp(
        title: 'SafePlay',
        debugShowCheckedModeBanner: false,
        theme: buildTheme(),
        home: const _Root(),
      ),
    );
  }
}

/// Mostra o login ou o app conforme a sessão.
class _Root extends StatelessWidget {
  const _Root();

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    if (!session.ready) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return session.isLoggedIn ? const HomeScreen() : const LoginScreen();
  }
}
