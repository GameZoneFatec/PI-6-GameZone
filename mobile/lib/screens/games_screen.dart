import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models.dart';
import '../state/session.dart';
import '../theme.dart';
import '../widgets/common.dart';
import 'game_detail_screen.dart';

/// Catálogo de jogos (API própria do SafePlay), com busca e rolagem infinita.
class GamesScreen extends StatefulWidget {
  const GamesScreen({super.key});

  @override
  State<GamesScreen> createState() => _GamesScreenState();
}

class _GamesScreenState extends State<GamesScreen> {
  static const _pageSize = 20;

  final _scroll = ScrollController();
  final _games = <GameSummary>[];
  Timer? _debounce;
  String _search = '';
  int _page = 0;
  bool _loading = false;
  bool _hasMore = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (_scroll.position.pixels > _scroll.position.maxScrollExtent - 400) _loadMore();
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _reload());
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _reload() async {
    setState(() {
      _games.clear();
      _page = 0;
      _hasMore = true;
      _error = null;
    });
    await _loadMore();
  }

  Future<void> _loadMore() async {
    if (_loading || !_hasMore) return;
    setState(() => _loading = true);
    final api = SessionScope.read(context).api;
    try {
      final next = await api.games(page: _page + 1, pageSize: _pageSize, search: _search);
      if (!mounted) return;
      setState(() {
        _page++;
        _games.addAll(next);
        _hasMore = next.length == _pageSize;
      });
    } on ApiException catch (e) {
      if (mounted) setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _onSearch(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 350), () {
      _search = value.trim();
      _reload();
    });
  }

  @override
  Widget build(BuildContext context) {
    final api = SessionScope.of(context).api;
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          child: TextField(
            onChanged: _onSearch,
            textInputAction: TextInputAction.search,
            decoration: fieldDecoration('Buscar jogo', icon: Icons.search, hint: 'O que você está jogando hoje?'),
          ),
        ),
        Expanded(child: _buildList(api)),
      ],
    );
  }

  Widget _buildList(ApiClient api) {
    if (_error != null && _games.isEmpty) return ErrorRetry(message: _error!, onRetry: _reload);
    if (_games.isEmpty && _loading) return const Center(child: CircularProgressIndicator());
    if (_games.isEmpty) return const Center(child: Text('Nenhum jogo encontrado.', style: TextStyle(color: AppColors.muted)));

    return RefreshIndicator(
      onRefresh: _reload,
      child: GridView.builder(
        controller: _scroll,
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 260,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 0.92,
        ),
        itemCount: _games.length + (_hasMore ? 1 : 0),
        itemBuilder: (context, i) {
          if (i >= _games.length) return const Center(child: CircularProgressIndicator());
          return GameCard(game: _games[i], imageUrl: api.mediaUrl(_games[i].imageUrl));
        },
      ),
    );
  }
}

class GameCard extends StatelessWidget {
  const GameCard({super.key, required this.game, required this.imageUrl});

  final GameSummary game;
  final String? imageUrl;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.card,
      borderRadius: BorderRadius.circular(14),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => GameDetailScreen(gameId: game.id, title: game.name))),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            NetImage(imageUrl),
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 0),
              child: Text(game.name, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 0, 10, 10),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      [if (game.year != null) game.year!, if (game.genres.isNotEmpty) game.genres.first].join(' · '),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: AppColors.muted, fontSize: 12),
                    ),
                  ),
                  if (game.metacritic != null) _Score(game.metacritic!),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Score extends StatelessWidget {
  const _Score(this.value);
  final int value;

  @override
  Widget build(BuildContext context) {
    final color = value >= 85 ? AppColors.green : (value >= 70 ? AppColors.gold : AppColors.coral);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(border: Border.all(color: color), borderRadius: BorderRadius.circular(6)),
      child: Text('$value', style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }
}
