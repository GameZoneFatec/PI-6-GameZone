import 'package:flutter/material.dart';

import '../theme.dart';

/// Campo de texto com o visual do app.
InputDecoration fieldDecoration(String label, {IconData? icon, String? hint}) => InputDecoration(
      labelText: label,
      hintText: hint,
      prefixIcon: icon != null ? Icon(icon) : null,
      filled: true,
      fillColor: AppColors.cardAlt,
      border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
    );

/// Imagem da rede com placeholder enquanto carrega e quando falha.
class NetImage extends StatelessWidget {
  const NetImage(this.url, {super.key, this.fit = BoxFit.cover, this.aspectRatio = 460 / 215});

  final String? url;
  final BoxFit fit;
  final double aspectRatio;

  @override
  Widget build(BuildContext context) {
    final placeholder = Container(
      color: AppColors.cardAlt,
      alignment: Alignment.center,
      child: const Icon(Icons.sports_esports, color: AppColors.muted),
    );
    return AspectRatio(
      aspectRatio: aspectRatio,
      child: url == null
          ? placeholder
          : Image.network(
              url!,
              fit: fit,
              errorBuilder: (_, __, ___) => placeholder,
              loadingBuilder: (_, child, progress) => progress == null ? child : placeholder,
            ),
    );
  }
}

/// Mensagem de erro com botão "Tentar de novo".
class ErrorRetry extends StatelessWidget {
  const ErrorRetry({super.key, required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 40, color: AppColors.muted),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: const Text('Tentar de novo')),
          ],
        ),
      ),
    );
  }
}

void showMessage(BuildContext context, String text, {bool error = false}) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(text), backgroundColor: error ? AppColors.coral : null));
}
