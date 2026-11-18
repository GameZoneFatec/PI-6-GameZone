import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models.dart';
import '../state/session.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/report_sheet.dart';

/// Detalhe do jogo: informações, status na biblioteca e análises (com denúncia).
class GameDetailScreen extends StatefulWidget {
  const GameDetailScreen({super.key, required this.gameId, required this.title});

  final int gameId;
  final String title;

  @override
  State<GameDetailScreen> createState() => _GameDetailScreenState();
}

class _GameDetailScreenState extends State<GameDetailScreen> {
  GameDetail? _game;
  List<Review> _reviews = const [];
  String? _error;
  bool _savingStatus = false;
  bool _expanded = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final session = SessionScope.read(context);
    final userId = session.user!.id;
    setState(() => _error = null);
    try {
      final results = await Future.wait([
        session.api.game(widget.gameId, userId: userId),
        session.api.reviews(widget.gameId, userId),
      ]);
      if (!mounted) return;
      setState(() {
        _game = results[0] as GameDetail;
        _reviews = results[1] as List<Review>;
      });
    } on ApiException catch (e) {
      if (mounted) setState(() => _error = e.message);
    }
  }

  Future<void> _reloadReviews() async {
    final session = SessionScope.read(context);
    try {
      final list = await session.api.reviews(widget.gameId, session.user!.id);
      if (mounted) setState(() => _reviews = list);
    } on ApiException catch (_) {
      // mantém a lista atual
    }
  }

  /// Toque no status atual remove o jogo da biblioteca; em outro status, adiciona/troca.
  Future<void> _setStatus(GameStatus tapped) async {
    final game = _game!;
    final newStatus = tapped == game.libraryStatus ? null : tapped;
    setState(() => _savingStatus = true);
    final api = SessionScope.read(context).api;
    try {
      final entryId = await api.setLibraryStatus(gameId: widget.gameId, entryId: game.libraryEntryId, status: newStatus);
      if (!mounted) return;
      setState(() {
        _game = GameDetail(
          summary: game.summary,
          description: game.description,
          screenshots: game.screenshots,
          developers: game.developers,
          publishers: game.publishers,
          libraryEntryId: entryId,
          libraryStatus: newStatus,
        );
      });
      showMessage(context, newStatus == null ? 'Removido da sua biblioteca' : 'Biblioteca: ${newStatus.label}');
    } on ApiException catch (e) {
      if (mounted) showMessage(context, e.message, error: true);
    } finally {
      if (mounted) setState(() => _savingStatus = false);
    }
  }

  Future<void> _report(Review review) async {
    final sent = await showReportSheet(context, review);
    // O worker processa a denúncia em segundos; recarrega para refletir se a análise foi ocultada.
    if (sent) {
      await Future<void>.delayed(const Duration(seconds: 2));
      await _reloadReviews();
    }
  }

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    final api = session.api;
    final game = _game;

    return Scaffold(
      appBar: AppBar(title: Text(widget.title, overflow: TextOverflow.ellipsis)),
      body: _error != null && game == null
          ? ErrorRetry(message: _error!, onRetry: _load)
          : game == null
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.only(bottom: 32),
                    children: [
                      NetImage(api.mediaUrl(game.summary.imageUrl)),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(game.summary.name, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
                            const SizedBox(height: 6),
                            Text(
                              [
                                if (game.summary.year != null) game.summary.year!,
                                if (game.developers.isNotEmpty) game.developers.join(', '),
                                if (game.summary.metacritic != null) 'Metacritic ${game.summary.metacritic}',
                              ].join(' · '),
                              style: const TextStyle(color: AppColors.muted),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 6,
                              runSpacing: 6,
                              children: [for (final g in [...game.summary.genres, ...game.summary.platforms]) Chip(label: Text(g), visualDensity: VisualDensity.compact)],
                            ),
                            const SizedBox(height: 20),
                            _LibraryPicker(current: game.libraryStatus, saving: _savingStatus, onTap: _setStatus),
                            const SizedBox(height: 20),
                            if (game.description != null && game.description!.isNotEmpty) ...[
                              Text(
                                game.description!,
                                maxLines: _expanded ? null : 5,
                                overflow: _expanded ? TextOverflow.visible : TextOverflow.ellipsis,
                                style: const TextStyle(height: 1.4),
                              ),
                              TextButton(
                                onPressed: () => setState(() => _expanded = !_expanded),
                                child: Text(_expanded ? 'Mostrar menos' : 'Ler mais'),
                              ),
                            ],
                          ],
                        ),
                      ),
                      if (game.screenshots.isNotEmpty)
                        SizedBox(
                          height: 140,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: game.screenshots.length,
                            separatorBuilder: (_, __) => const SizedBox(width: 10),
                            itemBuilder: (_, i) => ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: SizedBox(width: 249, child: NetImage(api.mediaUrl(game.screenshots[i]), aspectRatio: 600 / 338)),
                            ),
                          ),
                        ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
                        child: Text('Análises da comunidade (${_reviews.length})', style: Theme.of(context).textTheme.titleMedium),
                      ),
                      if (_reviews.isEmpty)
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: Text('Ainda não há análises para este jogo.', style: TextStyle(color: AppColors.muted)),
                        ),
                      for (final r in _reviews)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                          child: _ReviewCard(
                            review: r,
                            // Não dá para denunciar a própria análise (a API também bloqueia)
                            onReport: r.authorId == session.user?.id ? null : () => _report(r),
                          ),
                        ),
                    ],
                  ),
                ),
    );
  }
}

class _LibraryPicker extends StatelessWidget {
  const _LibraryPicker({required this.current, required this.saving, required this.onTap});

  final GameStatus? current;
  final bool saving;
  final ValueChanged<GameStatus> onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(14)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.collections_bookmark_outlined, size: 18, color: AppColors.gold),
              const SizedBox(width: 8),
              Expanded(child: Text(current == null ? 'Adicionar à minha biblioteca' : 'Na sua biblioteca: ${current!.label}')),
              if (saving) const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final s in GameStatus.values)
                ChoiceChip(
                  label: Text(s.label),
                  selected: current == s,
                  onSelected: saving ? null : (_) => onTap(s),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ReviewCard extends StatelessWidget {
  const _ReviewCard({required this.review, required this.onReport});

  final Review review;
  final VoidCallback? onReport;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(14)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: Text(review.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16))),
              if (review.rating != null)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    for (var i = 1; i <= 5; i++)
                      Icon(i <= review.rating! ? Icons.star : Icons.star_border, size: 16, color: AppColors.gold),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text('por @${review.authorName}', style: const TextStyle(color: AppColors.muted, fontSize: 12)),
          if (review.body != null && review.body!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(review.body!, style: const TextStyle(height: 1.4)),
          ],
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.favorite_border, size: 16, color: AppColors.muted),
              const SizedBox(width: 4),
              Text('${review.likes}', style: const TextStyle(color: AppColors.muted, fontSize: 12)),
              const Spacer(),
              if (onReport != null)
                TextButton.icon(
                  onPressed: onReport,
                  style: TextButton.styleFrom(foregroundColor: AppColors.coral),
                  icon: const Icon(Icons.flag_outlined, size: 18),
                  label: const Text('Denunciar'),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
