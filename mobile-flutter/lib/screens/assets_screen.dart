import 'package:flutter/material.dart';
import '../api/services.dart';

class AssetsScreen extends StatefulWidget {
  const AssetsScreen({super.key});

  @override
  State<AssetsScreen> createState() => _AssetsScreenState();
}

class _AssetsScreenState extends State<AssetsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _myAssets = [];
  List<dynamic> _allAssets = [];
  bool _isLoading = true;
  String? _error;
  dynamic _selectedAsset;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final myAssetsResponse = await assetService.getMyAssets();
      final allAssetsResponse = await assetService.getAssets();

      setState(() {
        _myAssets = myAssetsResponse['data'] ?? [];
        _allAssets = allAssetsResponse['data'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_selectedAsset != null) {
      return _buildDetailView();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Assets'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'My Assets'),
            Tab(text: 'All Assets'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildAssetsList(_myAssets, 'No assets assigned to you'),
                    _buildAssetsList(_allAssets, 'No assets found'),
                  ],
                ),
    );
  }

  Widget _buildAssetsList(List<dynamic> assets, String emptyMessage) {
    if (assets.isEmpty) {
      return Center(child: Text(emptyMessage));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: assets.length,
        itemBuilder: (context, index) {
          final asset = assets[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xFF2563EB),
                child: Icon(
                  _getAssetIcon(asset['asset_type']?['title']),
                  color: Colors.white,
                ),
              ),
              title: Text(
                asset['name'] ?? 'Unnamed Asset',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(asset['asset_type']?['title'] ?? 'Unknown Type'),
                  if (asset['serial_number'] != null)
                    Text(
                      'S/N: ${asset['serial_number']}',
                      style: const TextStyle(fontSize: 12),
                    ),
                ],
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildStatusBadge(asset['status'] ?? 'unknown'),
                  const SizedBox(height: 4),
                  _buildConditionBadge(asset['condition'] ?? 'unknown'),
                ],
              ),
              onTap: () {
                setState(() {
                  _selectedAsset = asset;
                });
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildDetailView() {
    final asset = _selectedAsset;
    return Scaffold(
      appBar: AppBar(
        title: Text(asset['name'] ?? 'Asset Details'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            setState(() {
              _selectedAsset = null;
            });
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: const Color(0xFF2563EB),
                          child: Icon(
                            _getAssetIcon(asset['asset_type']?['title']),
                            color: Colors.white,
                            size: 30,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                asset['name'] ?? 'Unnamed',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                asset['asset_type']?['title'] ?? 'Unknown Type',
                                style: const TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _buildStatusBadge(asset['status'] ?? 'unknown'),
                        const SizedBox(width: 8),
                        _buildConditionBadge(asset['condition'] ?? 'unknown'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Asset Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Divider(),
                    _buildDetailRow('Serial Number', asset['serial_number'] ?? 'N/A'),
                    _buildDetailRow('Location', asset['location'] ?? 'N/A'),
                    _buildDetailRow('Purchase Date', asset['purchase_date'] ?? 'N/A'),
                    if (asset['purchase_cost'] != null)
                      _buildDetailRow('Purchase Cost', '\$${asset['purchase_cost']}'),
                  ],
                ),
              ),
            ),
            if (asset['assigned_staff'] != null) ...[
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Assigned To',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Divider(),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: CircleAvatar(
                          backgroundColor: Colors.grey[300],
                          child: Text(
                            '${asset['assigned_staff']['first_name']?[0] ?? ''}${asset['assigned_staff']['last_name']?[0] ?? ''}'.toUpperCase(),
                          ),
                        ),
                        title: Text(
                          '${asset['assigned_staff']['first_name']} ${asset['assigned_staff']['last_name']}',
                        ),
                        subtitle: Text(asset['assigned_staff']['work_email'] ?? ''),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.grey),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  IconData _getAssetIcon(String? type) {
    switch (type?.toLowerCase()) {
      case 'laptop':
      case 'computer':
        return Icons.laptop;
      case 'phone':
      case 'mobile':
        return Icons.phone_android;
      case 'monitor':
      case 'display':
        return Icons.monitor;
      case 'keyboard':
        return Icons.keyboard;
      case 'mouse':
        return Icons.mouse;
      case 'furniture':
        return Icons.chair;
      case 'vehicle':
        return Icons.directions_car;
      default:
        return Icons.inventory_2;
    }
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'available':
        color = Colors.green;
        break;
      case 'assigned':
        color = Colors.blue;
        break;
      case 'maintenance':
        color = Colors.orange;
        break;
      case 'retired':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildConditionBadge(String condition) {
    Color color;
    switch (condition.toLowerCase()) {
      case 'excellent':
        color = Colors.green;
        break;
      case 'good':
        color = Colors.blue;
        break;
      case 'fair':
        color = Colors.orange;
        break;
      case 'poor':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        condition.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
