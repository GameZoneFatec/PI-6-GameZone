/// Modelos do app (espelham as respostas da API do SafePlay).
library;

/// Status de um jogo na biblioteca do jogador.
enum GameStatus {
  backlog('BACKLOG', 'Backlog'),
  playing('PLAYING', 'Jogando'),
  finished('FINISHED', 'Finalizado'),
  dropped('DROPPED', 'Abandonado');

  const GameStatus(this.api, this.label);
  final String api;
  final String label;

  static GameStatus? fromApi(Object? value) {
    for (final s in GameStatus.values) {
      if (s.api == value) return s;
    }
    return null;
  }
}

/// Motivos de denúncia aceitos por POST /review/:id/report.
enum ReportReason {
  offensive('OFFENSIVE', 'Ofensivo'),
  spam('SPAM', 'Spam'),
  spoiler('SPOILER', 'Spoiler'),
  other('OTHER', 'Outro');

  const ReportReason(this.api, this.label);
  final String api;
  final String label;
}

List<String> _names(Object? list) =>
    (list is List) ? list.map((e) => (e is Map ? e['name'] : e)?.toString() ?? '').where((s) => s.isNotEmpty).toList() : const [];

/// Jogo na listagem (GET /games).
class GameSummary {
  const GameSummary({
    required this.id,
    required this.name,
    this.imageUrl,
    this.released,
    this.metacritic,
    this.genres = const [],
    this.platforms = const [],
    this.shortDescription,
  });

  final int id;
  final String name;
  final String? imageUrl;
  final String? released;
  final int? metacritic;
  final List<String> genres;
  final List<String> platforms;
  final String? shortDescription;

  String? get year => (released != null && released!.length >= 4) ? released!.substring(0, 4) : null;

  factory GameSummary.fromJson(Map<String, dynamic> json) => GameSummary(
        id: (json['idGame'] as num).toInt(),
        name: json['name'] as String? ?? '',
        imageUrl: json['background_image'] as String?,
        released: json['released'] as String?,
        metacritic: (json['metacritic'] as num?)?.toInt(),
        genres: _names(json['genres']),
        platforms: _names(json['platforms']),
        shortDescription: json['description'] as String?,
      );
}

/// Detalhe do jogo + situação dele na biblioteca do usuário (GET /games/id).
class GameDetail {
  const GameDetail({
    required this.summary,
    this.description,
    this.screenshots = const [],
    this.developers = const [],
    this.publishers = const [],
    this.libraryEntryId,
    this.libraryStatus,
  });

  final GameSummary summary;
  final String? description;
  final List<String> screenshots;
  final List<String> developers;
  final List<String> publishers;
  final String? libraryEntryId;
  final GameStatus? libraryStatus;

  factory GameDetail.fromJson(Map<String, dynamic> json) {
    final game = json['game'] as Map<String, dynamic>;
    final userGame = json['userGame'] as Map<String, dynamic>?;
    return GameDetail(
      summary: GameSummary.fromJson({...game, 'platforms': game['palatforms'] ?? game['platforms']}),
      description: (game['description'] as String?)?.trim(),
      screenshots: (game['screen_shots'] as List? ?? const []).map((s) => (s as Map)['image'].toString()).toList(),
      developers: _names(game['developers']),
      publishers: _names(game['publishers']),
      libraryEntryId: userGame?['userGameId'] as String?,
      libraryStatus: GameStatus.fromApi(userGame?['status']),
    );
  }
}

/// Análise da comunidade (GET /review/list/feed).
class Review {
  const Review({
    required this.id,
    required this.title,
    required this.authorId,
    required this.authorName,
    this.body,
    this.rating,
    this.likes = 0,
    this.publishedAt,
  });

  final String id;
  final String title;
  final String? body;
  final int? rating;
  final String authorId;
  final String authorName;
  final int likes;
  final DateTime? publishedAt;

  factory Review.fromJson(Map<String, dynamic> json) {
    final author = json['author'] as Map<String, dynamic>? ?? const {};
    return Review(
      id: json['reviewId'] as String,
      title: json['title'] as String? ?? '',
      body: json['body'] as String?,
      rating: (json['rating'] as num?)?.toInt(),
      authorId: author['id']?.toString() ?? '',
      authorName: author['username']?.toString() ?? 'anônimo',
      likes: (json['likesCount'] as num?)?.toInt() ?? 0,
      publishedAt: DateTime.tryParse(json['published_at']?.toString() ?? ''),
    );
  }
}

/// Item da biblioteca do jogador (GET /profile).
class LibraryEntry {
  const LibraryEntry({required this.id, required this.status, required this.game});

  final String id;
  final GameStatus status;
  final GameSummary game;

  factory LibraryEntry.fromJson(Map<String, dynamic> json) {
    final game = json['game'] as Map<String, dynamic>?;
    return LibraryEntry(
      id: json['id'] as String,
      status: GameStatus.fromApi(json['status']) ?? GameStatus.backlog,
      game: game != null
          ? GameSummary.fromJson(game)
          : GameSummary(id: (json['gameId'] as num).toInt(), name: json['game_name']?.toString() ?? 'Jogo'),
    );
  }
}

/// Usuário logado (POST /login).
class AppUser {
  const AppUser({required this.id, required this.name, required this.username, required this.role});

  final String id;
  final String name;
  final String username;
  final String role;

  bool get isAdmin => role == 'ADMIN';

  factory AppUser.fromJson(Map<String, dynamic> json) => AppUser(
        id: (json['userId'] ?? json['id']).toString(),
        name: json['name']?.toString() ?? '',
        username: json['username']?.toString() ?? '',
        role: json['role']?.toString() ?? 'USER',
      );

  Map<String, dynamic> toJson() => {'userId': id, 'name': name, 'username': username, 'role': role};
}
