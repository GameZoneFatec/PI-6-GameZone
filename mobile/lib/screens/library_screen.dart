import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models.dart';
import '../state/session.dart';
import '../theme.dart';
import '../widgets/common.dart';
import 'game_detail_screen.dart';

/// Biblioteca do jogador — os mesmos dados de "Meus Jogos" no site.
class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => LibraryScreenState();
}

class LibraryScreenState extends State<LibraryScreen> {
  GameStatus? _filter;
  List<LibraryEntry>? _items;
  String? _error;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => reload());
  }

  Future<void> reload() async {
    if (_loading) return;
    final session = SessionScope.read(context);
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final list = await session.api.library(session.user!.id, status: _filter);
      if (mounted) setState(() => _items = list);
    } on ApiException catch (e) {
      if (mounted) setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _open(LibraryEntry e) async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => GameDetailScreen(gameId: e.game.id, title: e.game.name)));
    if (mounted) reload(); // o status pode ter mudado na tela do jogo
  }

  @override
  Widget build(BuildContext context) {
    final api = SessionScope.of(context).api;
    return Column(
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          child: Row(
            children: [
              for (final f in <GameStatus?>[null, ...GameStatus.values])
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(f?.label ?? 'Todos'),
                    selected: _filter == f,
                    onSelected: (_) {
                      setState(() => _filter = f);
                      reload();
                    },
                  ),
                ),
            ],
          ),
        ),
        Expanded(child: _body(api)),
      ],
    );
  }

  Widget _body(ApiClient api) {
    final items = _items;
    if (_error != null && items == null) return ErrorRetry(message: _error!, onRetry: reload);
    if (items == null) return const Center(child: CircularProgressIndicator());
    if (items.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'Nenhum jogo aqui ainda.\nAbra um jogo na aba Jogos e escolha Backlog, Jogando, Finalizado ou Abandonado.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.muted),
          ),
        ),
      );
    }
    return RefreshIndicator(
      onRefresh: reload,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (_, i) {
          final e = items[i];
          return Material(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(14),
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: () => _open(e),
              child: Row(
                children: [
                  SizedBox(width: 130, child: NetImage(api.mediaUrl(e.game.imageUrl))),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(e.game.name, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
                        const SizedBox(height: 6),
                        _StatusBadge(e.status),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: AppColors.muted),
                  const SizedBox(width: 8),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge(this.status);
  final GameStatus status;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      GameStatus.playing => AppColors.green,
      GameStatus.finished => AppColors.gold,
      GameStatus.dropped => AppColors.coral,
      GameStatus.backlog => AppColors.muted,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(border: Border.all(color: color), borderRadius: BorderRadius.circular(999)),
      child: Text(status.label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
    );
  }
}
