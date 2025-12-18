import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../auth/auth_provider.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final isAdmin = user?.role == 'administrator' || user?.role == 'hr_officer';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              'Account',
              [
                _buildSettingsTile(
                  icon: Icons.person,
                  title: 'Profile',
                  subtitle: user?.name ?? 'Not logged in',
                  onTap: () {
                    // Navigate to profile
                  },
                ),
                _buildSettingsTile(
                  icon: Icons.email,
                  title: 'Email',
                  subtitle: user?.email ?? 'N/A',
                  onTap: null,
                ),
                _buildSettingsTile(
                  icon: Icons.badge,
                  title: 'Role',
                  subtitle: user?.roleDisplay ?? 'N/A',
                  onTap: null,
                ),
                _buildSettingsTile(
                  icon: Icons.lock,
                  title: 'Change Password',
                  subtitle: 'Update your password',
                  onTap: () {
                    _showChangePasswordDialog();
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildSection(
              'Preferences',
              [
                _buildSettingsTile(
                  icon: Icons.notifications,
                  title: 'Notifications',
                  subtitle: 'Manage notification preferences',
                  onTap: () {
                    // Navigate to notifications settings
                  },
                ),
                _buildSettingsTile(
                  icon: Icons.language,
                  title: 'Language',
                  subtitle: 'English',
                  onTap: () {
                    // Show language picker
                  },
                ),
                _buildSettingsTile(
                  icon: Icons.dark_mode,
                  title: 'Theme',
                  subtitle: 'Light',
                  onTap: () {
                    // Show theme picker
                  },
                ),
              ],
            ),
            if (isAdmin) ...[
              const SizedBox(height: 16),
              _buildSection(
                'System Configuration',
                [
                  _buildSettingsTile(
                    icon: Icons.settings,
                    title: 'System Settings',
                    subtitle: 'Configure system parameters',
                    onTap: () {
                      // Navigate to system settings
                    },
                  ),
                  _buildSettingsTile(
                    icon: Icons.wifi,
                    title: 'IP Restrictions',
                    subtitle: 'Manage allowed IP addresses',
                    onTap: () {
                      // Navigate to IP settings
                    },
                  ),
                  _buildSettingsTile(
                    icon: Icons.people,
                    title: 'User Management',
                    subtitle: 'Manage users and roles',
                    onTap: () {
                      // Navigate to user management
                    },
                  ),
                ],
              ),
            ],
            const SizedBox(height: 16),
            _buildSection(
              'About',
              [
                _buildSettingsTile(
                  icon: Icons.info,
                  title: 'App Version',
                  subtitle: '1.0.0',
                  onTap: null,
                ),
                _buildSettingsTile(
                  icon: Icons.description,
                  title: 'Terms of Service',
                  subtitle: 'Read our terms',
                  onTap: () {
                    // Show terms
                  },
                ),
                _buildSettingsTile(
                  icon: Icons.privacy_tip,
                  title: 'Privacy Policy',
                  subtitle: 'Read our privacy policy',
                  onTap: () {
                    // Show privacy policy
                  },
                ),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  final confirmed = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Sign Out'),
                      content: const Text('Are you sure you want to sign out?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text('Cancel'),
                        ),
                        ElevatedButton(
                          onPressed: () => Navigator.pop(context, true),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Sign Out'),
                        ),
                      ],
                    ),
                  );

                  if (confirmed == true) {
                    ref.read(authProvider.notifier).logout();
                  }
                },
                icon: const Icon(Icons.logout),
                label: const Text('Sign Out'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Card(
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF2563EB)),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: onTap != null ? const Icon(Icons.chevron_right) : null,
      onTap: onTap,
    );
  }

  void _showChangePasswordDialog() {
    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Change Password'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: currentPasswordController,
                decoration: const InputDecoration(labelText: 'Current Password'),
                obscureText: true,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: newPasswordController,
                decoration: const InputDecoration(labelText: 'New Password'),
                obscureText: true,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: confirmPasswordController,
                decoration: const InputDecoration(labelText: 'Confirm Password'),
                obscureText: true,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (newPasswordController.text != confirmPasswordController.text) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Passwords do not match')),
                );
                return;
              }
              // Call change password API
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Password changed successfully')),
              );
            },
            child: const Text('Change'),
          ),
        ],
      ),
    );
  }
}
