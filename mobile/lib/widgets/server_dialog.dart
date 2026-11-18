import 'package:flutter/material.dart';

import '../state/session.dart';
import 'common.dart';

/// Troca o endereço da API (ex.: o IP do notebook na rede da apresentação).
Future<void> showServerDialog(BuildContext context) async {
  final session = SessionScope.read(context);
  final controller = TextEditingController(text: session.apiUrl);
  final url = await showDialog<String>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Endereço do servidor'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('IP do computador que está rodando a API, na mesma rede Wi-Fi do celular.'),
          const SizedBox(height: 12),
          TextField(
            controller: controller,
            keyboardType: TextInputType.url,
            autofocus: true,
            decoration: fieldDecoration('Endereço', hint: 'http://192.168.0.10:3000'),
            onSubmitted: (v) => Navigator.pop(ctx, v),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
        FilledButton(onPressed: () => Navigator.pop(ctx, controller.text), child: const Text('Salvar')),
      ],
    ),
  );
  controller.dispose();
  if (url != null && url.trim().isNotEmpty) await session.setApiUrl(url);
}
