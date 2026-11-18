import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:safeplay_mobile/main.dart';
import 'package:safeplay_mobile/state/session.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('sem sessão salva, abre a tela de login com o servidor configurado', (tester) async {
    SharedPreferences.setMockInitialValues({'api_url': 'http://192.168.0.50:3000'});
    final session = Session();
    await session.load();

    await tester.pumpWidget(SafePlayApp(session: session));
    await tester.pumpAndSettle();

    expect(find.text('SafePlay'), findsOneWidget);
    expect(find.text('ENTRAR'), findsOneWidget);
    expect(find.textContaining('192.168.0.50:3000'), findsOneWidget);
  });

  testWidgets('valida e-mail e senha antes de chamar a API', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final session = Session();
    await session.load();

    await tester.pumpWidget(SafePlayApp(session: session));
    await tester.pumpAndSettle();
    await tester.tap(find.byType(FilledButton));
    await tester.pump();

    expect(find.text('Informe um e-mail válido'), findsOneWidget);
    expect(find.text('Informe a senha'), findsOneWidget);
  });
}
