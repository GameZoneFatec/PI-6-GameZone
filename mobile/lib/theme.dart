import 'package:flutter/material.dart';

/// Mesmas cores do site SafePlay.
class AppColors {
  static const navy = Color(0xFF15142A);
  static const card = Color(0xFF252545);
  static const cardAlt = Color(0xFF1C1B33);
  static const gold = Color(0xFFE8C77A);
  static const coral = Color(0xFFE06A6A);
  static const green = Color(0xFF5FA98A);
  static const text = Color(0xFFF1F0FA);
  static const muted = Color(0xFFA9A7C6);
}

ThemeData buildTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: AppColors.gold,
    brightness: Brightness.dark,
  ).copyWith(
    primary: AppColors.gold,
    onPrimary: AppColors.navy,
    secondary: AppColors.green,
    error: AppColors.coral,
    surface: AppColors.navy,
    onSurface: AppColors.text,
  );

  return ThemeData(
    colorScheme: scheme,
    scaffoldBackgroundColor: AppColors.navy,
    navigationBarTheme: const NavigationBarThemeData(backgroundColor: AppColors.cardAlt, indicatorColor: AppColors.gold),
    snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating),
  );
}
