import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models.dart';
import '../state/session.dart';
import '../theme.dart';
import 'common.dart';

/// Abre o formulário de denúncia. Devolve true se a denúncia foi enviada.
Future<bool> showReportSheet(BuildContext context, Review review) async {
  final sent = await showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppColors.cardAlt,
    showDragHandle: true,
    builder: (_) => _ReportSheet(review: review),
  );
  return sent ?? false;
}

class _ReportSheet extends StatefulWidget {
  const _ReportSheet({required this.review});

  final Review review;

  @override
  State<_ReportSheet> createState() => _ReportSheetState();
}

class _ReportSheetState extends State<_ReportSheet> {
  ReportReason _reason = ReportReason.offensive;
  final _details = TextEditingController();
  bool _sending = false;
  String? _error;

  @override
  void dispose() {
    _details.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    if (_reason == ReportReason.other && _details.text.trim().isEmpty) {
      setState(() => _error = 'Descreva o motivo quando escolher "Outro".');
      return;
    }
    setState(() {
      _sending = true;
      _error = null;
    });
    final api = SessionScope.read(context).api;
    try {
      final message = await api.report(widget.review.id, _reason, details: _details.text);
      if (!mounted) return;
      showMessage(context, '$message. Obrigado por ajudar a manter a comunidade segura!');
      Navigator.pop(context, true);
    } on ApiException catch (e) {
      if (mounted) setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 0, 20, 20 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Denunciar análise', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 6),
          Text(
            '"${widget.review.title}" será analisada pela moderação. Análises com várias denúncias ficam ocultas até a decisão de um administrador.',
            style: const TextStyle(color: AppColors.muted),
          ),
          const SizedBox(height: 16),
          const Text('Motivo', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final r in ReportReason.values)
                ChoiceChip(
                  label: Text(r.label),
                  selected: _reason == r,
                  onSelected: (_) => setState(() => _reason = r),
                ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _details,
            maxLength: 500,
            maxLines: 3,
            decoration: fieldDecoration(_reason == ReportReason.other ? 'Detalhes (obrigatório)' : 'Detalhes (opcional)'),
          ),
          if (_error != null) Text(_error!, style: const TextStyle(color: AppColors.coral)),
          const SizedBox(height: 8),
          FilledButton.icon(
            onPressed: _sending ? null : _send,
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
            icon: _sending
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(Icons.flag_outlined),
            label: const Text('Enviar denúncia'),
          ),
        ],
      ),
    );
  }
}
