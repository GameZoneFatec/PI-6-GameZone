import 'package:flutter/material.dart';

import '../state/session.dart';
import '../theme.dart';
import '../widgets/server_dialog.dart';
import 'games_screen.dart';
import 'library_screen.dart';

/// Navegação principal: Jogos | Minha biblioteca.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;
  final _libraryKey = GlobalKey<LibraryScreenState>();

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(_tab == 0 ? 'Jogos' : 'Minha biblioteca'),
        actions: [
          PopupMenuButton<String>(
            tooltip: 'Conta',
            icon: const Icon(Icons.account_circle_outlined),
            onSelected: (v) {
              if (v == 'server') showServerDialog(context);
              if (v == 'logout') session.logout();
            },
            itemBuilder: (_) => [
              PopupMenuItem(
                enabled: false,
                child: Text('@${session.user?.username ?? ''}', style: const TextStyle(color: AppColors.gold)),
              ),
              const PopupMenuItem(value: 'server', child: Text('Endereço do servidor')),
              const PopupMenuItem(value: 'logout', child: Text('Sair')),
            ],
          ),
        ],
      ),
      body: IndexedStack(
        index: _tab,
        children: [
          const GamesScreen(),
          LibraryScreen(key: _libraryKey),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) {
          setState(() => _tab = i);
          if (i == 1) _libraryKey.currentState?.reload(); // pode ter mudado na tela do jogo
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.sports_esports_outlined), selectedIcon: Icon(Icons.sports_esports), label: 'Jogos'),
          NavigationDestination(icon: Icon(Icons.collections_bookmark_outlined), selectedIcon: Icon(Icons.collections_bookmark), label: 'Biblioteca'),
        ],
      ),
    );
  }
}
